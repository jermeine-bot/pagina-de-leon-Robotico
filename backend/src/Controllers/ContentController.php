<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Auth;
use App\Http\Csrf;
use App\Http\HttpException;
use App\Http\Request;
use App\Http\Response;
use App\Services\ContentService;

final class ContentController
{
    public function __construct(
        private readonly ContentService $content,
        private readonly Auth $auth,
    ) {
    }

    public function show(Request $request): Response
    {
        $payload = $this->content->publicContent();
        $etag = '"' . sha1((string) $payload['meta']['updatedAt'] . json_encode($payload['meta']['versions'])) . '"';

        if ($request->header('if-none-match') === $etag) {
            return new Response(304, '', ['ETag' => $etag, 'Cache-Control' => 'no-cache']);
        }

        return Response::json($payload, 200, [
            'ETag' => $etag,
            'Cache-Control' => 'no-cache',
        ]);
    }

    /** @param array<string, string> $params */
    public function update(Request $request, array $params): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        $section = $params['section'] ?? '';
        $body = $request->json();
        $content = $body['content'] ?? null;
        $version = $body['version'] ?? null;

        if (!is_int($version) && !ctype_digit((string) $version)) {
            throw new HttpException(422, 'Falta la versión de la sección.');
        }
        if (!is_array($content)) {
            throw new HttpException(422, 'Falta el contenido de la sección.');
        }

        $payload = $this->content->update(
            $section,
            $content,
            (int) $version,
            (int) $user['id'],
            $request->ip,
        );

        return Response::json($payload, 200, ['Cache-Control' => 'no-store']);
    }

    public function reset(Request $request): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        return Response::json(
            $this->content->reset((int) $user['id'], $request->ip),
            200,
            ['Cache-Control' => 'no-store'],
        );
    }

    public function import(Request $request): Response
    {
        $user = $this->auth->requireUser();
        Csrf::assertValid($request);

        $body = $request->json();
        $content = $body['content'] ?? null;
        if (!is_array($content)) {
            throw new HttpException(422, 'El respaldo debe incluir un objeto "content".');
        }

        return Response::json(
            $this->content->import($content, (int) $user['id'], $request->ip),
            200,
            ['Cache-Control' => 'no-store'],
        );
    }

    public function export(): Response
    {
        $this->auth->requireUser();
        $payload = $this->content->publicContent();

        return Response::json(
            ['content' => $payload['data'], 'meta' => $payload['meta']],
            200,
            [
                'Cache-Control' => 'no-store',
                'Content-Disposition' => 'attachment; filename="contenido-robotica.json"',
            ],
        );
    }

    public function activity(): Response
    {
        $this->auth->requireUser();

        return Response::json(['data' => $this->content->recentActivity(25)], 200, ['Cache-Control' => 'no-store']);
    }
}
