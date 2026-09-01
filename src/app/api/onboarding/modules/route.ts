import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const body = await req.json().catch(() => ({}));
    const { modules } = body;

    if (!session.businessId) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 400 });
    }

    const business = await Business.findById(session.businessId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
    }

    if (Array.isArray(modules)) {
      business.modules = modules;
    }
    business.onboardingStatus = 'MODULES_CONFIGURED';
    await business.save();

    return NextResponse.json({ message: 'Modules configured.', success: true, business });
  } catch (error: any) {
    console.error('Configure modules error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
