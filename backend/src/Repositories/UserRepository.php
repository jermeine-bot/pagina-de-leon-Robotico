<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class UserRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /** @return array<string, mixed>|null */
    public function findByUsername(string $username): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, username, password_hash, display_name, role, is_active
             FROM users WHERE username = :username LIMIT 1'
        );
        $statement->execute(['username' => $username]);

        $user = $statement->fetch();

        return $user === false ? null : $user;
    }

    /** @return array<string, mixed>|null */
    public function findById(int $id): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, username, display_name, role, is_active
             FROM users WHERE id = :id LIMIT 1'
        );
        $statement->execute(['id' => $id]);

        $user = $statement->fetch();

        return $user === false ? null : $user;
    }

    /** @return array<string, mixed>|null */
    public function findWithHashById(int $id): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT id, username, password_hash, display_name, role, is_active
             FROM users WHERE id = :id LIMIT 1'
        );
        $statement->execute(['id' => $id]);
        $user = $statement->fetch();

        return $user === false ? null : $user;
    }

    public function touchLogin(int $id): void
    {
        $statement = $this->pdo->prepare('UPDATE users SET last_login_at = NOW() WHERE id = :id');
        $statement->execute(['id' => $id]);
    }

    public function updatePassword(int $id, string $hash): void
    {
        $statement = $this->pdo->prepare('UPDATE users SET password_hash = :hash WHERE id = :id');
        $statement->execute(['hash' => $hash, 'id' => $id]);
    }

    /** @param array<string, mixed> $user */
    public static function publicProfile(array $user): array
    {
        return [
            'id' => (int) $user['id'],
            'username' => (string) $user['username'],
            'displayName' => (string) $user['display_name'],
            'role' => (string) $user['role'],
        ];
    }
}
