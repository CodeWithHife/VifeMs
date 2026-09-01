import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';
import Staff from '@/models/Staff';
import Notification from '@/models/Notification';
import ActivityLog from '@/models/ActivityLog';

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    if (!session.businessId) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 400 });
    }

    const business = await Business.findById(session.businessId);
    if (!business) {
      return NextResponse.json({ error: 'Business not found.' }, { status: 404 });
    }

    business.onboardingStatus = 'COMPLETED';
    await business.save();

    // Ensure owner is added to Staff list
    const ownerStaff = await Staff.findOne({ businessId: business._id, email: session.user.email });
    if (!ownerStaff) {
      await Staff.create({
        businessId: business._id,
        userId: session.user._id,
        name: `${session.user.firstName} ${session.user.lastName}`,
        email: session.user.email,
        phone: session.user.phone || business.phone || '+234 800 000 0000',
        role: 'Administrator',
        department: 'Executive Operations',
        status: 'Active',
        permissions: ['ALL_PERMISSIONS'],
      });
    }

    // Create welcome notification
    await Notification.create({
      businessId: business._id,
      userId: session.user._id,
      category: 'System',
      title: `Welcome to ${business.name}!`,
      description: `Your ${business.businessType} workspace is fully initialized and operational.`,
      read: false,
    });

    await ActivityLog.create({
      businessId: business._id,
      userId: session.user._id,
      userName: `${session.user.firstName} ${session.user.lastName}`,
      userRole: session.user.role === 'owner' ? 'Owner' : session.user.role,
      action: `Completed business onboarding for ${business.name}`,
      recordAffected: 'Tenant Workspace',
      module: 'Settings',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: 'Just now',
    });

    return NextResponse.json({ message: 'Onboarding completed successfully.', success: true, business });
  } catch (error: any) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
