<?php

declare(strict_types=1);

namespace App\Services;

use App\Content\DefaultContent;
use App\Http\ConflictException;
use App\Http\ValidationException;
use App\Repositories\AuditRepository;
use App\Repositories\ContentRepository;
use App\Validation\ContentValidator;
use Throwable;

final class ContentService
{
    public function __construct(
        private readonly ContentRepository $sections,
        private readonly ContentValidator $validator,
        private readonly AuditRepository $audit,
    ) {
    }

    /** @return array{data: array<string, mixed>, meta: array<string, mixed>} */
    public function publicContent(): array
    {
        $rows = $this->sections->all();
        $defaults = DefaultContent::all();
        $data = [];
        $versions = [];

        foreach ($defaults as $key => $default) {
            $row = $rows[$key] ?? null;
            $data[$key] = $row['content'] ?? $default;
            $versions[$key] = $row['version'] ?? 0;
        }

        return [
            'data' => $data,
            'meta' => [
                'versions' => $versions,
                'updatedAt' => $this->sections->lastUpdatedAt(),
            ],
        ];
    }

    /** @return array<string, mixed> */
    public function section(string $key): array
    {
        $content = $this->publicContent();

        return [
            'data' => $content['data'][$key] ?? null,
            'meta' => ['version' => $content['meta']['versions'][$key] ?? 0],
        ];
    }

    /**
     * @param array<string, mixed> $content
     * @return array{data: array<string, mixed>, meta: array<string, mixed>}
     */
    public function update(string $section, array $content, int $expectedVersion, int $userId, string $ip): array
    {
        $this->assertSection($section);
        $normalized = $this->validator->validate($section, $content);

        $this->sections->begin();
        try {
            $row = $this->sections->findForUpdate($section);
            $currentVersion = $row === null ? 0 : (int) $row['version'];

            if ($expectedVersion !== $currentVersion) {
                $this->sections->rollback();
                throw new ConflictException(
                    'Otra persona guardó esta sección mientras editabas. Recarga los datos.',
                    [
                        'content' => $row === null ? DefaultContent::section($section) : json_decode((string) $row['content'], true),
                        'version' => $currentVersion,
                    ],
                );
            }

            $nextVersion = $currentVersion + 1;
            if ($row === null) {
                $this->sections->insert($section, $normalized, $nextVersion, $userId);
            } else {
                $this->sections->update($section, $normalized, $nextVersion, $userId);
            }

            $this->audit->record($userId, 'content.update', $section, $ip, ['version' => $nextVersion]);
            $this->sections->commit();

            return [
                'data' => $normalized,
                'meta' => [
                    'section' => $section,
                    'version' => $nextVersion,
                    'updatedAt' => $this->sections->lastUpdatedAt(),
                ],
            ];
        } catch (Throwable $exception) {
            $this->sections->rollback();
            throw $exception;
        }
    }

    /** @return array{data: array<string, mixed>, meta: array<string, mixed>} */
    public function reset(int $userId, string $ip): array
    {
        $rows = $this->sections->all();
        $defaults = DefaultContent::all();

        $this->sections->begin();
        try {
            foreach ($defaults as $key => $default) {
                $current = isset($rows[$key]) ? (int) $rows[$key]['version'] : 0;
                $next = $current + 1;
                if (isset($rows[$key])) {
                    $this->sections->update($key, $default, $next, $userId);
                } else {
                    $this->sections->insert($key, $default, $next, $userId);
                }
            }
            $this->audit->record($userId, 'content.reset', null, $ip);
            $this->sections->commit();
        } catch (Throwable $exception) {
            $this->sections->rollback();
            throw $exception;
        }

        return $this->publicContent();
    }

    /**
     * Importa un respaldo JSON. Solo reemplaza las secciones presentes.
     *
     * @param array<string, mixed> $content
     * @return array{data: array<string, mixed>, meta: array<string, mixed>}
     */
    public function import(array $content, int $userId, string $ip): array
    {
        $known = DefaultContent::keys();
        $unknown = array_diff(array_keys($content), $known);
        if ($unknown !== []) {
            throw new ValidationException(['content' => 'Secciones desconocidas: ' . implode(', ', $unknown)]);
        }
        if (count($content) === 0) {
            throw new ValidationException(['content' => 'El respaldo no contiene secciones.']);
        }

        $normalized = [];
        foreach ($content as $key => $section) {
            if (!is_array($section)) {
                throw new ValidationException([$key => 'Contenido no válido.']);
            }
            $normalized[$key] = $this->validator->validate((string) $key, $section);
        }

        $this->sections->begin();
        try {
            $rows = $this->sections->all();
            foreach ($normalized as $key => $section) {
                $current = isset($rows[$key]) ? (int) $rows[$key]['version'] : 0;
                $next = $current + 1;
                if (isset($rows[$key])) {
                    $this->sections->update($key, $section, $next, $userId);
                } else {
                    $this->sections->insert($key, $section, $next, $userId);
                }
            }
            $this->audit->record($userId, 'content.import', null, $ip, ['sections' => array_keys($normalized)]);
            $this->sections->commit();
        } catch (Throwable $exception) {
            $this->sections->rollback();
            throw $exception;
        }

        return $this->publicContent();
    }

    /** @return list<array<string, mixed>> */
    public function recentActivity(int $limit = 20): array
    {
        return $this->audit->recent($limit);
    }

    private function assertSection(string $section): void
    {
        if (!in_array($section, DefaultContent::keys(), true)) {
            throw new ValidationException(['section' => 'Sección desconocida.']);
        }
    }
}
