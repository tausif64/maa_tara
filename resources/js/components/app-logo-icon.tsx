import type { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/logo.jpeg"
            alt="Maa Tara Freedom Trust Logo"
            className={`object-contain rounded-md ${className || 'size-9'}`}
            {...props}
        />
    );
}
