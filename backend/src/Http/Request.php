<?php

declare(strict_types=1);

namespace App\Http;

final class Request
{
    /** @var array<string, mixed>|null */
    private ?array $json = null;

    /**
     * @param array<string, mixed> $query
     * @param array<string, mixed> $files
     * @param array<string, string> $headers
     */
    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $query,
        public readonly array $files,
        public readonly array $headers,
        private readonly string $rawBody,
        public readonly string $ip,
        public readonly bool $secure,
    ) {
    }

    public static function fromGlobals(string $basePath = ''): self
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH) ?: '/';

        if ($basePath !== '' && str_starts_with($path, $basePath)) {
            $path = substr($path, strlen($basePath));
        }

        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = strtolower(str_replace('_', '-', substr($key, 5)));
                $headers[$name] = (string) $value;
            }
        }

        $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            '/' . ltrim($path, '/'),
            $_GET,
            $_FILES,
            $headers,
            (string) file_get_contents('php://input'),
            (string) ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'),
            $https,
        );
    }

    public function header(string $name): ?string
    {
        return $this->headers[strtolower($name)] ?? null;
    }

    /** @return array<string, mixed> */
    public function json(): array
    {
        if ($this->json !== null) {
            return $this->json;
        }

        if ($this->rawBody === '') {
            return $this->json = [];
        }

        try {
            $decoded = json_decode($this->rawBody, true, 64, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            throw new HttpException(400, 'El cuerpo de la solicitud no es JSON válido.');
        }

        if (!is_array($decoded)) {
            throw new HttpException(400, 'El cuerpo de la solicitud debe ser un objeto JSON.');
        }

        return $this->json = $decoded;
    }

    public function contentLength(): int
    {
        return (int) ($this->header('content-length') ?? 0);
    }
}
