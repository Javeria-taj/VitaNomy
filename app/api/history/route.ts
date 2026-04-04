import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ sessions: [] });
    }

    const sessions = await prisma.analysis.findMany({
      where: {
        session: {
          patientId: patientId
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10,
      include: {
        session: true
      }
    });

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('History API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}
