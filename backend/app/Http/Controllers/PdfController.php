<?php

namespace App\Http\Controllers;

use App\Models\PdfDocument;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class PdfController extends Controller
{
    /**
     * Display a listing of the authenticated user's uploaded PDFs.
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->pdfDocuments()->latest()->get());
    }

    /**
     * Securely upload a PDF document and generate its unique slug.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:73782', // Accommodates large 72MB+ files
            'slug' => 'nullable|string|alpha_dash|max:50|unique:pdf_documents,slug',
        ]);

        $file = $request->file('file');
        $path = $file->store('private/pdfs');

        $slug = $request->slug;
        if (empty($slug)) {
            do {
                $slug = Str::random(8);
            } while (PdfDocument::where('slug', $slug)->exists());
        }

        $pdf = $request->user()->pdfDocuments()->create([
            'file_path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'slug' => $slug,
        ]);

        return response()->json($pdf, 201);
    }
    public function updateSlug(Request $request, PdfDocument $pdfDocument): JsonResponse
    {
        // Security check: Ensure the authenticated user owns this document instance
        if ($pdfDocument->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $request->validate([
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:50',
                Rule::unique('pdf_documents', 'slug')->ignore($pdfDocument->id),
            ],
        ]);

        $pdfDocument->update([
            'slug' => $request->slug,
        ]);

        return response()->json($pdfDocument);
    }
    public function destroy(Request $request, string $id): JsonResponse
{
    $pdf = $request->user()->pdfDocuments()->findOrFail($id);
    if (Storage::exists($pdf->file_path)) {
        Storage::delete($pdf->file_path);
    }
    $pdf->delete();

    return response()->json([
        'message' => 'Document permanently deleted successfully.'
    ], 200);
}

public function showBySlug(string $slug): BinaryFileResponse|JsonResponse
{
    $pdf = PdfDocument::where('slug', $slug)->first();

    if (!$pdf) {
        return response()->json(['error' => 'Document not found.'], 404);
    }
    if (!Storage::exists($pdf->file_path)) {
        return response()->json(['error' => 'The physical file could not be found on disk.'], 404);
    }
    $absolutePath = Storage::path($pdf->file_path);
    return response()->file($absolutePath, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="' . $pdf->original_name . '"'
    ]);
}    
}