<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\Service;
use App\Models\Testimonial;
use App\Models\TeamMember;
use App\Models\Faq;
use App\Models\HeroSlide;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings', [
            'settings'     => SiteSetting::all_flat(),
            'hero_slides'  => HeroSlide::ordered()->get(),
            'services'     => Service::orderBy('sort_order')->get(),
            'testimonials' => Testimonial::orderBy('id', 'desc')->get(),
            'team_members' => TeamMember::orderBy('sort_order')->get(),
            'faqs'         => Faq::orderBy('sort_order')->get(),
        ]);
    }

    /** Save a whole group of key-value settings at once (General / Contact / Social / Hero / SEO). */
    public function updateGroup(Request $request, string $group): RedirectResponse
    {
        $allowed = ['general', 'contact', 'social', 'hero', 'seo'];
        abort_unless(in_array($group, $allowed), 422);

        foreach ($request->except('_token', '_method') as $key => $value) {
            SiteSetting::set($key, $value, $group);
        }

        return back()->with('success', ucfirst($group) . ' settings saved.');
    }

    // ── Hero Slides ───────────────────────────────────────────────────────────────

    public function storeSlide(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'image'      => 'required|image|max:4096',
            'is_active'  => 'nullable|boolean',
        ]);

        $path = $request->file('image')->store('hero-slides', 'public');

        $maxOrder = HeroSlide::max('sort_order') ?? 0;
        HeroSlide::create([
            'image_path' => '/storage/' . $path,
            'sort_order' => $maxOrder + 1,
            'is_active'  => $data['is_active'] ?? true,
        ]);

        return back()->with('success', 'Hero slide added.');
    }

    public function updateSlide(Request $request, HeroSlide $slide): RedirectResponse
    {
        $data = $request->validate([
            'image'      => 'nullable|image|max:4096',
            'is_active'  => 'nullable|boolean',
        ]);

        $update = [
            'is_active'  => $data['is_active'] ?? $slide->is_active,
        ];

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('hero-slides', 'public');
            $update['image_path'] = '/storage/' . $path;
        }

        $slide->update($update);

        return back()->with('success', 'Hero slide updated.');
    }

    public function destroySlide(HeroSlide $slide): RedirectResponse
    {
        $slide->delete();

        return back()->with('success', 'Hero slide deleted.');
    }

    public function reorderSlides(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);

        foreach ($request->ids as $order => $id) {
            HeroSlide::where('id', $id)->update(['sort_order' => $order + 1]);
        }

        return response()->json(['ok' => true]);
    }

    // ── Services ────────────────────────────────────────────────────────────

    public function storeService(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title'             => 'required|string|max:255',
            'short_description' => 'required|string',
            'full_description'  => 'nullable|string',
            'icon'              => 'nullable|string|max:10',
            'category'          => 'nullable|string|max:50',
            'sort_order'        => 'nullable|integer',
            'is_active'         => 'nullable|boolean',
        ]);
        $data['slug']      = Str::slug($data['title']) . '-' . Str::random(4);
        $data['is_active'] = $data['is_active'] ?? true;
        Service::create($data);

        return back()->with('success', 'Service created.');
    }

    public function updateService(Request $request, Service $service): RedirectResponse
    {
        $service->update($request->validate([
            'title'             => 'required|string|max:255',
            'short_description' => 'required|string',
            'full_description'  => 'nullable|string',
            'icon'              => 'nullable|string|max:10',
            'category'          => 'nullable|string|max:50',
            'sort_order'        => 'nullable|integer',
            'is_active'         => 'nullable|boolean',
        ]));

        return back()->with('success', 'Service updated.');
    }

    public function destroyService(Service $service): RedirectResponse
    {
        $service->delete();

        return back()->with('success', 'Service deleted.');
    }

    // ── Testimonials ─────────────────────────────────────────────────────────

    public function storeTestimonial(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'patient_name'     => 'required|string|max:255',
            'patient_initials' => 'nullable|string|max:5',
            'story'            => 'required|string',
            'rating'           => 'nullable|integer|min:1|max:5',
            'addiction_type'   => 'nullable|string|max:100',
            'recovery_months'  => 'nullable|integer|min:0',
            'is_active'        => 'nullable|boolean',
        ]);
        $data['patient_initials'] = $data['patient_initials']
            ?? collect(explode(' ', $data['patient_name']))->map(fn($w) => strtoupper($w[0]))->implode('');
        $data['is_active'] = $data['is_active'] ?? true;
        Testimonial::create($data);

        return back()->with('success', 'Testimonial added.');
    }

    public function updateTestimonial(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update($request->validate([
            'patient_name'     => 'required|string|max:255',
            'patient_initials' => 'nullable|string|max:5',
            'story'            => 'required|string',
            'rating'           => 'nullable|integer|min:1|max:5',
            'addiction_type'   => 'nullable|string|max:100',
            'recovery_months'  => 'nullable|integer|min:0',
            'is_active'        => 'nullable|boolean',
        ]));

        return back()->with('success', 'Testimonial updated.');
    }

    public function destroyTestimonial(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimonial deleted.');
    }

    // ── Team Members ─────────────────────────────────────────────────────────

    public function storeTeamMember(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'designation'      => 'required|string|max:255',
            'qualification'    => 'nullable|string|max:255',
            'bio'              => 'nullable|string',
            'photo'            => 'nullable|string|max:500',
            'specialization'   => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'sort_order'       => 'nullable|integer',
            'is_active'        => 'nullable|boolean',
        ]);
        $data['is_active'] = $data['is_active'] ?? true;
        TeamMember::create($data);

        return back()->with('success', 'Team member added.');
    }

    public function updateTeamMember(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $teamMember->update($request->validate([
            'name'             => 'required|string|max:255',
            'designation'      => 'required|string|max:255',
            'qualification'    => 'nullable|string|max:255',
            'bio'              => 'nullable|string',
            'photo'            => 'nullable|string|max:500',
            'specialization'   => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'sort_order'       => 'nullable|integer',
            'is_active'        => 'nullable|boolean',
        ]));

        return back()->with('success', 'Team member updated.');
    }

    public function destroyTeamMember(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        return back()->with('success', 'Team member deleted.');
    }

    // ── FAQs ─────────────────────────────────────────────────────────────────

    public function storeFaq(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'question'   => 'required|string',
            'answer'     => 'required|string',
            'category'   => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'nullable|boolean',
        ]);
        $data['is_active'] = $data['is_active'] ?? true;
        Faq::create($data);

        return back()->with('success', 'FAQ added.');
    }

    public function updateFaq(Request $request, Faq $faq): RedirectResponse
    {
        $faq->update($request->validate([
            'question'   => 'required|string',
            'answer'     => 'required|string',
            'category'   => 'nullable|string|max:50',
            'sort_order' => 'nullable|integer',
            'is_active'  => 'nullable|boolean',
        ]));

        return back()->with('success', 'FAQ updated.');
    }

    public function destroyFaq(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ deleted.');
    }
}
