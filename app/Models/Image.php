<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    protected $guarded = [];

    protected $appends = ['full_url'];

    /**
     * @return \Illuminate\Contracts\Routing\UrlGenerator|string
     */
    public function getFullUrlAttribute()
    {
        return url(Storage::url($this->url));
    }
}
