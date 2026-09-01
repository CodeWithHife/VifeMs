import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import Customer from '@/models/Customer';
import ActivityLog from '@/models/ActivityLog';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('q') || '';
    const status = searchParams.get('status') || '';
    const customerType = searchParams.get('type') || '';

    const filter: any = { businessId: session.businessId };

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (customerType && customerType !== 'All') {
      filter.customerType = customerType;
    }
    if (search.trim()) {
      filter.$or = [
        { firstName: { $regex: search.trim(), $options: 'i' } },
        { lastName: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { phone: { $regex: search.trim(), $options: 'i' } },
        { assignedStaff: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const customers = await Customer.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      customers: customers.map((c) => ({
        id: c._id.toString(),
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone || '+234 800 000 0000',
        address: c.address || 'Lagos, Nigeria',
        customerType: c.customerType,
        status: c.status,
        tags: c.tags || [],
        notes: c.notes || '',
        totalSpent: c.totalSpent || 0,
        totalTransactions: c.totalTransactions || 0,
        assignedStaff: c.assignedStaff || `${session.user.firstName} ${session.user.lastName}`,
        lastActivity: c.lastActivity || 'Just now',
        createdAt: c.createdAt.toISOString().split('T')[0],
      })),
      total: customers.length,
    });
  } catch (error: any) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(req);
    if (session instanceof NextResponse) return session;

    const body = await req.json().catch(() => ({}));
    const { firstName, lastName, email, phone, address, customerType, status, tags, notes, assignedStaff } = body;

    if (!firstName?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'First name and email are required.' }, { status: 400 });
    }

    const customer = await Customer.create({
      businessId: session.businessId,
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      email: email.trim().toLowerCase(),
      phone: phone || '',
      address: address || '',
      customerType: customerType || 'Corporate',
      status: status || 'Active',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : ['New Customer'],
      notes: notes || '',
      assignedStaff: assignedStaff || `${session.user.firstName} ${session.user.lastName}`,
      totalSpent: 0,
      totalTransactions: 0,
      lastActivity: 'Just now',
    });

    await ActivityLog.create({
      businessId: session.businessId,
      userId: session.user._id,
      userName: `${session.user.firstName} ${session.user.lastName}`,
      userRole: session.user.role,
      action: `Created new customer record: ${customer.firstName} ${customer.lastName}`,
      recordAffected: `Customer #${customer._id.toString().slice(-6)}`,
      module: 'Customers',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      timestamp: 'Just now',
    });

    return NextResponse.json(
      {
        message: 'Customer created successfully.',
        customer: {
          id: customer._id.toString(),
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          customerType: customer.customerType,
          status: customer.status,
          tags: customer.tags,
          notes: customer.notes,
          totalSpent: customer.totalSpent,
          totalTransactions: customer.totalTransactions,
          assignedStaff: customer.assignedStaff,
          lastActivity: customer.lastActivity,
          createdAt: customer.createdAt.toISOString().split('T')[0],
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST /api/customers error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
