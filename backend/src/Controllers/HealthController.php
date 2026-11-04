<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Http\Response;
use PDO;
use Throwable;

final class HealthController
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function show(): Response
    {
        try {
            $this->pdo->query('SELECT 1');
            $database = 'up';
        } catch (Throwable) {
            $database = 'down';
        }

        return Response::json([
            'ok' => $database === 'up',
            'database' => $database,
            'php' => PHP_VERSION,
            'time' => gmdate('c'),
        ], $database === 'up' ? 200 : 503, ['Cache-Control' => 'no-store']);
    }
}
