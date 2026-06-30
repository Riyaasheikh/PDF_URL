<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PdfController;

// Public Endpoints
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/v/{slug}', [PdfController::class, 'showBySlug'])->name('public.pdf.show');

// Protected Authenticated System Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Core PDF Workflow Endpoints
    Route::get('/pdfs', [PdfController::class, 'index']);
    Route::post('/pdfs', [PdfController::class, 'upload']);
    Route::patch('/pdfs/{pdfDocument}/slug', [PdfController::class, 'updateSlug']);
    Route::delete('/pdfs/{id}', [PdfController::class, 'destroy']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});