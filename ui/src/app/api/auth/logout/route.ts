import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import {
  LEGACY_OSS_TOKEN_COOKIE,
  LEGACY_OSS_USER_COOKIE,
  OSS_TOKEN_COOKIE,
  OSS_USER_COOKIE,
  sessionCookieOptions,
} from '@/lib/auth/cookies';

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const options = sessionCookieOptions(request, 0);

  for (const name of [
    OSS_TOKEN_COOKIE,
    OSS_USER_COOKIE,
    LEGACY_OSS_TOKEN_COOKIE,
    LEGACY_OSS_USER_COOKIE,
  ]) {
    cookieStore.set(name, '', options);
  }

  return NextResponse.json({ success: true });
}
