<?php

declare(strict_types=1);

namespace App\Support;

final class Log
{
    public static function error(string $message, array $context = []): void
    {
        $dir = dirname(__DIR__, 2) . '/storage/logs';
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        $line = sprintf(
            "[%s] %s %s\n",
            date('Y-m-d H:i:s'),
            $message,
            $context === [] ? '' : json_encode(self::redact($context), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        );

        @file_put_contents($dir . '/app.log', $line, FILE_APPEND | LOCK_EX);
    }

    /** @param array<string, mixed> $context */
    private static function redact(array $context): array
    {
        foreach (['password', 'password_hash', 'token', 'csrf'] as $key) {
            if (array_key_exists($key, $context)) {
                $context[$key] = '[redacted]';
            }
        }

        return $context;
    }
}
