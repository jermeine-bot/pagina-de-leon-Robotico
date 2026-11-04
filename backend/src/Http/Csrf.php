<?php

declare(strict_types=1);

namespace App\Http;

final class Csrf
{
    private const KEY = 'csrf_token';

    public static function token(): string
    {
        $token = Session::get(self::KEY);
        if (!is_string($token) || $token === '') {
            $token = bin2hex(random_bytes(32));
            Session::set(self::KEY, $token);
        }

        return $token;
    }

    public static function rotate(): string
    {
        $token = bin2hex(random_bytes(32));
        Session::set(self::KEY, $token);

        return $token;
    }

    public static function assertValid(Request $request): void
    {
        $token = $request->header('x-csrf-token');
        $expected = Session::get(self::KEY);

        if (!is_string($token) || !is_string($expected) || !hash_equals($expected, $token)) {
            throw new HttpException(419, 'La sesión expiró o el token CSRF no es válido.');
        }
    }

    /** Refuerzo para peticiones que ocurren antes de tener sesión (login). */
    public static function assertSameOrigin(Request $request): void
    {
        $origin = $request->header('origin');
        if ($origin === null) {
            return;
        }

        $host = $request->header('host') ?? '';
        $originHost = parse_url($origin, PHP_URL_HOST) ?: '';

        if ($originHost !== '' && strcasecmp((string) $host, (string) $originHost) !== 0) {
            // Compara también el puerto, que viene incluido en Host.
            $originAuthority = preg_replace('#^https?://#i', '', $origin);
            if (!is_string($originAuthority) || strcasecmp($originAuthority, (string) $host) !== 0) {
                throw new HttpException(403, 'Origen no permitido.');
            }
        }
    }
}
