import { prisma } from '@/lib/prisma';
import { ContactStatus } from '@prisma/client';

interface CreateContactSubmissionData {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
  ipAddress?: string;
  userAgent?: string;
}

export async function createContactSubmission(data: CreateContactSubmissionData) {
  return await prisma.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      locale: data.locale,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      status: ContactStatus.PENDING,
      emailSent: false,
    },
  });
}

export async function updateSubmissionEmailStatus(
  submissionId: string,
  sent: boolean,
  error?: string
) {
  return await prisma.contactSubmission.update({
    where: { id: submissionId },
    data: {
      emailSent: sent,
      emailSentAt: sent ? new Date() : null,
      emailError: error || null,
    },
  });
}

export async function getContactSubmissions(filters?: {
  email?: string;
  status?: ContactStatus;
  emailSent?: boolean;
  limit?: number;
}) {
  return await prisma.contactSubmission.findMany({
    where: {
      email: filters?.email,
      status: filters?.status,
      emailSent: filters?.emailSent,
    },
    orderBy: { createdAt: 'desc' },
    take: filters?.limit || 50,
  });
}
