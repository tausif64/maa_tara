import React from 'react';
import {
    Activity,
    AlertCircle,
    Apple,
    ArrowRight,
    Award,
    Bed,
    BookOpen,
    Brain,
    Building,
    Building2,
    Calendar,
    Check,
    CheckCircle,
    CheckCircle2,
    Clock,
    Compass,
    Cross,
    Dumbbell,
    Flame,
    Heart,
    HeartHandshake,
    HelpCircle,
    Home,
    Hospital,
    Info,
    Leaf,
    MapPin,
    MessageCircle,
    Phone,
    Pill,
    PlusCircle,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Smile,
    Sparkle,
    Sparkles,
    Star,
    Stethoscope,
    Sun,
    User,
    Users,
    type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
    hospital: Hospital,
    clinic: Building2,
    building: Building2,
    buildings: Building,
    calendar: Calendar,
    date: Calendar,
    users: Users,
    user: User,
    people: Users,
    group: Users,
    shield: Shield,
    'shield-check': ShieldCheck,
    'shield-alert': ShieldAlert,
    security: Shield,
    heart: Heart,
    love: Heart,
    care: HeartHandshake,
    handshake: HeartHandshake,
    'heart-handshake': HeartHandshake,
    activity: Activity,
    pulse: Activity,
    health: Activity,
    apple: Apple,
    nutrition: Apple,
    diet: Apple,
    food: Apple,
    dumbbell: Dumbbell,
    fitness: Dumbbell,
    gym: Dumbbell,
    workout: Dumbbell,
    clock: Clock,
    time: Clock,
    '24/7': Clock,
    star: Star,
    rating: Star,
    sparkles: Sparkles,
    sparkle: Sparkle,
    award: Award,
    badge: Award,
    trophy: Award,
    bed: Bed,
    room: Bed,
    inpatient: Hospital,
    outpatient: Calendar,
    family: Users,
    aftercare: ShieldCheck,
    phone: Phone,
    call: Phone,
    stethoscope: Stethoscope,
    doctor: Stethoscope,
    medical: Stethoscope,
    pill: Pill,
    medicine: Pill,
    medication: Pill,
    brain: Brain,
    psychiatry: Brain,
    psychology: Brain,
    therapy: Brain,
    leaf: Leaf,
    nature: Leaf,
    holistic: Leaf,
    compass: Compass,
    recovery: Compass,
    guidance: Compass,
    home: Home,
    residence: Home,
    smile: Smile,
    happy: Smile,
    sun: Sun,
    flame: Flame,
    'book-open': BookOpen,
    book: BookOpen,
    education: BookOpen,
    'map-pin': MapPin,
    location: MapPin,
    check: Check,
    'check-circle': CheckCircle,
    'check-circle2': CheckCircle2,
    alert: AlertCircle,
    'alert-circle': AlertCircle,
    message: MessageCircle,
    'message-circle': MessageCircle,
    chat: MessageCircle,
    help: HelpCircle,
    'help-circle': HelpCircle,
    info: Info,
    arrow: ArrowRight,
    'arrow-right': ArrowRight,
    cross: PlusCircle,
    plus: PlusCircle,
};

interface DynamicIconProps {
    name?: string | null;
    className?: string;
    size?: number;
    fallback?: LucideIcon;
}

// Regex to detect emoji characters
const EMOJI_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}]/u;

export default function DynamicIcon({
    name,
    className = 'w-6 h-6',
    size = 24,
    fallback: Fallback = Heart,
}: DynamicIconProps) {
    if (!name || typeof name !== 'string') {
        return <Fallback size={size} className={className} />;
    }

    const trimmed = name.trim();

    // If it's an emoji, render as text/span
    if (EMOJI_REGEX.test(trimmed)) {
        return (
            <span
                className={`inline-flex items-center justify-center leading-none select-none ${className}`}
                style={{ fontSize: `${size * 0.9}px` }}
            >
                {trimmed}
            </span>
        );
    }

    // Lookup in normalized iconMap
    const key = trimmed.toLowerCase().replace(/[\s_-]+/g, '-');
    const MatchedIcon = iconMap[key];

    if (MatchedIcon) {
        return <MatchedIcon size={size} className={className} />;
    }

    // Default fallback icon
    return <Fallback size={size} className={className} />;
}
