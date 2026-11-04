<?php

declare(strict_types=1);

namespace App;

use RuntimeException;

final class Config
{
    /** @param array<string, string> $values */
    private function __construct(private array $values)
    {
    }

    public static function load(string $backendDir): self
    {
        $values = [];

        $envFile = getenv('CMS_ENV_FILE') ?: null;
        if ($envFile === null) {
            $envFile = is_file($backendDir . '/.env')
                ? $backendDir . '/.env'
                : dirname($backendDir) . '/.env';
        }
        if (is_file($envFile)) {
            $values = self::parseEnvFile($envFile);
        }

        foreach ($_ENV as $key => $value) {
            if (is_string($value)) {
                $values[$key] = $value;
            }
        }

        $environment = getenv();
        if (is_array($environment)) {
            foreach ($environment as $key => $value) {
                if (is_string($value) && !isset($values[$key])) {
                    $values[$key] = $value;
                }
            }
        }

        return new self($values);
    }

    /** @return array<string, string> */
    private static function parseEnvFile(string $path): array
    {
        $values = [];
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [];

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            if ($value !== '' && ($value[0] === '"' || $value[0] === "'")) {
                $value = trim($value, $value[0]);
            }

            $values[$key] = $value;
        }

        return $values;
    }

    public function get(string $key, ?string $default = null): string
    {
        $value = $this->values[$key] ?? $default;
        if ($value === null) {
            throw new RuntimeException("Missing configuration value: {$key}");
        }

        return $value;
    }

    public function int(string $key, int $default): int
    {
        $value = $this->values[$key] ?? null;

        return $value !== null && is_numeric($value) ? (int) $value : $default;
    }

    public function bool(string $key, bool $default): bool
    {
        $value = $this->values[$key] ?? null;
        if ($value === null) {
            return $default;
        }

        return in_array(strtolower($value), ['1', 'true', 'yes', 'on'], true);
    }

    public function isProduction(): bool
    {
        return $this->get('APP_ENV', 'production') === 'production';
    }

    public function basePath(): string
    {
        $path = '/' . trim($this->get('APP_BASE_PATH', '/api'), '/');

        return $path === '/' ? '' : $path;
    }
}
