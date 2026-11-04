<?php

declare(strict_types=1);

namespace App\Validation;

use App\Content\DefaultContent;
use App\Http\ValidationException;
use App\Support\Text;

final class ContentValidator
{
    private const LEVELS = ['Básico', 'Intermedio', 'Avanzado'];
    private const GRADIENTS = ['blue-cyan', 'yellow-magenta', 'cyan-blue', 'magenta-yellow', 'blue-magenta', 'yellow-cyan'];
    private const LIST_SECTIONS = ['journey', 'learningCards', 'gallery', 'projects', 'kidsRobots', 'faqs', 'announcements'];

    /** @var array<string, string> */
    private array $errors = [];

    /** @return array<string, mixed> */
    public function validate(string $section, mixed $content): array
    {
        $isList = in_array($section, self::LIST_SECTIONS, true);

        if (!is_array($content) || array_is_list($content) !== $isList) {
            throw new ValidationException([
                'content' => $isList ? 'El contenido debe ser una lista.' : 'El contenido debe ser un objeto.',
            ]);
        }

        $this->errors = [];
        $method = 'validate' . ucfirst($section);
        if (!method_exists($this, $method)) {
            throw new ValidationException(['section' => 'Sección desconocida.']);
        }

        $result = $this->{$method}($content);

        if ($this->errors !== []) {
            throw new ValidationException($this->errors);
        }

        return $result;
    }

    /** @param array<string, mixed> $c */
    private function validateSettings(array $c): array
    {
        return [
            'programName' => $this->text($c, 'settings.programName', 'programName', 120),
            'municipality' => $this->text($c, 'settings.municipality', 'municipality', 120),
            'tagline' => $this->text($c, 'settings.tagline', 'tagline', 160),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateHero(array $c): array
    {
        return [
            'eyebrow' => $this->text($c, 'hero.eyebrow', 'eyebrow', 120, false),
            'title' => $this->text($c, 'hero.title', 'title', 160),
            'highlight' => $this->text($c, 'hero.highlight', 'highlight', 80, false),
            'accent' => $this->text($c, 'hero.accent', 'accent', 80, false),
            'subtitle' => $this->text($c, 'hero.subtitle', 'subtitle', 600),
            'badge' => $this->text($c, 'hero.badge', 'badge', 120, false),
            'ctaPrimary' => $this->text($c, 'hero.ctaPrimary', 'ctaPrimary', 60),
            'ctaSecondary' => $this->text($c, 'hero.ctaSecondary', 'ctaSecondary', 60, false),
            'image' => $this->image($c, 'hero.image', 'image'),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateIntro(array $c): array
    {
        return [
            'title' => $this->text($c, 'intro.title', 'title', 160),
            'text' => $this->text($c, 'intro.text', 'text', 1200),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateJourney(array $c): array
    {
        return $this->items($c, 'journey', 12, fn (array $item, int $i): array => [
            'step' => $this->text($item, "journey.{$i}.step", 'step', 8),
            'title' => $this->text($item, "journey.{$i}.title", 'title', 80),
            'text' => $this->text($item, "journey.{$i}.text", 'text', 400),
        ]);
    }

    /** @param array<string, mixed> $c */
    private function validateLearningCards(array $c): array
    {
        return $this->items($c, 'learningCards', 12, fn (array $item, int $i): array => [
            'title' => $this->text($item, "learningCards.{$i}.title", 'title', 120),
            'text' => $this->text($item, "learningCards.{$i}.text", 'text', 600),
        ]);
    }

    /** @param array<string, mixed> $c */
    private function validateGallery(array $c): array
    {
        return $this->items($c, 'gallery', 30, fn (array $item, int $i): array => [
            'label' => $this->text($item, "gallery.{$i}.label", 'label', 160),
            'gradient' => $this->enum($item, "gallery.{$i}.gradient", 'gradient', self::GRADIENTS),
            'image' => $this->image($item, "gallery.{$i}.image", 'image'),
        ]);
    }

    /** @param array<string, mixed> $c */
    private function validateMoments(array $c): array
    {
        return [
            'eyebrow' => $this->text($c, 'moments.eyebrow', 'eyebrow', 120),
            'title' => $this->text($c, 'moments.title', 'title', 160),
            'text' => $this->text($c, 'moments.text', 'text', 1200),
            'slides' => $this->list($c, 'moments.slides', 'slides', 30, fn (array $item, int $i): array => [
                'tag' => $this->text($item, "moments.slides.{$i}.tag", 'tag', 80),
                'label' => $this->text($item, "moments.slides.{$i}.label", 'label', 160),
                'gradient' => $this->enum($item, "moments.slides.{$i}.gradient", 'gradient', self::GRADIENTS),
                'image' => $this->image($item, "moments.slides.{$i}.image", 'image'),
            ]),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateProjects(array $c): array
    {
        return $this->items($c, 'projects', 30, function (array $item, int $i): array {
            $techs = $item['techs'] ?? [];
            $cleanTechs = [];
            if (!is_array($techs) || !array_is_list($techs) || count($techs) > 10) {
                $this->errors["projects.{$i}.techs"] = 'Máximo 10 tecnologías.';
            } else {
                foreach ($techs as $tech) {
                    if (!is_string($tech) || Text::length(trim($tech)) > 40) {
                        $this->errors["projects.{$i}.techs"] = 'Tecnología no válida.';
                        continue;
                    }
                    if (trim($tech) !== '') {
                        $cleanTechs[] = trim($tech);
                    }
                }
            }

            return [
                'title' => $this->text($item, "projects.{$i}.title", 'title', 160),
                'level' => $this->enum($item, "projects.{$i}.level", 'level', self::LEVELS),
                'desc' => $this->text($item, "projects.{$i}.desc", 'desc', 600, false),
                'techs' => $cleanTechs,
                'image' => $this->image($item, "projects.{$i}.image", 'image'),
            ];
        });
    }

    /** @param array<string, mixed> $c */
    private function validateKidsRobots(array $c): array
    {
        return $this->items($c, 'kidsRobots', 30, fn (array $item, int $i): array => [
            'name' => $this->text($item, "kidsRobots.{$i}.name", 'name', 120),
            'desc' => $this->text($item, "kidsRobots.{$i}.desc", 'desc', 600, false),
            'level' => $this->enum($item, "kidsRobots.{$i}.level", 'level', self::LEVELS),
            'image' => $this->image($item, "kidsRobots.{$i}.image", 'image'),
        ]);
    }

    /** @param array<string, mixed> $c */
    private function validateInstitutional(array $c): array
    {
        return [
            'heading' => $this->text($c, 'institutional.heading', 'heading', 160),
            'text' => $this->text($c, 'institutional.text', 'text', 1200),
            'image' => $this->image($c, 'institutional.image', 'image'),
            'partners' => $this->list($c, 'institutional.partners', 'partners', 8, fn (array $item, int $i): array => [
                'name' => $this->text($item, "institutional.partners.{$i}.name", 'name', 120),
                'logo' => $this->image($item, "institutional.partners.{$i}.logo", 'logo'),
            ]),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateFaqs(array $c): array
    {
        return $this->items($c, 'faqs', 50, fn (array $item, int $i): array => [
            'q' => $this->text($item, "faqs.{$i}.q", 'q', 300),
            'a' => $this->text($item, "faqs.{$i}.a", 'a', 2000),
        ]);
    }

    /** @param array<string, mixed> $c */
    private function validateContact(array $c): array
    {
        return [
            'email' => $this->nullable($c, 'contact.email', 'email', 160, static fn (string $v): bool => filter_var($v, FILTER_VALIDATE_EMAIL) !== false),
            'phone' => $this->nullable($c, 'contact.phone', 'phone', 40),
            'whatsapp' => $this->nullable($c, 'contact.whatsapp', 'whatsapp', 20, static fn (string $v): bool => preg_match('/^[0-9]{8,15}$/', $v) === 1),
            'address' => $this->nullable($c, 'contact.address', 'address', 300),
        ];
    }

    /** @param array<string, mixed> $c */
    private function validateAnnouncements(array $c): array
    {
        return $this->items($c, 'announcements', 10, fn (array $item, int $i): array => [
            'enabled' => $this->bool($item, "announcements.{$i}.enabled", 'enabled'),
            'title' => $this->text($item, "announcements.{$i}.title", 'title', 160),
            'text' => $this->text($item, "announcements.{$i}.text", 'text', 600),
            'image' => $this->image($item, "announcements.{$i}.image", 'image'),
            'cta' => $this->text($item, "announcements.{$i}.cta", 'cta', 60, false),
            'link' => $this->link($item, "announcements.{$i}.link", 'link'),
        ]);
    }

    /** @param array<string, mixed> $source */
    private function text(array $source, string $path, string $key, int $max, bool $required = true): string
    {
        $value = $source[$key] ?? null;
        if (!is_string($value)) {
            $this->errors[$path] = 'Debe ser texto.';

            return '';
        }

        $value = trim($value);
        if ($required && $value === '') {
            $this->errors[$path] = 'Este campo es obligatorio.';
        }
        if (Text::length($value) > $max) {
            $this->errors[$path] = "Máximo {$max} caracteres.";
        }

        return $value;
    }

    /** @param array<string, mixed> $source */
    private function nullable(array $source, string $path, string $key, int $max, ?callable $check = null): ?string
    {
        $value = $source[$key] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        if (!is_string($value)) {
            $this->errors[$path] = 'Valor no válido.';

            return null;
        }

        $value = trim($value);
        if (Text::length($value) > $max) {
            $this->errors[$path] = "Máximo {$max} caracteres.";
        }
        if ($check !== null && !$check($value)) {
            $this->errors[$path] = 'Formato no válido.';
        }

        return $value;
    }

    /** @param array<string, mixed> $source */
    private function bool(array $source, string $path, string $key): bool
    {
        $value = $source[$key] ?? false;
        if (!is_bool($value)) {
            $this->errors[$path] = 'Debe ser verdadero o falso.';

            return false;
        }

        return $value;
    }

    /** @param array<string, mixed> $source */
    private function image(array $source, string $path, string $key): ?string
    {
        $value = $source[$key] ?? null;
        if ($value === null || $value === '') {
            return null;
        }
        if (!is_string($value) || Text::length($value) > 500) {
            $this->errors[$path] = 'Imagen no válida.';

            return null;
        }

        $value = trim($value);
        if (!preg_match('#^/(?!/)#', $value) && !preg_match('#^https?://#i', $value)) {
            $this->errors[$path] = 'La imagen debe ser una ruta local o una URL http(s).';

            return null;
        }

        return $value;
    }

    /** @param array<string, mixed> $source */
    private function link(array $source, string $path, string $key): string
    {
        $value = $this->text($source, $path, $key, 500, false);
        if ($value !== '' && !str_starts_with($value, '#') && !preg_match('#^https?://#i', $value)) {
            $this->errors[$path] = 'El enlace debe empezar por # o por http(s)://.';
        }

        return $value;
    }

    /** @param array<string, mixed> $source */
    private function enum(array $source, string $path, string $key, array $allowed): string
    {
        $value = $source[$key] ?? null;
        if (!is_string($value) || !in_array($value, $allowed, true)) {
            $this->errors[$path] = 'Valor no permitido.';

            return (string) ($allowed[0] ?? '');
        }

        return $value;
    }

    /**
     * @param array<string, mixed> $source
     * @param callable(array<string, mixed>, int): array<string, mixed> $mapper
     * @return list<array<string, mixed>>
     */
    private function list(array $source, string $path, string $key, int $max, callable $mapper): array
    {
        $items = $source[$key] ?? null;
        if (!is_array($items) || !array_is_list($items)) {
            $this->errors[$path] = 'Debe ser una lista.';

            return [];
        }

        return $this->items($items, $path, $max, $mapper);
    }

    /**
     * @param list<mixed> $items
     * @param callable(array<string, mixed>, int): array<string, mixed> $mapper
     * @return list<array<string, mixed>>
     */
    private function items(array $items, string $path, int $max, callable $mapper): array
    {
        if (count($items) > $max) {
            $this->errors[$path] = "Máximo {$max} elementos.";

            return [];
        }

        $result = [];
        foreach ($items as $index => $item) {
            if (!is_array($item) || array_is_list($item)) {
                $this->errors["{$path}.{$index}"] = 'Elemento no válido.';
                continue;
            }
            $result[] = $mapper($item, $index);
        }

        return $result;
    }

    /** @return list<string> */
    public static function sectionKeys(): array
    {
        return DefaultContent::keys();
    }
}
