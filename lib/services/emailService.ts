import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const { name, email, subject, message, locale } = data;
  
  const emailSubject = locale === 'ru' 
    ? `Новое сообщение от ${name}: ${subject}`
    : `New message from ${name}: ${subject}`;
  
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
      
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Language:</strong> ${locale.toUpperCase()}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin: 20px 0;">
        <h3 style="color: #7c3aed;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      
      <p style="color: #6b7280; font-size: 14px;">
        This email was sent from the FATOS.pro contact form.
      </p>
    </div>
  `;

  const result = await resend.emails.send({
    from: 'FATOS.pro Contact Form <noreply@fatos.pro>',
    to: process.env.CONTACT_EMAIL || 'support@fatos.pro',
    replyTo: email,
    subject: emailSubject,
    html: emailHtml,
  });

  if (!result.data) {
    throw new Error('Failed to send email via Resend');
  }
}
