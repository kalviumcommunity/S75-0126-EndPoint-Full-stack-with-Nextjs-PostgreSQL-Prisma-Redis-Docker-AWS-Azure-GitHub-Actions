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

// Mock data for demonstration
let otps: OtpRecord[] = [];

// Helper function to generate a 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST /api/otp - Create a new OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.phone && !body.email) {
      return NextResponse.json(
        { error: 'Either phone number or email is required' },
        { status: 400 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Store OTP
    const newOtpRecord = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      phone: body.phone || null,
      email: body.email || null,
      otp: otp,
      expires_at: expiryTime.toISOString(),
      created_at: new Date().toISOString(),
    };

    otps.push(newOtpRecord);

    // In a real application, you would send the OTP via SMS or email here
    console.log(`Generated OTP ${otp} for ${body.phone || body.email}`);

    return NextResponse.json(
      { message: 'OTP sent successfully', otpId: newOtpRecord.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating OTP:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/otp/verify - Verify an OTP
export async function PUT(request: NextRequest) {
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