import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    if (!session.businessId) {
      return NextResponse.json({
        status: 'NOT_STARTED',
        business: null,
      });
    }

    const business = await Business.findById(session.businessId);
    if (!business) {
      return NextResponse.json({
        status: 'NOT_STARTED',
        business: null,
      });
    }

    return NextResponse.json({
      status: business.onboardingStatus || 'NOT_STARTED',
      business,
    });
  } catch (error: any) {
    console.error('Onboarding status error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
