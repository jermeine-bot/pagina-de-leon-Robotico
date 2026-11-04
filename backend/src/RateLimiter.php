<?php

declare(strict_types=1);

namespace App;

use PDO;

final class RateLimiter
{
    private const MAX_ATTEMPTS = 5;
    private const WINDOW_MINUTES = 15;

    public function __construct(private readonly PDO $pdo)
    {
    }

    public function tooManyAttempts(string $username, string $ip): bool
    {
        $statement = $this->pdo->prepare(
            'SELECT COUNT(*) FROM login_attempts
             WHERE username = :username AND ip = :ip AND success = 0
               AND attempted_at > (NOW() - INTERVAL ' . self::WINDOW_MINUTES . ' MINUTE)'
        );
        $statement->bindValue(':username', $username, PDO::PARAM_STR);
        $statement->bindValue(':ip', inet_pton($ip) ?: '', PDO::PARAM_STR);
        $statement->execute();

        return (int) $statement->fetchColumn() >= self::MAX_ATTEMPTS;
    }

    public function record(string $username, string $ip, bool $success): void
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO login_attempts (username, ip, success) VALUES (:username, :ip, :success)'
        );
        $statement->bindValue(':username', $username, PDO::PARAM_STR);
        $statement->bindValue(':ip', inet_pton($ip) ?: '', PDO::PARAM_STR);
        $statement->bindValue(':success', $success, PDO::PARAM_INT);
        $statement->execute();

        if ($success) {
            $cleanup = $this->pdo->prepare(
                'DELETE FROM login_attempts WHERE username = :username AND ip = :ip AND success = 0'
            );
            $cleanup->bindValue(':username', $username, PDO::PARAM_STR);
            $cleanup->bindValue(':ip', inet_pton($ip) ?: '', PDO::PARAM_STR);
            $cleanup->execute();
        }
    }
}
