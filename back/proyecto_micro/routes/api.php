<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Retro_itemController;
use App\Http\Controllers\SprintController;
use Illuminate\Support\Facades\Route;


Route::get('/', function () {
    echo 'hola';
});

Route::controller(Retro_itemController::class)->group(function () {
    Route::get('retro_items', 'index');
    Route::post('retro_item', 'store');
    Route::get('retro_item/{id}', 'show');
    Route::put('retro_item/{id}', 'update');
    Route::delete('retro_item/{id}', 'destroy');
});

Route::controller(SprintController::class)->group(function () {
    Route::get('sprints', 'index');
    Route::post('sprint', 'store');
    Route::get('sprint/{id}', 'show');
    Route::put('sprint/{id}', 'update');
    Route::delete('sprint/{id}', 'destroy');
});
