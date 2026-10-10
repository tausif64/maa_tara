<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FacilitiesController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\TreatmentController;
use App\Http\Controllers\Admin\AdminBlogCategoryController;
use App\Http\Controllers\Admin\AdminBlogPostController;
use App\Http\Controllers\Admin\AdminGalleryController;
use App\Http\Controllers\Admin\AdminGallerySectionController;
use App\Http\Controllers\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\LeadController;
use App\Http\Controllers\Admin\PatientController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

// ── Public routes ────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::redirect('/dashboard', '/admin')->name('dashboard');
Route::redirect('/login', '/admin/auth');
Route::get('/about', [AboutController::class, 'index'])->name('about');
Route::get('/treatments', [TreatmentController::class, 'index'])->name('treatments');
Route::get('/facilities', [FacilitiesController::class, 'index'])->name('facilities');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
Route::get('/appointment', [AppointmentController::class, 'index'])->name('appointment');
Route::post('/appointment', [AppointmentController::class, 'store'])->name('appointment.store');
Route::get('/appointment/confirmation/{code}', [AppointmentController::class, 'confirmation'])
    ->name('appointment.confirmation');

// SEO: Sitemap & Robots
Route::get('/sitemap.xml', [SitemapController::class, 'sitemap'])->name('sitemap');
Route::get('/robots.txt', [SitemapController::class, 'robots'])->name('robots');

// Storage fallback route for shared hosting or environments without public/storage symlink
Route::get('/storage/{path}', function (string $path) {
    $filePath = storage_path('app/public/' . $path);
    if (!file_exists($filePath)) {
        abort(404);
    }
    return response()->file($filePath);
})->where('path', '.*')->name('storage.fallback');

// ── Admin routes ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Leads / CRM
    Route::get('/leads', [LeadController::class, 'index'])->name('leads');
    Route::match(['put', 'patch', 'post'], '/leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');

    // Appointments
    Route::get('/appointments', [AdminAppointmentController::class, 'index'])->name('appointments');
    Route::match(['put', 'patch', 'post'], '/appointments/{appointment}', [AdminAppointmentController::class, 'update'])->name('appointments.update');

    // Patients / Admissions
    Route::get('/patients', [PatientController::class, 'index'])->name('patients');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    Route::match(['put', 'patch', 'post'], '/patients/{patient}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('patients.destroy');

    // Blog Management
    Route::get('/blog', [AdminBlogPostController::class, 'index'])->name('posts.index');
    Route::get('/blog/create', [AdminBlogPostController::class, 'create'])->name('posts.create');
    Route::post('/blog', [AdminBlogPostController::class, 'store'])->name('posts.store');
    Route::get('/blog/{post}/edit', [AdminBlogPostController::class, 'edit'])->name('posts.edit');
    Route::match(['put', 'patch', 'post'], '/blog/{post}', [AdminBlogPostController::class, 'update'])->name('posts.update');
    Route::delete('/blog/{post}', [AdminBlogPostController::class, 'destroy'])->name('posts.destroy');
    Route::post('/blog/bulk-action', [AdminBlogPostController::class, 'bulkAction'])->name('posts.bulk-action');
    Route::post('/blog/upload-image', [AdminBlogPostController::class, 'uploadImage'])->name('posts.upload-image');

    // Blog Categories & Tags
    Route::get('/blog-categories', [AdminBlogCategoryController::class, 'index'])->name('blog-categories.index');
    Route::post('/blog-categories', [AdminBlogCategoryController::class, 'store'])->name('blog-categories.store');
    Route::match(['put', 'patch', 'post'], '/blog-categories/{category}', [AdminBlogCategoryController::class, 'update'])->name('blog-categories.update');
    Route::delete('/blog-categories/{category}', [AdminBlogCategoryController::class, 'destroy'])->name('blog-categories.destroy');
    Route::post('/blog-tags', [AdminBlogCategoryController::class, 'storeTag'])->name('blog-tags.store');
    Route::delete('/blog-tags/{tag}', [AdminBlogCategoryController::class, 'destroyTag'])->name('blog-tags.destroy');

    // Gallery Management
    Route::get('/gallery', [AdminGalleryController::class, 'index'])->name('gallery.index');
    Route::post('/gallery', [AdminGalleryController::class, 'store'])->name('gallery.store');
    Route::post('/gallery/batch', [AdminGalleryController::class, 'batchUpload'])->name('gallery.batch');
    Route::post('/gallery/batch-upload', [AdminGalleryController::class, 'batchUpload'])->name('gallery.batch-upload');
    Route::post('/gallery/bulk-action', [AdminGalleryController::class, 'bulkAction'])->name('gallery.bulk-action');
    Route::match(['put', 'patch', 'post'], '/gallery/{item}', [AdminGalleryController::class, 'update'])->name('gallery.update');
    Route::delete('/gallery/{item}', [AdminGalleryController::class, 'destroy'])->name('gallery.destroy');

    // Gallery Sections
    Route::get('/gallery-sections', [AdminGallerySectionController::class, 'index'])->name('gallery-sections.index');
    Route::post('/gallery-sections', [AdminGallerySectionController::class, 'store'])->name('gallery-sections.store');
    Route::match(['put', 'patch', 'post'], '/gallery-sections/{section}', [AdminGallerySectionController::class, 'update'])->name('gallery-sections.update');
    Route::delete('/gallery-sections/{section}', [AdminGallerySectionController::class, 'destroy'])->name('gallery-sections.destroy');

    // Settings & CMS — resource sub-routes MUST come before the {group} catch-all
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');

    // Hero Slides
    Route::post('/settings/hero-slides', [SettingsController::class, 'storeSlide'])->name('settings.hero-slides.store');
    Route::post('/settings/hero-slides/reorder', [SettingsController::class, 'reorderSlides'])->name('settings.hero-slides.reorder');
    Route::match(['put', 'patch', 'post'], '/settings/hero-slides/{slide}', [SettingsController::class, 'updateSlide'])->name('settings.hero-slides.update');
    Route::delete('/settings/hero-slides/{slide}', [SettingsController::class, 'destroySlide'])->name('settings.hero-slides.destroy');

    // Services
    Route::post('/settings/services', [SettingsController::class, 'storeService'])->name('settings.services.store');
    Route::match(['put', 'patch', 'post'], '/settings/services/{service}', [SettingsController::class, 'updateService'])->name('settings.services.update');
    Route::delete('/settings/services/{service}', [SettingsController::class, 'destroyService'])->name('settings.services.destroy');

    // Testimonials
    Route::post('/settings/testimonials', [SettingsController::class, 'storeTestimonial'])->name('settings.testimonials.store');
    Route::match(['put', 'patch', 'post'], '/settings/testimonials/{testimonial}', [SettingsController::class, 'updateTestimonial'])->name('settings.testimonials.update');
    Route::delete('/settings/testimonials/{testimonial}', [SettingsController::class, 'destroyTestimonial'])->name('settings.testimonials.destroy');

    // Team members
    Route::post('/settings/team', [SettingsController::class, 'storeTeamMember'])->name('settings.team.store');
    Route::match(['put', 'patch', 'post'], '/settings/team/{teamMember}', [SettingsController::class, 'updateTeamMember'])->name('settings.team.update');
    Route::delete('/settings/team/{teamMember}', [SettingsController::class, 'destroyTeamMember'])->name('settings.team.destroy');

    // FAQs
    Route::post('/settings/faqs', [SettingsController::class, 'storeFaq'])->name('settings.faqs.store');
    Route::match(['put', 'patch', 'post'], '/settings/faqs/{faq}', [SettingsController::class, 'updateFaq'])->name('settings.faqs.update');
    Route::delete('/settings/faqs/{faq}', [SettingsController::class, 'destroyFaq'])->name('settings.faqs.destroy');

    // Group batch-save — catch-all, must be LAST among /settings/* routes
    Route::post('/settings/{group}', [SettingsController::class, 'updateGroup'])->name('settings.group');
});

// ── Auth / settings (scaffolded) ─────────────────────────────────────────────
require __DIR__.'/settings.php';
// Note: auth routes are registered automatically by Fortify (FortifyServiceProvider)
