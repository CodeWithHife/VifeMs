import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Business from '@/models/Business';
import ActivityLog from '@/models/ActivityLog';
import { comparePassword, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const emailNormalized = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailNormalized });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    if (user.status === 'inactive') {
      return NextResponse.json(
        { error: 'Your account is deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials. Please check your email and password.' },
        { status: 401 }
      );
    }

    // Ensure business exists or link
    let businessId = user.businessId ? user.businessId.toString() : '';
    if (!businessId) {
      const ownedBusiness = await Business.findOne({ ownerId: user._id });
      if (ownedBusiness) {
        businessId = ownedBusiness._id.toString();
        user.businessId = ownedBusiness._id;
        await user.save();
      }
    }

    if (businessId) {
      await ActivityLog.create({
        businessId,
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userRole: user.role === 'owner' ? 'Owner' : user.role,
        action: 'User logged in successfully',
        recordAffected: 'Session',
        module: 'Auth',
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        timestamp: 'Just now',
      });
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId,
    };

    const token = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return NextResponse.json({
      message: 'Login successful.',
      token,
      accessToken: token,
      refreshToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        businessId,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during login.' },
      { status: 500 }
    );
  }
}
