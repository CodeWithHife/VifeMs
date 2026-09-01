import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Business from '@/models/Business';
import ActivityLog from '@/models/ActivityLog';

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const body = await req.json().catch(() => ({}));
    const { name, email, phone, address, country, state, website, currency, timeZone, logo } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Business name and email are required.' }, { status: 400 });
    }

    let business = null;
    if (session.businessId) {
      business = await Business.findById(session.businessId);
    }

    if (!business) {
      business = await Business.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || '',
        address: address || '',
        country: country || 'Nigeria',
        state: state || 'Lagos',
        website: website || '',
        currency: currency || 'NGN',
        timeZone: timeZone || 'Africa/Lagos',
        logo: logo || '/logo/logo.png',
        ownerId: session.user._id,
        onboardingStatus: 'BUSINESS_INFO_ADDED',
      });
      session.user.businessId = business._id;
      await session.user.save();
    } else {
      business.name = name.trim();
      business.email = email.trim().toLowerCase();
      if (phone !== undefined) business.phone = phone;
      if (address !== undefined) business.address = address;
      if (country !== undefined) business.country = country;
      if (state !== undefined) business.state = state;
      if (website !== undefined) business.website = website;
      if (currency !== undefined) business.currency = currency;
      if (timeZone !== undefined) business.timeZone = timeZone;
      if (logo !== undefined) business.logo = logo;
      business.onboardingStatus = 'BUSINESS_INFO_ADDED';
      await business.save();
    }

    await ActivityLog.create({
      businessId: business._id,
      userId: session.user._id,
      userName: `${session.user.firstName} ${session.user.lastName}`,
      userRole: session.user.role,
      action: `Updated business information: ${business.name}`,
      recordAffected: 'Business Profile',
      module: 'Onboarding',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: 'Just now',
    });

    return NextResponse.json({ message: 'Business info saved.', success: true, business });
  } catch (error: any) {
    console.error('Save business info error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
