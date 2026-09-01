import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User, { IUser, UserRole } from '@/models/User';
import Business from '@/models/Business';

const JWT_SECRET = process.env.JWT_SECRET || 'vifems_secure_jwt_secret_super_production_key_2026_x89f';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'vifems_secure_refresh_secret_super_production_key_2026_r92k';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  businessId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export interface AuthSession {
  user: IUser;
  userId: string;
  email: string;
  role: UserRole;
  businessId: string;
}

/**
 * Extracts and verifies the user session from the Request headers or cookies.
 * Derives businessId strictly from the authenticated database user to guarantee multi-tenant security.
 */
export async function getAuthSession(req: Request | NextRequest): Promise<AuthSession | null> {
  try {
    await connectDB();

    let token: string | null = null;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    }

    if (!token && 'cookies' in req) {
      const cookieStore = (req as NextRequest).cookies;
      token = cookieStore.get('vifems_token')?.value || null;
    }

    if (!token) {
      return null;
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.userId) {
      return null;
    }

    const user = await User.findById(payload.userId);
    if (!user || user.status !== 'active') {
      return null;
    }

    // If user has no businessId yet (e.g. newly registered, before onboarding), check if they own a business
    let businessId = user.businessId ? user.businessId.toString() : '';
    if (!businessId) {
      const ownedBusiness = await Business.findOne({ ownerId: user._id });
      if (ownedBusiness) {
        businessId = ownedBusiness._id.toString();
        user.businessId = ownedBusiness._id;
        await user.save();
      }
    }

    return {
      user,
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      businessId,
    };
  } catch (error) {
    console.error('getAuthSession error:', error);
    return null;
  }
}

/**
 * Ensures request is authenticated. Returns AuthSession or a 401 NextResponse.
 */
export async function requireAuth(req: Request | NextRequest): Promise<AuthSession | NextResponse> {
  const session = await getAuthSession(req);
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in to continue.', success: false },
      { status: 401 }
    );
  }
  return session;
}

/**
 * Ensures request has required roles. Returns AuthSession or a 403 NextResponse.
 */
export async function requireRoles(
  req: Request | NextRequest,
  allowedRoles: UserRole[]
): Promise<AuthSession | NextResponse> {
  const authResult = await requireAuth(req);
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  if (!allowedRoles.includes(authResult.role)) {
    return NextResponse.json(
      { error: 'Forbidden. You do not have permission to perform this action.', success: false },
      { status: 403 }
    );
  }

  return authResult;
}
