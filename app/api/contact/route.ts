import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/services/rateLimiter';
import { contactSchema } from '@/lib/validations/contactSchema';
import { createContactSubmission, updateSubmissionEmailStatus } from '@/lib/services/contactService';
import { sendContactEmail } from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitResult = await checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed',
          errors: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 3. Create database record
    const submission = await createContactSubmission({
      ...data,
      ipAddress: ip,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // 4. Send email
    try {
      await sendContactEmail(data);
      
      // Update submission with success status
      await updateSubmissionEmailStatus(submission.id, true);
      
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully',
        submissionId: submission.id,
      });
    } catch (emailError: any) {
      // Update submission with error
      await updateSubmissionEmailStatus(
        submission.id, 
        false, 
        emailError.message
      );
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send email. Your message was saved and we will respond soon.' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
