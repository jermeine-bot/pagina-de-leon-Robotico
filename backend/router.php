<?php

declare(strict_types=1);

/**
 * Router para el servidor embebido de PHP:
 *   php -S 127.0.0.1:8787 -t backend backend/router.php
 * Simula el .htaccess de producción y sirve las imágenes de uploads.
 */

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

if (preg_match('#^/api/uploads/(.+)$#', $path, $matches)) {
    $file = __DIR__ . '/uploads/' . $matches[1];
    $real = realpath($file);
    $root = realpath(__DIR__ . '/uploads');

    if ($real !== false && $root !== false && str_starts_with($real, $root . DIRECTORY_SEPARATOR) && is_file($real)) {
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($real) ?: 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: public, max-age=31536000, immutable');
        readfile($real);

        return true;
    }

    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => ['status' => 404, 'message' => 'Archivo no encontrado.']]);

    return true;
}

require __DIR__ . '/index.php';

return true;
