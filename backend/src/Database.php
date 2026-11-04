<?php

declare(strict_types=1);

namespace App;

use PDO;
use PDOException;
use RuntimeException;

final class Database
{
    private static ?PDO $connection = null;

    public static function connect(Config $config): PDO
    {
        if (self::$connection instanceof PDO) {
            return self::$connection;
        }

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config->get('DB_HOST', '127.0.0.1'),
            $config->int('DB_PORT', 3306),
            $config->get('DB_NAME'),
            $config->get('DB_CHARSET', 'utf8mb4'),
        );

        try {
            self::$connection = new PDO(
                $dsn,
                $config->get('DB_USER'),
                $config->get('DB_PASS'),
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ],
            );
        } catch (PDOException $exception) {
            throw new RuntimeException('No se pudo conectar a la base de datos.', 0, $exception);
        }

        return self::$connection;
    }
}
