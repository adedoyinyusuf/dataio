'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { authenticate } from '@/app/lib/actions';

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button
            aria-disabled={pending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
            {pending ? 'Logging in...' : 'Log in'}
        </button>
    );
}

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form action={dispatch} className="p-8 bg-white rounded shadow-md w-96 space-y-4">
                <h1 className="text-2xl font-bold mb-4">Admin Login</h1>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                        placeholder="admin@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        required
                        minLength={6}
                        className="mt-1 block w-full border border-gray-300 rounded p-2"
                    />
                </div>

                <div className="h-4">
                    {errorMessage && (
                        <p className="text-red-500 text-sm">{errorMessage}</p>
                    )}
                </div>

                <LoginButton />
            </form>
        </div>
    );
}
