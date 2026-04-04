import { NextRequest, NextResponse } from 'next/server';
import { chatWithTwin } from '@/lib/claudeService';
import { ChatRequest, ChatResponse } from '@/types/patient';

export async function POST(req: NextRequest) {
  try {
    const { patient, analysis, history, message }: ChatRequest = await req.json();

    if (!patient || !analysis || !message) {
      return NextResponse.json({ error: 'Missing required chat parameters' }, { status: 400 });
    }

    const reply = await chatWithTwin(patient, analysis, history || [], message);

    const response: ChatResponse = { reply };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json({ error: 'Chat interface failure' }, { status: 500 });
  }
}
