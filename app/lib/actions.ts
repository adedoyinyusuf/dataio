'use server';

import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const parsed = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse({
            email: formData.get('email'),
            password: formData.get('password'),
        });

    if (!parsed.success) {
        return 'Invalid input.';
    }

    const { email, password } = parsed.data;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log('Login attempt:', { email, match: email === adminEmail && password === adminPassword });

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
        await createSession(email);
        redirect('/admin');
    }

    return 'Invalid credentials.';
}
