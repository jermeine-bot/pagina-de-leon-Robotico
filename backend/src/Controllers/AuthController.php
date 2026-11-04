<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Auth;
use App\Http\Csrf;
use App\Http\HttpException;
use App\Http\Request;
use App\Http\Response;
use App\Repositories\AuditRepository;
use App\Repositories\UserRepository;

final class AuthController
{
    public function __construct(
        private readonly Auth $auth,
        private readonly AuditRepository $audit,
    ) {
    }

    public function csrf(Request $request): Response
    {
        return Response::json(['csrfToken' => Csrf::token()], 200, ['Cache-Control' => 'no-store']);
    }

    public function login(Request $request): Response
    {
        Csrf::assertSameOrigin($request);
        $body = $request->json();
        $username = $body['username'] ?? null;
        $password = $body['password'] ?? null;

        if (!is_string($username) || !is_string($password) || trim($username) === '' || $password === '') {
            throw new HttpException(422, 'Usuario y contraseña son obligatorios.');
        }
        if (strlen($username) > 64 || strlen($password) > 200) {
            throw new HttpException(422, 'Credenciales no válidas.');
        }

        $user = $this->auth->login(trim($username), $password, $request->ip);
        $this->audit->record((int) $user['id'], 'auth.login', null, $request->ip, ['username' => $user['username']]);

        return Response::json([
            'user' => UserRepository::publicProfile($user),
            'csrfToken' => Csrf::rotate(),
        ], 200, ['Cache-Control' => 'no-store']);
    }

    public function me(Request $request): Response
    {
        $user = $this->auth->user();

        return Response::json([
            'user' => $user === null ? null : UserRepository::publicProfile($user),
            'csrfToken' => $user === null ? null : Csrf::token(),
        ], 200, ['Cache-Control' => 'no-store']);
    }

    public function changePassword(Request $request): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        $body = $request->json();
        $current = $body['currentPassword'] ?? null;
        $new = $body['newPassword'] ?? null;

        if (!is_string($current) || !is_string($new) || $current === '' || $new === '') {
            throw new HttpException(422, 'Debes indicar la contraseña actual y la nueva.');
        }

        $this->auth->changePassword((int) $user['id'], $current, $new);
        $this->audit->record((int) $user['id'], 'auth.password', null, $request->ip);

        return Response::json(['ok' => true], 200, ['Cache-Control' => 'no-store']);
    }

    public function logout(Request $request): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);
        $this->audit->record((int) $user['id'], 'auth.logout', null, $request->ip);
        $this->auth->logout();

        return Response::json(['ok' => true], 200, ['Cache-Control' => 'no-store']);
    }
}
