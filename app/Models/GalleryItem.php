<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    protected $fillable = [
        'section_id',
        'title',
        'caption',
        'image_path',
        'thumbnail_path',
        'year',
        'date_taken',
        'media_type',
        'video_url',
        'is_featured',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
        'year' => 'integer',
        'sort_order' => 'integer',
        'date_taken' => 'date',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(GallerySection::class, 'section_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeForSection(Builder $query, ?string $slug): Builder
    {
        if (empty($slug) || $slug === 'all') {
            return $query;
        }

        return $query->whereHas('section', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });
    }

    public function scopeForYear(Builder $query, ?int $year): Builder
    {
        if (empty($year) || $year === 0) {
            return $query;
        }

        return $query->where('year', $year);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order', 'asc')->latest('created_at');
    }
}
