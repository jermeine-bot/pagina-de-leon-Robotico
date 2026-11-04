<?php

declare(strict_types=1);

/**
 * Crea el esquema, el usuario administrador y el contenido inicial.
 * Uso: php backend/bin/setup.php
 */

require __DIR__ . '/../src/autoload.php';

use App\Config;
use App\Content\DefaultContent;
use App\Database;
use App\Support\Password;

$config = Config::load(dirname(__DIR__));
$pdo = Database::connect($config);

$migration = dirname(__DIR__) . '/migrations/001_schema.sql';
$sql = file_get_contents($migration);
if ($sql === false) {
    fwrite(STDERR, "No se encontró {$migration}\n");
    exit(1);
}

$statements = preg_split('/;\s*(?:\r?\n|$)/', $sql) ?: [];
foreach ($statements as $statement) {
    $statement = trim($statement);
    if ($statement === '' || str_starts_with($statement, '--') || str_starts_with($statement, 'SET NAMES')) {
        continue;
    }
    $pdo->exec($statement);
}
echo "Esquema aplicado.\n";

$username = $config->get('SEED_ADMIN_USER', 'admin');
$password = $config->get('SEED_ADMIN_PASSWORD', '');
$displayName = $config->get('SEED_ADMIN_NAME', 'Administrador');

if ($password === '') {
    fwrite(STDERR, "Define SEED_ADMIN_PASSWORD en backend/.env antes de ejecutar setup.\n");
    exit(1);
}
if (strlen($password) < 12) {
    fwrite(STDERR, "SEED_ADMIN_PASSWORD debe tener al menos 12 caracteres.\n");
    exit(1);
}

$exists = $pdo->prepare('SELECT id FROM users WHERE username = :username');
$exists->execute(['username' => $username]);
$adminId = $exists->fetchColumn();

if ($adminId === false) {
    $insert = $pdo->prepare(
        'INSERT INTO users (username, password_hash, display_name, role)
         VALUES (:username, :hash, :name, :role)'
    );
    $insert->execute([
        'username' => $username,
        'hash' => Password::hash($password),
        'name' => $displayName,
        'role' => 'admin',
    ]);
    $adminId = (int) $pdo->lastInsertId();
    echo "Usuario '{$username}' creado.\n";
} else {
    $adminId = (int) $adminId;
    echo "El usuario '{$username}' ya existe; no se modificó la contraseña.\n";
}

$insertSection = $pdo->prepare(
    'INSERT IGNORE INTO content_sections (section_key, content, version, updated_by)
     VALUES (:key, :content, 1, :user)'
);
$created = 0;
foreach (DefaultContent::all() as $key => $content) {
    $insertSection->execute([
        'key' => $key,
        'content' => json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        'user' => $adminId,
    ]);
    $created += $insertSection->rowCount();
}
echo "Secciones iniciales creadas: {$created}.\n";

foreach ([dirname(__DIR__) . '/uploads', dirname(__DIR__) . '/storage/logs'] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
}

echo "Listo. Revisa backend/.env y no publiques ese archivo.\n";
