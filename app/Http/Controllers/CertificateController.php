<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\CertificateDesign;
use App\Models\CertificateParticipant;
use App\Models\CertificateSign;
use App\Models\Course;
use App\Models\Invoice;
use App\Models\Webinar;
use App\Services\CertificatePdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use ZipArchive;

class CertificateController extends Controller
{
    protected $pdfService;

    public function __construct(CertificatePdfService $pdfService)
    {
        $this->pdfService = $pdfService;
    }

    public function index()
    {
        $certificates = Certificate::with(['design', 'sign', 'course', 'webinar'])->latest()->get();

        return Inertia::render('admin/certificates/index', [
            'certificates' => $certificates
        ]);
    }

    public function show(Certificate $certificate)
    {
        $this->syncParticipants($certificate);

        $certificate->load([
            'design',
            'sign',
            'course',
            'webinar',
            'participants.user'
        ]);

        return Inertia::render('admin/certificates/show', [
            'certificate' => $certificate
        ]);
    }

    public function create(Request $request)
    {
        $designs = CertificateDesign::all();
        $signs = CertificateSign::all();

        $courses = Course::whereDoesntHave('certificate')
            ->select(['id', 'title'])
            ->get();

        $webinars = Webinar::whereDoesntHave('certificate')
            ->select(['id', 'title'])
            ->get();

        $prefilledData = [];

        if ($request->has('program_type')) {
            $prefilledData['program_type'] = $request->get('program_type');
        }

        if ($request->has('course_id')) {
            $courseId = $request->get('course_id');
            $course = Course::find($courseId);

            if ($course) {
                $prefilledData['program_type'] = 'course';
                $prefilledData['course_id'] = $courseId;
                $prefilledData['title'] = "Sertifikat {$course->title}";
                $prefilledData['description'] = "Sebagai Peserta yang Mengikuti {$course->title} yang Diselenggarakan Oleh Lulustarget.Idn";

                if (!$courses->contains('id', $courseId)) {
                    $courses->push((object)[
                        'id' => $course->id,
                        'title' => $course->title
                    ]);
                }
            }
        }

        if ($request->has('webinar_id')) {
            $webinarId = $request->get('webinar_id');
            $webinar = Webinar::find($webinarId);

            if ($webinar) {
                $prefilledData['program_type'] = 'webinar';
                $prefilledData['webinar_id'] = $webinarId;
                $prefilledData['title'] = "Sertifikat {$webinar->title}";
                $prefilledData['description'] = "Sebagai Peserta yang Mengikuti {$webinar->title} yang Diselenggarakan Oleh Lulustarget.Idn";

                if (!$webinars->contains('id', $webinarId)) {
                    $webinars->push((object)[
                        'id' => $webinar->id,
                        'title' => $webinar->title
                    ]);
                }
            }
        }

        return Inertia::render('admin/certificates/create', [
            'designs' => $designs,
            'signs' => $signs,
            'courses' => $courses,
            'webinars' => $webinars,
            'prefilledData' => $prefilledData
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'design_id' => 'required|exists:certificate_designs,id',
            'sign_id' => 'required|exists:certificate_signs,id',
            'certificate_number' => 'required|string|unique:certificates',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'header_top' => 'nullable|string',
            'header_bottom' => 'nullable|string',
            'issued_date' => 'nullable|date',
            'period' => 'nullable|string',
            'program_type' => 'required|in:course,webinar',
            'course_id' => 'required_if:program_type,course|nullable|exists:courses,id',
            'webinar_id' => 'required_if:program_type,webinar|nullable|exists:webinars,id',
        ]);

        $data = $request->all();
        if ($request->program_type !== 'course') {
            $data['course_id'] = null;
        }
        if ($request->program_type !== 'webinar') {
            $data['webinar_id'] = null;
        }

        $certificate = Certificate::create($data);
        $this->syncParticipants($certificate);

        return redirect()->route('certificates.index')
            ->with('success', 'Sertifikat berhasil ditambahkan');
    }

    public function edit(Certificate $certificate)
    {
        $designs = CertificateDesign::all();
        $signs = CertificateSign::all();

        $courses = Course::where(function ($query) use ($certificate) {
            $query->whereDoesntHave('certificate')
                ->orWhere('id', $certificate->course_id);
        })->select(['id', 'title'])->get();

        $webinars = Webinar::where(function ($query) use ($certificate) {
            $query->whereDoesntHave('certificate')
                ->orWhere('id', $certificate->webinar_id);
        })->select(['id', 'title'])->get();

        $programType = '';
        if ($certificate->course_id) {
            $programType = 'course';
        } elseif ($certificate->webinar_id) {
            $programType = 'webinar';
        }

        return Inertia::render('admin/certificates/edit', [
            'certificate' => array_merge($certificate->toArray(), ['program_type' => $programType]),
            'designs' => $designs,
            'signs' => $signs,
            'courses' => $courses,
            'webinars' => $webinars
        ]);
    }

    public function update(Request $request, Certificate $certificate)
    {
        $request->validate([
            'design_id' => 'required|exists:certificate_designs,id',
            'sign_id' => 'required|exists:certificate_signs,id',
            'certificate_number' => 'required|string|unique:certificates,certificate_number,' . $certificate->id,
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'header_top' => 'nullable|string',
            'header_bottom' => 'nullable|string',
            'issued_date' => 'nullable|date',
            'period' => 'nullable|string',
            'program_type' => 'required|in:course,webinar',
            'course_id' => 'required_if:program_type,course|nullable|exists:courses,id',
            'webinar_id' => 'required_if:program_type,webinar|nullable|exists:webinars,id',
        ]);

        $data = $request->all();
        if ($request->program_type !== 'course') {
            $data['course_id'] = null;
        }
        if ($request->program_type !== 'webinar') {
            $data['webinar_id'] = null;
        }

        $certificate->update($data);
        $this->syncParticipants($certificate);

        return redirect()->route('certificates.show', $certificate->id)
            ->with('success', 'Sertifikat berhasil diperbarui');
    }

    public function destroy(Certificate $certificate)
    {
        $certificate->delete();

        return redirect()->route('certificates.index')
            ->with('success', 'Sertifikat berhasil dihapus');
    }

    /**
     * Preview sertifikat dalam bentuk PDF
     */
    public function preview(Certificate $certificate)
    {
        try {
            $certificate->load(['design', 'sign', 'course', 'webinar']);

            $pdf = $this->pdfService->generatePreview($certificate);

            return response($pdf)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'inline; filename="preview-' . $certificate->certificate_number . '.pdf"');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat preview sertifikat: ' . $e->getMessage());
        }
    }

    /**
     * Download sertifikat participant
     */
    public function downloadParticipant(CertificateParticipant $participant)
    {
        try {
            $pdf = $this->pdfService->generateParticipantCertificate($participant);

            $filename = 'sertifikat-' . $participant->certificate_code . '.pdf';

            return response($pdf)
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengunduh sertifikat: ' . $e->getMessage());
        }
    }

    /**
     * Download semua sertifikat dalam ZIP (mendukung batching offset & limit)
     */
    public function downloadAll(Request $request, Certificate $certificate)
    {
        @ini_set('memory_limit', '1024M');
        @set_time_limit(600);

        try {
            $this->syncParticipants($certificate);

            $query = CertificateParticipant::where('certificate_id', $certificate->id)->with('user');
            $totalParticipants = $query->count();

            if ($totalParticipants === 0) {
                return back()->with('error', 'Tidak ada peserta untuk sertifikat ini.');
            }

            if ($request->has('offset') && $request->has('limit')) {
                $offset = max(0, (int) $request->get('offset'));
                $limit = max(1, (int) $request->get('limit'));
                $participants = $query->skip($offset)->take($limit)->get();
                $startNum = $offset + 1;
                $endNum = $offset + $participants->count();
                $batchSuffix = "-batch-{$startNum}-{$endNum}";
            } else {
                $participants = $query->get();
                $batchSuffix = '';
            }

            if ($participants->isEmpty()) {
                return back()->with('error', 'Tidak ada peserta pada batch ini.');
            }

            if (!class_exists('ZipArchive')) {
                return back()->with('error', 'Ekstensi ZipArchive tidak tersedia di server.');
            }

            $zip = new ZipArchive();
            $zipFileName = 'sertifikat-' . Str::slug($certificate->title) . $batchSuffix . '-' . time() . '.zip';
            $tempDirPath = storage_path('app/temp');

            if (!file_exists($tempDirPath)) {
                mkdir($tempDirPath, 0755, true);
            }

            $zipFilePath = $tempDirPath . '/' . $zipFileName;

            if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
                return back()->with('error', 'Gagal membuat file ZIP sertifikat.');
            }

            $counter = 0;
            foreach ($participants as $participant) {
                if (!$participant->user) {
                    continue;
                }

                $pdfData = $this->pdfService->generateParticipantCertificate($participant);
                $userName = Str::slug($participant->user->name);
                $pdfFileName = "sertifikat-{$participant->certificate_code}-{$userName}.pdf";

                $zip->addFromString($pdfFileName, $pdfData);

                $counter++;
                if ($counter % 10 === 0) {
                    gc_collect_cycles();
                }
            }

            $zip->close();

            return response()->download($zipFilePath, $zipFileName)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            Log::error('Error downloading all certificates: ' . $e->getMessage());
            return back()->with('error', 'Gagal memproses download: ' . $e->getMessage());
        }
    }

    /**
     * Sync peserta yang sudah membayar tetapi belum terdaftar sebagai participant sertifikat
     */
    private function syncParticipants(Certificate $certificate)
    {
        $userIds = collect();

        if ($certificate->course_id) {
            $userIds = Invoice::where('status', 'paid')
                ->whereHas('courseItems', function ($query) use ($certificate) {
                    $query->where('course_id', $certificate->course_id);
                })
                ->pluck('user_id')
                ->unique();
        } elseif ($certificate->webinar_id) {
            $userIds = Invoice::where('status', 'paid')
                ->whereHas('webinarItems', function ($query) use ($certificate) {
                    $query->where('webinar_id', $certificate->webinar_id);
                })
                ->pluck('user_id')
                ->unique();
        }

        foreach ($userIds as $userId) {
            CertificateParticipant::firstOrCreate([
                'certificate_id' => $certificate->id,
                'user_id' => $userId,
            ]);
        }
    }
}
