import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const body = await req.json().catch(() => ({}));
    const { businessType } = body;

    if (!businessType) {
      return NextResponse.json({ error: 'Business type is required.' }, { status: 400 });
    }

    if (!session.businessId) {
      return NextResponse.json({ error: 'Business not found. Please complete step 1.' }, { status: 400 });
    }

    const business = await Business.findById(session.businessId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
    }

    business.businessType = businessType;
    business.onboardingStatus = 'BUSINESS_TYPE_SET';
    await business.save();

    return NextResponse.json({ message: 'Business type saved.', success: true, business });
  } catch (error: any) {
    console.error('Save business type error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
