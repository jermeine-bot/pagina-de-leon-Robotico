<?php

declare(strict_types=1);

namespace App\Http;

final class ValidationException extends HttpException
{
    /** @param array<string, string> $errors */
    public function __construct(public readonly array $errors)
    {
        parent::__construct(422, 'Los datos enviados no son válidos.', ['errors' => $errors]);
    }
}
