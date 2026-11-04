<?php

declare(strict_types=1);

namespace App;

use App\Http\HttpException;
use App\Http\Session;
use App\Repositories\UserRepository;
use App\Support\Password;

final class Auth
{
    /** @var array<string, mixed>|null */
    private ?array $user = null;

    public function __construct(
        private readonly UserRepository $users,
        private readonly RateLimiter $rateLimiter,
    ) {
    }

    /** @return array<string, mixed>|null */
    public function user(): ?array
    {
        if ($this->user !== null) {
            return $this->user;
        }

        $id = Session::get('user_id');
        if (!is_int($id) && !ctype_digit((string) $id)) {
            return null;
        }

        $user = $this->users->findById((int) $id);
        if ($user === null || (int) $user['is_active'] !== 1) {
            Session::forget('user_id');

            return null;
        }

        return $this->user = $user;
    }

    /** @return array<string, mixed> */
    public function requireUser(): array
    {
        $user = $this->user();
        if ($user === null) {
            throw new HttpException(401, 'Debes iniciar sesión.');
        }

        return $user;
    }

    /** @return array<string, mixed> */
    public function login(string $username, string $password, string $ip): array
    {
        $username = trim($username);

        if ($this->rateLimiter->tooManyAttempts($username, $ip)) {
            throw new HttpException(429, 'Demasiados intentos fallidos. Espera 15 minutos.');
        }

        $user = $this->users->findByUsername($username);
        $valid = $user !== null
            && (int) $user['is_active'] === 1
            && Password::verify($password, (string) $user['password_hash']);

        $this->rateLimiter->record($username, $ip, $valid);

        if (!$valid) {
            throw new HttpException(401, 'Usuario o contraseña incorrectos.');
        }

        if (Password::needsRehash((string) $user['password_hash'])) {
            $this->users->updatePassword((int) $user['id'], Password::hash($password));
        }

        $this->users->touchLogin((int) $user['id']);
        Session::regenerate();
        Session::set('user_id', (int) $user['id']);
        $this->user = $user;

        return $user;
    }

    public function changePassword(int $userId, string $currentPassword, string $newPassword): void
    {
        $user = $this->users->findWithHashById($userId);
        if ($user === null || !Password::verify($currentPassword, (string) $user['password_hash'])) {
            throw new HttpException(422, 'La contraseña actual no es correcta.');
        }
        if (strlen($newPassword) < 12) {
            throw new HttpException(422, 'La nueva contraseña debe tener al menos 12 caracteres.');
        }
        if (strlen($newPassword) > 200) {
            throw new HttpException(422, 'La nueva contraseña es demasiado larga.');
        }
        if (hash_equals($currentPassword, $newPassword)) {
            throw new HttpException(422, 'La nueva contraseña debe ser diferente a la actual.');
        }

        $this->users->updatePassword($userId, Password::hash($newPassword));
        Session::regenerate();
    }

    public function logout(): void
    {
        Session::destroy();
        $this->user = null;
    }
}
