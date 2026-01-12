import { NextRequest, NextResponse } from 'next/server';

// Define OTP interface
interface OtpRecord {
  id: string;
  phone: string | null;
  email: string | null;
  otp: string;
  expires_at: string;
  created_at: string;
}

// For verification, we'll use the same otps array but it would come from a shared module in a real app
// Mock data for demonstration
let otps: OtpRecord[] = [];

// POST /api/otp/verify - Verify an OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.otpId || !body.otp) {
      return NextResponse.json(
        { error: 'OTP ID and OTP code are required' },
        { status: 400 }
      );
    }

    // Find OTP record
    const otpRecord = otps.find(record => record.id === body.otpId);
    if (!otpRecord) {
      return NextResponse.json(
        { error: 'Invalid OTP ID' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    const now = new Date();
    const expiry = new Date(otpRecord.expires_at);
    if (now > expiry) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== body.otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Mark as verified by removing from storage (in a real app, you'd use a more secure approach)
    otps = otps.filter(record => record.id !== body.otpId);

    return NextResponse.json({
      message: 'OTP verified successfully',
      data: {
        phone: otpRecord.phone,
        email: otpRecord.email,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}