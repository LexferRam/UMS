export { default } from "next-auth/middleware"
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {

//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.getSetCookie()
//     // requestHeaders.set('x-hello-from-middleware1', 'hello');

//     const response = NextResponse.next({
//         request: {
//             // New request headers
//             headers: requestHeaders
//         },
//     });

//     // Set a new response header `x-hello-from-middleware2`
//     response.headers.set('x-hello-from-middleware2', 'hello');
//     return response;
//   }

export const config = { matcher: ["/dashboard/:path*"] }