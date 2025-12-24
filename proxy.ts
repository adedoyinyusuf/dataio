import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Pass pathname to layout for active state detection
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', request.nextUrl.pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: '/admin/:path*',
};
