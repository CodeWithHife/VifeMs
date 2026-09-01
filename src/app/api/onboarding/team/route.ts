import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';
import Staff from '@/models/Staff';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const body = await req.json().catch(() => ({}));
    const { members } = body;

    if (!session.businessId) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 400 });
    }

    if (Array.isArray(members) && members.length > 0) {
      for (const m of members) {
        if (m.email?.trim()) {
          const emailNormalized = m.email.trim().toLowerCase();
          const existing = await Staff.findOne({ businessId: session.businessId, email: emailNormalized });
          if (!existing) {
            await Staff.create({
              businessId: session.businessId,
              name: emailNormalized.split('@')[0],
              email: emailNormalized,
              role: m.role || 'Staff',
              department: m.role === 'Manager' ? 'Operations' : 'Staff Operations',
              status: 'Active',
              permissions: m.role === 'Administrator' ? ['ALL_PERMISSIONS'] : ['VIEW_TASKS', 'EDIT_TASKS'],
            });
          }
        }
      }
    }

    const business = await Business.findById(session.businessId);
    if (business) {
      business.onboardingStatus = 'TEAM_INVITED';
      await business.save();
    }

    return NextResponse.json({ message: 'Team members invited successfully.', success: true });
  } catch (error: any) {
    console.error('Invite team error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
