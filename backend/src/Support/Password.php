<?php

declare(strict_types=1);

namespace App\Support;

final class Password
{
    /** @return string|int */
    private static function algorithm(): string|int
    {
        return defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
    }

    /** @return array<string, int> */
    private static function options(): array
    {
        return self::algorithm() === PASSWORD_BCRYPT ? ['cost' => 12] : [];
    }

    public static function hash(string $password): string
    {
        return password_hash($password, self::algorithm(), self::options());
    }

    public static function verify(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, self::algorithm(), self::options());
    }
}
