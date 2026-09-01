import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) {
      return session;
    }

    let businessData = null;
    if (session.businessId) {
      businessData = await Business.findById(session.businessId);
    }

    return NextResponse.json({
      user: {
        id: session.user._id.toString(),
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        name: `${session.user.firstName} ${session.user.lastName}`,
        role: session.user.role,
        department: session.user.department,
        avatar: session.user.avatar || `${session.user.firstName[0]}${session.user.lastName[0]}`.toUpperCase(),
        phone: session.user.phone,
        businessId: session.businessId,
        isEmailVerified: session.user.isEmailVerified,
        createdAt: session.user.createdAt.toISOString(),
      },
      business: businessData,
    });
  } catch (error: any) {
    console.error('Auth /me Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
