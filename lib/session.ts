import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SESSION_COOKIE_NAME = 'admin-session';
const SESSION_SECRET = process.env.AUTH_SECRET || 'fallback-secret';

export async function createSession(email: string) {
    const cookieStore = await cookies();
    // Simple session: just store email (in production, use JWT)
    cookieStore.set(SESSION_COOKIE_NAME, email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return session ? { user: { email: session.value } } : null;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
