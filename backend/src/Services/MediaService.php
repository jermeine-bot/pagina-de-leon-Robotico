<?php

declare(strict_types=1);

namespace App\Services;

use App\Config;
use App\Http\HttpException;
use App\Repositories\AuditRepository;
use App\Repositories\MediaRepository;
use App\Support\Text;
use RuntimeException;

final class MediaService
{
    private const ALLOWED = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/gif' => 'gif',
    ];

    public function __construct(
        private readonly MediaRepository $media,
        private readonly AuditRepository $audit,
        private readonly Config $config,
    ) {
    }

    /**
     * @param array<string, mixed> $file
     * @return array<string, mixed>
     */
    public function upload(array $file, int $userId, string $ip): array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw $this->uploadError((int) ($file['error'] ?? UPLOAD_ERR_NO_FILE));
        }

        $tmp = (string) ($file['tmp_name'] ?? '');
        $size = (int) ($file['size'] ?? 0);
        $maxBytes = $this->config->int('UPLOAD_MAX_BYTES', 5_242_880);

        if ($size <= 0 || $size > $maxBytes) {
            throw new HttpException(422, 'La imagen supera el tamaño máximo de ' . round($maxBytes / 1048576, 1) . ' MB.');
        }
        if (!is_uploaded_file($tmp)) {
            throw new HttpException(400, 'Archivo no válido.');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = (string) $finfo->file($tmp);
        if (!isset(self::ALLOWED[$mime])) {
            throw new HttpException(422, 'Formato no permitido. Usa JPG, PNG, WEBP o GIF.');
        }

        $dimensions = @getimagesize($tmp);
        if ($dimensions === false) {
            throw new HttpException(422, 'El archivo no es una imagen válida.');
        }

        [$width, $height] = $dimensions;
        if ($width > 8000 || $height > 8000) {
            throw new HttpException(422, 'La imagen es demasiado grande (máximo 8000 px por lado).');
        }

        $relativeDir = 'uploads/' . date('Y/m');
        $absoluteDir = dirname(__DIR__, 2) . '/' . $relativeDir;
        if (!is_dir($absoluteDir) && !mkdir($absoluteDir, 0775, true) && !is_dir($absoluteDir)) {
            throw new RuntimeException('No se pudo crear el directorio de subidas.');
        }

        $extension = self::ALLOWED[$mime];
        $filename = bin2hex(random_bytes(16)) . '.' . $extension;
        $absolutePath = $absoluteDir . '/' . $filename;

        if (!move_uploaded_file($tmp, $absolutePath)) {
            throw new RuntimeException('No se pudo guardar la imagen.');
        }
        @chmod($absolutePath, 0644);

        $relativePath = $relativeDir . '/' . $filename;
        $id = $this->media->insert([
            'path' => $relativePath,
            'originalName' => Text::slice((string) ($file['name'] ?? 'imagen'), 0, 255),
            'mimeType' => $mime,
            'sizeBytes' => $size,
            'width' => $width,
            'height' => $height,
            'uploadedBy' => $userId,
        ]);

        $this->audit->record($userId, 'media.upload', $relativePath, $ip, ['id' => $id, 'mime' => $mime]);

        return [
            'id' => $id,
            'url' => $this->url($relativePath),
            'path' => $relativePath,
            'mimeType' => $mime,
            'sizeBytes' => $size,
            'width' => $width,
            'height' => $height,
        ];
    }

    /** @return list<array<string, mixed>> */
    public function list(): array
    {
        return array_map(function (array $item): array {
            $item['url'] = $this->url((string) $item['path']);

            return $item;
        }, $this->media->recent());
    }

    public function delete(int $id, int $userId, string $ip): void
    {
        $media = $this->media->find($id);
        if ($media === null) {
            throw new HttpException(404, 'Imagen no encontrada.');
        }

        $absolute = dirname(__DIR__, 2) . '/' . $media['path'];
        $real = realpath($absolute);
        $root = realpath(dirname(__DIR__, 2) . '/uploads');

        if ($real !== false && $root !== false && str_starts_with($real, $root . DIRECTORY_SEPARATOR)) {
            @unlink($real);
        }

        $this->media->delete($id);
        $this->audit->record($userId, 'media.delete', (string) $media['path'], $ip, ['id' => $id]);
    }

    public function url(string $relativePath): string
    {
        $base = '/' . trim($this->config->get('UPLOAD_BASE_PATH', '/api/uploads'), '/');
        $relativePath = preg_replace('#^uploads/#', '', ltrim($relativePath, '/'));

        return $base . '/' . $relativePath;
    }

    private function uploadError(int $code): HttpException
    {
        return match ($code) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => new HttpException(413, 'La imagen supera el límite permitido.'),
            UPLOAD_ERR_PARTIAL => new HttpException(400, 'La carga se interrumpió. Inténtalo de nuevo.'),
            UPLOAD_ERR_NO_FILE => new HttpException(400, 'No se recibió ninguna imagen.'),
            default => new HttpException(400, 'No se pudo procesar la imagen.'),
        };
    }
}
