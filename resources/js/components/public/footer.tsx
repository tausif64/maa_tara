import { Link, usePage } from '@inertiajs/react';
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    const { settings = {} } = usePage().props as { settings?: Record<string, string> };

    const siteName = settings['site_name'] || 'Maa Tara Freedom Trust';
    const tagline = settings['tagline'] || 'Breaking Chains, Building Lives';
    const shortAbout = settings['short_about'] || 'A government-approved de-addiction and rehabilitation centre committed to holistic recovery and lasting sobriety.';
    const phone = settings['phone_primary'] || '+91-9876543210';
    const email = settings['email'] || 'care@maataratrust.org';
    const address = `${settings['address_line1'] || 'Sahera Road, Near Ring Road'}, ${settings['city'] || 'Ranchi'}, ${settings['state'] || 'Jharkhand'} — ${settings['pincode'] || '834001'}`;

    const fb = settings['facebook_url'];
    const insta = settings['instagram_url'];
    const yt = settings['youtube_url'];
    const tw = settings['twitter_url'];
    const li = settings['linkedin_url'];

    return (
        <footer className="text-white pt-14 pb-6" style={{ backgroundColor: 'var(--theme-primary)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src="/logo.jpeg"
                                alt={siteName}
                                className="w-30 h-30 object-contain rounded-lg bg-white/10 p-0.5 shadow-xs"
                            />
                            <div>
                                <div className="font-bold text-lg leading-tight">{siteName}</div>
                                <div className="text-xs text-white/70 italic">{tagline}</div>
                            </div>
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                            {shortAbout}
                        </p>
                        <div className="flex flex-wrap gap-2.5 mt-4">
                            {fb && (
                                <a href={fb} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Facebook">
                                    <Facebook size={15} />
                                </a>
                            )}
                            {insta && (
                                <a href={insta} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Instagram">
                                    <Instagram size={15} />
                                </a>
                            )}
                            {yt && (
                                <a href={yt} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="YouTube">
                                    <Youtube size={15} />
                                </a>
                            )}
                            {tw && (
                                <a href={tw} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Twitter">
                                    <Twitter size={15} />
                                </a>
                            )}
                            {li && (
                                <a href={li} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="LinkedIn">
                                    <Linkedin size={15} />
                                </a>
                            )}
                            {!fb && !insta && !yt && (
                                <>
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Facebook size={15} /></span>
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Instagram size={15} /></span>
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Youtube size={15} /></span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-base">Quick Links</h3>
                        <ul className="space-y-2">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Treatment Programs', href: '/treatments' },
                                { label: 'Our Facilities', href: '/facilities' },
                                { label: 'Photo & Video Gallery', href: '/gallery' },
                                { label: 'Recovery Blog & Insights', href: '/blog' },
                                { label: 'Book Appointment', href: '/appointment' },
                                { label: 'Contact Us', href: '/contact' },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="text-sm text-white/75 hover:text-white transition-colors">
                                        → {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-base">Our Programs</h3>
                        <ul className="space-y-2 text-sm text-white/75">
                            <li>Inpatient Residential Care</li>
                            <li>Alcohol & Drug Detoxification</li>
                            <li>Cognitive Behavioural Therapy</li>
                            <li>12-Step Recovery Programme</li>
                            <li>Family Counseling & Therapy</li>
                            <li>Relapse Prevention & Aftercare</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-base">Contact & Location</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-white/80">
                                <MapPin size={15} className="mt-0.5 shrink-0" />
                                <span>{address}</span>
                            </li>
                            <li>
                                <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                                    <Phone size={15} /> {phone}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                                    <Mail size={15} /> {email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
                    <p>
                        © {new Date().getFullYear()} {siteName}. All rights reserved.
                    </p>
                    <p>
                        Designed & Developed by{' '}
                        <a
                            href="https://tausifansari.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/80 font-medium hover:text-white underline underline-offset-2 transition-colors"
                        >
                            Tausif Ansari
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
