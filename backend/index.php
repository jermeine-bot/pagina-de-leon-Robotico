<?php

declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

require __DIR__ . '/src/autoload.php';

use App\Auth;
use App\Config;
use App\Controllers\AuthController;
use App\Controllers\ContentController;
use App\Controllers\HealthController;
use App\Controllers\MediaController;
use App\Database;
use App\Http\HttpException;
use App\Http\Request;
use App\Http\Response;
use App\Http\Router;
use App\Http\Session;
use App\RateLimiter;
use App\Repositories\AuditRepository;
use App\Repositories\ContentRepository;
use App\Repositories\MediaRepository;
use App\Repositories\UserRepository;
use App\Services\ContentService;
use App\Services\MediaService;
use App\Support\Log;
use App\Validation\ContentValidator;

$config = Config::load(__DIR__);
$request = Request::fromGlobals($config->basePath());

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Frame-Options: DENY');

if ($request->contentLength() > 2_097_152 && str_contains((string) $request->header('content-type'), 'application/json')) {
    Response::error(413, 'La solicitud es demasiado grande.')->send();

    exit;
}

try {
    Session::start($config, $request);
    $pdo = Database::connect($config);
} catch (Throwable $exception) {
    Log::error('No se pudo iniciar la aplicación.', ['exception' => $exception->getMessage()]);
    Response::error(503, 'Servicio temporalmente no disponible.')->send();

    exit;
}

$users = new UserRepository($pdo);
$audit = new AuditRepository($pdo);
$rateLimiter = new RateLimiter($pdo);
$auth = new Auth($users, $rateLimiter);

$contentService = new ContentService(new ContentRepository($pdo), new ContentValidator(), $audit);
$mediaService = new MediaService(new MediaRepository($pdo), $audit, $config);

$authController = new AuthController($auth, $audit);
$contentController = new ContentController($contentService, $auth);
$mediaController = new MediaController($mediaService, $auth);
$healthController = new HealthController($pdo);

$router = new Router();

$router->add('GET', '/health', static fn (Request $r): Response => $healthController->show());
$router->add('GET', '/content', static fn (Request $r): Response => $contentController->show($r));
$router->add('GET', '/content/export', static fn (Request $r): Response => $contentController->export());
$router->add('GET', '/content/activity', static fn (Request $r): Response => $contentController->activity());
$router->add('POST', '/content/reset', static fn (Request $r): Response => $contentController->reset($r));
$router->add('POST', '/content/import', static fn (Request $r): Response => $contentController->import($r));
$router->add('PUT', '/content/{section}', static fn (Request $r, array $p): Response => $contentController->update($r, $p));

$router->add('GET', '/auth/csrf', static fn (Request $r): Response => $authController->csrf($r));
$router->add('POST', '/auth/login', static fn (Request $r): Response => $authController->login($r));
$router->add('GET', '/auth/me', static fn (Request $r): Response => $authController->me($r));
$router->add('POST', '/auth/logout', static fn (Request $r): Response => $authController->logout($r));
$router->add('PUT', '/auth/password', static fn (Request $r): Response => $authController->changePassword($r));

$router->add('POST', '/media', static fn (Request $r): Response => $mediaController->upload($r));
$router->add('GET', '/media', static fn (Request $r): Response => $mediaController->index($r));
$router->add('DELETE', '/media/{id}', static fn (Request $r, array $p): Response => $mediaController->delete($r, $p));

try {
    $response = $router->dispatch($request);
    $response->send($request->method === 'HEAD');
} catch (HttpException $exception) {
    Response::json(
        ['error' => ['status' => $exception->status, 'message' => $exception->getMessage()] + $exception->details],
        $exception->status,
        ['Cache-Control' => 'no-store'],
    )->send();
} catch (Throwable $exception) {
    Log::error('Error no controlado.', [
        'exception' => $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine(),
        'path' => $request->path,
    ]);
    $message = $config->isProduction() ? 'Error interno del servidor.' : $exception->getMessage();
    Response::error(500, $message)->send();
}
