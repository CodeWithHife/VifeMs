import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ message: 'Email verified successfully.', success: true });
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: 'Email verified successfully.', success: true });
  } catch (error: any) {
    console.error('Verify Email Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to verify email.' }, { status: 500 });
  }
}
