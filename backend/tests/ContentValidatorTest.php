<?php

declare(strict_types=1);

/**
 * Prueba de regresión del validador de contenido.
 *
 * Uso:
 *   php backend/tests/ContentValidatorTest.php
 */

require __DIR__ . '/../src/autoload.php';

use App\Content\DefaultContent;
use App\Http\ValidationException;
use App\Validation\ContentValidator;

$listSections = ['journey', 'learningCards', 'gallery', 'projects', 'kidsRobots', 'faqs', 'announcements'];
$failures = [];

$check = static function (bool $condition, string $message) use (&$failures): void {
    if (!$condition) {
        $failures[] = $message;
    }
};

$validator = new ContentValidator();

foreach (DefaultContent::all() as $section => $content) {
    try {
        $validated = $validator->validate($section, $content);
        $check($validated === $content, "La sección {$section} cambió al validar los valores iniciales.");
    } catch (Throwable $exception) {
        $failures[] = "La sección {$section} no valida sus valores iniciales: {$exception->getMessage()}";
    }
}

foreach ($listSections as $section) {
    $content = DefaultContent::section($section);

    try {
        $validator->validate($section, ['valor' => 'no es una lista']);
        $failures[] = "La sección {$section} aceptó un objeto cuando esperaba una lista.";
    } catch (ValidationException $exception) {
        $check(
            ($exception->errors['content'] ?? '') === 'El contenido debe ser una lista.',
            "La sección {$section} devolvió un error inesperado al recibir un objeto.",
        );
    }

    $copy = $content;
    $copy[] = ['campo' => 'inválido'];
    try {
        $validator->validate($section, $copy);
        $failures[] = "La sección {$section} aceptó un elemento con forma inválida.";
    } catch (ValidationException) {
        // Esperado: el elemento no tiene los campos de la sección.
    }
}

foreach (['settings', 'hero', 'intro', 'moments', 'institutional', 'contact'] as $section) {
    try {
        $validator->validate($section, []);
        $failures[] = "La sección {$section} aceptó una lista cuando esperaba un objeto.";
    } catch (ValidationException $exception) {
        $check(
            ($exception->errors['content'] ?? '') === 'El contenido debe ser un objeto.',
            "La sección {$section} devolvió un error inesperado al recibir una lista.",
        );
    }
}

$editedAnnouncements = DefaultContent::section('announcements');
$editedAnnouncements[0]['title'] = 'Anuncio editable de prueba';
$editedAnnouncements[0]['text'] = 'Contenido que debe conservarse al guardar.';
$editedAnnouncements[0]['enabled'] = false;
try {
    $validated = $validator->validate('announcements', $editedAnnouncements);
    $check(
        $validated === $editedAnnouncements,
        'La sección announcements no conservó cambios válidos al validarlos.',
    );
} catch (Throwable $exception) {
    $failures[] = "La sección announcements no aceptó cambios válidos: {$exception->getMessage()}";
}

$announcements = DefaultContent::section('announcements');
$announcements[0]['link'] = 'javascript:alert(1)';
try {
    $validator->validate('announcements', $announcements);
    $failures[] = 'La sección announcements aceptó un enlace javascript:.';
} catch (ValidationException $exception) {
    $check(
        isset($exception->errors['announcements.0.link']),
        'El enlace inválido no se reportó en announcements.0.link.',
    );
}

if ($failures !== []) {
    fwrite(STDERR, "Fallos:\n- " . implode("\n- ", $failures) . "\n");
    exit(1);
}

echo "OK: validador de contenido y secciones en lista comprobados.\n";
