<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value', 'group'];

    /** Get a single setting value by key */
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    /** Set a setting value */
    public static function set(string $key, mixed $value, string $group = 'general'): void
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'group' => $group]
        );
    }

    /** Get all settings in a group, returned as key => value array */
    public static function group(string $group): array
    {
        return static::where('group', $group)->pluck('value', 'key')->all();
    }

    /** Get ALL settings as a flat key => value array */
    public static function all_flat(): array
    {
        return static::all()->pluck('value', 'key')->all();
    }
}
