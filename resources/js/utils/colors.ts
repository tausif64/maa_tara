export const tailwindColorToHex: Record<string, string> = {
    // Red
    'red': '#ef4444',
    'rose': '#f43f5e',
    'pink': '#ec4899',
    'fuchsia': '#d946ef',
    'purple': '#a855f7',
    'violet': '#8b5cf6',
    'indigo': '#6366f1',
    'blue': '#3b82f6',
    'sky': '#0ea5e9',
    'cyan': '#06b6d4',
    'teal': '#14b8a6',
    'emerald': '#10b981',
    'green': '#22c55e',
    'lime': '#84cc16',
    'yellow': '#eab308',
    'amber': '#f59e0b',
    'orange': '#f97316',
    'stone': '#78716c',
    'neutral': '#737373',
    'gray': '#6b7280',
    'slate': '#64748b',
    'zinc': '#71717a',
    // Shades
    'red-500': '#ef4444',
    'rose-500': '#f43f5e',
    'pink-500': '#ec4899',
    'fuchsia-500': '#d946ef',
    'purple-500': '#a855f7',
    'violet-500': '#8b5cf6',
    'indigo-500': '#6366f1',
    'blue-500': '#3b82f6',
    'sky-500': '#0ea5e9',
    'cyan-500': '#06b6d4',
    'teal-500': '#14b8a6',
    'emerald-500': '#10b981',
    'green-500': '#22c55e',
    'lime-500': '#84cc16',
    'yellow-500': '#eab308',
    'amber-500': '#f59e0b',
    'orange-500': '#f97316',
    'stone-500': '#78716c',
    'neutral-500': '#737373',
    'gray-500': '#6b7280',
    'slate-500': '#64748b',
    'zinc-500': '#71717a',
};

export function getColorHex(colorName?: string | null, fallback = '#10b981'): string {
    if (!colorName) return fallback;
    const normalized = colorName.toLowerCase().trim();
    return tailwindColorToHex[normalized] || (normalized.startsWith('#') ? normalized : fallback);
}