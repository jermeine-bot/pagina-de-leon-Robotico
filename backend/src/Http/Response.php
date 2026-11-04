<?php

declare(strict_types=1);

namespace App\Http;

final class Response
{
    /** @param array<string, string> $headers */
    public function __construct(
        public readonly int $status,
        public readonly string $body,
        public readonly array $headers = [],
    ) {
    }

    /** @param array<string, mixed> $payload */
    public static function json(array $payload, int $status = 200, array $headers = []): self
    {
        return new self(
            $status,
            json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
            ['Content-Type' => 'application/json; charset=utf-8'] + $headers,
        );
    }

    /** @param array<string, mixed> $payload */
    public static function error(int $status, string $message, array $details = []): self
    {
        return self::json(['error' => ['status' => $status, 'message' => $message] + $details], $status);
    }

    /** @param array<string, string> $headers */
    public static function file(string $path, string $mime, array $headers = []): self
    {
        return new self(200, (string) file_get_contents($path), ['Content-Type' => $mime] + $headers);
    }

    public function send(bool $headOnly = false): void
    {
        http_response_code($this->status);
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: same-origin');
        header('X-Frame-Options: DENY');

        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }

        if (!$headOnly) {
            echo $this->body;
        }
    }
}
