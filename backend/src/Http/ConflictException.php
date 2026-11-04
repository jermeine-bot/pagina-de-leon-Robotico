<?php

declare(strict_types=1);

namespace App\Http;

final class ConflictException extends HttpException
{
    /** @param array<string, mixed> $current */
    public function __construct(string $message, public readonly array $current)
    {
        parent::__construct(409, $message, ['current' => $current]);
    }
}
