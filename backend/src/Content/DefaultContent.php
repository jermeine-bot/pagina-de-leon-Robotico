<?php

declare(strict_types=1);

namespace App\Content;

use RuntimeException;

final class DefaultContent
{
    /** @var array<string, mixed>|null */
    private static ?array $cache = null;

    /** @return array<string, mixed> */
    public static function all(): array
    {
        if (self::$cache !== null) {
            return self::$cache;
        }

        $path = dirname(__DIR__, 2) . '/content/default-content.json';
        $raw = @file_get_contents($path);
        if ($raw === false) {
            throw new RuntimeException('No se encontró content/default-content.json.');
        }

        $decoded = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
        if (!is_array($decoded)) {
            throw new RuntimeException('default-content.json no contiene un objeto válido.');
        }

        return self::$cache = $decoded;
    }

    /** @return array<string, mixed> */
    public static function section(string $key): array
    {
        $all = self::all();
        if (!isset($all[$key]) || !is_array($all[$key])) {
            throw new RuntimeException("Sección desconocida: {$key}");
        }

        return $all[$key];
    }

    /** @return list<string> */
    public static function keys(): array
    {
        return array_keys(self::all());
    }
}
