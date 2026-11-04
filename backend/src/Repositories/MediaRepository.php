<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class MediaRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /** @param array<string, mixed> $media */
    public function insert(array $media): int
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO media (path, original_name, mime_type, size_bytes, width, height, uploaded_by)
             VALUES (:path, :original_name, :mime_type, :size_bytes, :width, :height, :uploaded_by)'
        );

        $statement->execute([
            'path' => $media['path'],
            'original_name' => $media['originalName'],
            'mime_type' => $media['mimeType'],
            'size_bytes' => $media['sizeBytes'],
            'width' => $media['width'],
            'height' => $media['height'],
            'uploaded_by' => $media['uploadedBy'],
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    /** @return array<string, mixed>|null */
    public function find(int $id): ?array
    {
        $statement = $this->pdo->prepare('SELECT * FROM media WHERE id = :id LIMIT 1');
        $statement->execute(['id' => $id]);
        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    public function delete(int $id): void
    {
        $statement = $this->pdo->prepare('DELETE FROM media WHERE id = :id');
        $statement->execute(['id' => $id]);
    }

    /** @return list<array<string, mixed>> */
    public function recent(int $limit = 50): array
    {
        $limit = max(1, min(200, $limit));
        $statement = $this->pdo->query(
            "SELECT id, path, original_name, mime_type, size_bytes, width, height, created_at
             FROM media ORDER BY id DESC LIMIT {$limit}"
        );

        return $statement->fetchAll();
    }
}
