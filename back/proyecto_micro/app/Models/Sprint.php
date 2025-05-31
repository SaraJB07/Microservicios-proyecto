<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sprint extends Model
{
    protected $table = "sprints";
    protected $fillable = ['nombre', 'fecha_inicio', 'fecha_fin'];
}
