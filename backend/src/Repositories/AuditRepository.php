<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class AuditRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /** @param array<string, mixed> $metadata */
    public function record(?int $userId, string $action, ?string $target, string $ip, array $metadata = []): void
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO audit_log (user_id, action, target, ip, metadata)
             VALUES (:user_id, :action, :target, :ip, :metadata)'
        );

        $statement->execute([
            'user_id' => $userId,
            'action' => $action,
            'target' => $target,
            'ip' => inet_pton($ip) ?: null,
            'metadata' => $metadata === []
                ? null
                : json_encode($metadata, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
    }

    /** @return list<array<string, mixed>> */
    public function recent(int $limit = 20): array
    {
        $limit = max(1, min(100, $limit));
        $statement = $this->pdo->query(
            "SELECT a.id, a.action, a.target, a.metadata, a.created_at,
                    u.username, u.display_name
             FROM audit_log a
             LEFT JOIN users u ON u.id = a.user_id
             ORDER BY a.id DESC
             LIMIT {$limit}"
        );

        return $statement->fetchAll();
    }
}
