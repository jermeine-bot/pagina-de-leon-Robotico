<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Auth;
use App\Http\Csrf;
use App\Http\HttpException;
use App\Http\Request;
use App\Http\Response;
use App\Services\MediaService;

final class MediaController
{
    public function __construct(
        private readonly MediaService $media,
        private readonly Auth $auth,
    ) {
    }

    public function upload(Request $request): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        $file = $request->files['file'] ?? null;
        if (!is_array($file)) {
            throw new HttpException(400, 'Falta el archivo "file".');
        }

        $result = $this->media->upload($file, (int) $user['id'], $request->ip);

        return Response::json(['data' => $result], 201, ['Cache-Control' => 'no-store']);
    }

    public function index(Request $request): Response
    {
        $this->auth->requireUser();

        return Response::json(['data' => $this->media->list()], 200, ['Cache-Control' => 'no-store']);
    }

    /** @param array<string, string> $params */
    public function delete(Request $request, array $params): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        $id = (int) ($params['id'] ?? 0);
        if ($id <= 0) {
            throw new HttpException(422, 'Identificador no válido.');
        }

        $this->media->delete($id, (int) $user['id'], $request->ip);

        return Response::json(['ok' => true], 200, ['Cache-Control' => 'no-store']);
    }
}
