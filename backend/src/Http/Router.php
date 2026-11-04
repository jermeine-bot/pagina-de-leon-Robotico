<?php

declare(strict_types=1);

namespace App\Http;

final class Router
{
    /** @var list<array{method: string, regex: string, paramNames: list<string>, handler: callable}> */
    private array $routes = [];

    public function add(string $method, string $pattern, callable $handler): void
    {
        $paramNames = [];
        $regex = preg_replace_callback(
            '#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#',
            static function (array $matches) use (&$paramNames): string {
                $paramNames[] = $matches[1];

                return '([A-Za-z0-9_-]+)';
            },
            $pattern,
        );

        $this->routes[] = [
            'method' => strtoupper($method),
            'regex' => '#^' . $regex . '$#',
            'paramNames' => $paramNames,
            'handler' => $handler,
        ];
    }

    /** @param array<string, string> $pathParams */
    public function dispatch(Request $request): Response
    {
        foreach ($this->routes as $route) {
            if ($route['method'] !== $request->method) {
                continue;
            }

            if (!preg_match($route['regex'], $request->path, $matches)) {
                continue;
            }

            array_shift($matches);
            $pathParams = array_combine($route['paramNames'], $matches) ?: [];

            return ($route['handler'])($request, $pathParams);
        }

        throw new HttpException(404, 'Ruta no encontrada.');
    }
}
