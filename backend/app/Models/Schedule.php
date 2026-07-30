<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
 
    protected $fillable = [
        'content',
        'start_time',
        'end_time',
    ];
}
