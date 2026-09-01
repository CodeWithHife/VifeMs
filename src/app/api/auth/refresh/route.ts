import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    const refreshToken = body?.refreshToken;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token is required.' }, { status: 400 });
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid or expired refresh token.' }, { status: 401 });
    }

    const user = await User.findById(payload.userId);
    if (!user || user.status !== 'active') {
      return NextResponse.json({ error: 'User no longer active.' }, { status: 401 });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId: user.businessId ? user.businessId.toString() : '',
    };

    const newAccessToken = signAccessToken(tokenPayload);
    const newRefreshToken = signRefreshToken(tokenPayload);

    return NextResponse.json({
      accessToken: newAccessToken,
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error: any) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to refresh token.' }, { status: 500 });
  }
}
