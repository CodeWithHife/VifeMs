import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (user) {
      user.resetPasswordToken = Math.random().toString(36).substring(2, 15);
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
    }

    return NextResponse.json({
      message: 'If an account with this email exists, a password reset link has been dispatched.',
      success: true,
    });
  } catch (error: any) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process request.' }, { status: 500 });
  }
}
