<?php

declare(strict_types=1);

namespace App\Repositories;

use PDO;

final class ContentRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    /** @return array<string, array<string, mixed>> */
    public function all(): array
    {
        $statement = $this->pdo->query(
            'SELECT section_key, content, version, updated_at FROM content_sections ORDER BY section_key'
        );

        $sections = [];
        foreach ($statement->fetchAll() as $row) {
            $sections[(string) $row['section_key']] = [
                'content' => json_decode((string) $row['content'], true, 64, JSON_THROW_ON_ERROR),
                'version' => (int) $row['version'],
                'updatedAt' => (string) $row['updated_at'],
            ];
        }

        return $sections;
    }

    /** @return array<string, mixed>|null */
    public function findForUpdate(string $section): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT section_key, content, version FROM content_sections WHERE section_key = :key FOR UPDATE'
        );
        $statement->execute(['key' => $section]);

        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    /** @param array<string, mixed> $content */
    public function insert(string $section, array $content, int $version, ?int $userId): void
    {
        $statement = $this->pdo->prepare(
            'INSERT INTO content_sections (section_key, content, version, updated_by)
             VALUES (:key, :content, :version, :user)'
        );
        $statement->execute([
            'key' => $section,
            'content' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'version' => $version,
            'user' => $userId,
        ]);
    }

    /** @param array<string, mixed> $content */
    public function update(string $section, array $content, int $version, ?int $userId): void
    {
        $statement = $this->pdo->prepare(
            'UPDATE content_sections
             SET content = :content, version = :version, updated_by = :user
             WHERE section_key = :key'
        );
        $statement->execute([
            'key' => $section,
            'content' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'version' => $version,
            'user' => $userId,
        ]);
    }

    public function lastUpdatedAt(): ?string
    {
        $value = $this->pdo->query('SELECT MAX(updated_at) FROM content_sections')->fetchColumn();

        return $value === false || $value === null ? null : (string) $value;
    }

    public function begin(): void
    {
        $this->pdo->beginTransaction();
    }

    public function commit(): void
    {
        $this->pdo->commit();
    }

    public function rollback(): void
    {
        if ($this->pdo->inTransaction()) {
            $this->pdo->rollBack();
        }
    }
}
