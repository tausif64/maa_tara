<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\BlogPost;
use App\Models\GalleryItem;
use App\Models\Lead;
use App\Models\Patient;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_leads'          => Lead::count(),
            'new_leads'            => Lead::where('status', 'new')->count(),
            'total_appointments'   => Appointment::count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'total_patients'       => Patient::count(),
            'active_patients'      => Patient::whereIn('status', ['admitted', 'under_treatment'])->count(),
            'total_posts'          => BlogPost::count(),
            'total_gallery_items'  => GalleryItem::count(),
        ];

        $recent_leads = Lead::latest()->take(6)->get([
            'id', 'name', 'phone', 'email', 'addiction_type', 'status', 'created_at',
        ]);

        $upcoming_appointments = Appointment::where('appointment_date', '>=', today())
            ->where('status', '!=', 'cancelled')
            ->orderBy('appointment_date')
            ->orderBy('time_slot')
            ->take(8)
            ->get([
                'id', 'reference_code', 'patient_name', 'service_type',
                'appointment_date', 'time_slot', 'status',
            ]);

        $recent_patients = Patient::latest()->take(6)->get();

        return Inertia::render('admin/dashboard', compact(
            'stats', 'recent_leads', 'upcoming_appointments', 'recent_patients'
        ));
    }
}
