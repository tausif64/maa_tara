import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Register() {
    return (
        <div className="text-center py-8">
            <Head title="Registration Closed" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Public Registration Disabled</h2>
            <p className="text-gray-600 text-sm mb-6">
                Administrative access only. Contact your system administrator for credentials.
            </p>
            <Link href="/admin/auth">
                <Button className="w-full">Go to Admin Login</Button>
            </Link>
        </div>
    );
}

Register.layout = {
    title: 'Admin Portal',
    description: 'Public registration is disabled.',
};
