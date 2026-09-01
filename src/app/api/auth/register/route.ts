import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Business from '@/models/Business';
import ActivityLog from '@/models/ActivityLog';
import { hashPassword, signAccessToken, signRefreshToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }

    const { firstName, lastName, email, password } = body;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required.' },
        { status: 400 }
      );
    }

    const emailNormalized = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(emailNormalized)) {
      return NextResponse.json({ error: 'Please provide a valid email address.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email address already exists. Please log in.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // Create the business placeholder for this new tenant
    const newBusiness = await Business.create({
      name: `${firstName.trim()}'s Workspace`,
      businessType: 'General Business',
      email: emailNormalized,
      currency: 'NGN',
      timeZone: 'Africa/Lagos',
      logo: '/logo/logo.png',
      onboardingStatus: 'NOT_STARTED',
      modules: [
        { key: 'TASKS', enabled: true, name: 'Task Operations' },
        { key: 'CUSTOMERS', enabled: true, name: 'Client Directory' },
        { key: 'STAFF', enabled: true, name: 'Team Management' },
        { key: 'FINANCE', enabled: true, name: 'Finance & Invoices' },
        { key: 'REPORTS', enabled: true, name: 'BI Reports' },
        { key: 'NOTIFICATIONS', enabled: true, name: 'Alerts' },
      ],
    });

    const newUser = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: emailNormalized,
      passwordHash,
      role: 'owner',
      businessId: newBusiness._id,
      department: 'Executive Leadership',
      avatar: `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase(),
      status: 'active',
      isEmailVerified: true,
    });

    newBusiness.ownerId = newUser._id;
    await newBusiness.save();

    await ActivityLog.create({
      businessId: newBusiness._id,
      userId: newUser._id,
      userName: `${newUser.firstName} ${newUser.lastName}`,
      userRole: 'Owner',
      action: 'Account registered and workspace initialized',
      recordAffected: 'Tenant Profile',
      module: 'Auth',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: 'Just now',
    });

    const tokenPayload = {
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      businessId: newBusiness._id.toString(),
    };

    const token = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return NextResponse.json(
      {
        message: 'Account created successfully.',
        token,
        accessToken: token,
        refreshToken,
        user: {
          id: newUser._id.toString(),
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          avatar: newUser.avatar,
          businessId: newBusiness._id.toString(),
          isEmailVerified: newUser.isEmailVerified,
          createdAt: newUser.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during registration.' },
      { status: 500 }
    );
  }
}
