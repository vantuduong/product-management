<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany(Image::class);
    }

    /**
     * @param Builder $builder
     * @param string|null $name
     */
    public function scopeSearchByName(Builder $builder, ?string $name)
    {
        if (!empty($name)) {
            $builder->where('name', 'like', "%$name%");
        }
    }
}
