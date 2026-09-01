import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json().catch(() => ({}));
    const { token, newPassword, confirmPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match.' }, { status: 400 });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: 'Password reset link is invalid or has expired.' }, { status: 400 });
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully. Please log in.', success: true });
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to reset password.' }, { status: 500 });
  }
}
