<?php

declare(strict_types=1);

namespace App\Support;

final class Text
{
    public static function length(string $value): int
    {
        return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    }

    public static function slice(string $value, int $start, int $length): string
    {
        return function_exists('mb_substr')
            ? mb_substr($value, $start, $length)
            : substr($value, $start, $length);
    }
}
