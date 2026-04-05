import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { ExtractResponse } from '@/types/patient';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const MODEL_NAME = 'claude-sonnet-4-20250514';

export async function POST(req: NextRequest) {
  try {
    const { pdf_base64, mode } = await req.json();

    if (!pdf_base64) {
      return NextResponse.json({ error: 'pdf_base64 is required' }, { status: 400 });
    }

    if (mode !== 'patient' && mode !== 'athlete') {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    const prompt = mode === 'patient' 
      ? `Extract all available medical values from this lab report.
Return ONLY valid JSON with these exact keys where present:
systolic_bp, diastolic_bp, glucose, cholesterol_total,
cholesterol_hdl, cholesterol_ldl, triglycerides, weight, height.
Omit any key not found. No markdown, no backticks.`
      : `Extract all available medical values from this blood panel.
Return ONLY valid JSON with these exact keys where present:
systolic_bp, diastolic_bp, glucose, cholesterol_total,
cholesterol_hdl, cholesterol_ldl, triglycerides, hematocrit,
hemoglobin, rbc, alt, ast, testosterone_total, testosterone_free,
estradiol, lh, fsh, creatinine, weight, height, body_fat_percent.
Omit any key not found. No markdown, no backticks.`;

    const response = await anthropic.messages.create({
      model: MODEL_NAME,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: pdf_base64
            }
          } as any,
          {
            type: 'text',
            text: prompt
          }
        ]
      }]
    });

    // @ts-ignore
    const text = response.content[0]?.text || '{}';
    const cleanJSON = text.replace(/```json|```/gi, '').trim();
    const extracted_fields = JSON.parse(cleanJSON);

    const expectedFields = mode === 'patient' 
      ? ['systolic_bp', 'diastolic_bp', 'glucose', 'cholesterol_total', 'cholesterol_hdl', 'cholesterol_ldl', 'triglycerides', 'weight', 'height']
      : ['systolic_bp', 'diastolic_bp', 'glucose', 'cholesterol_total', 'cholesterol_hdl', 'cholesterol_ldl', 'triglycerides', 'hematocrit', 'hemoglobin', 'rbc', 'alt', 'ast', 'testosterone_total', 'testosterone_free', 'estradiol', 'lh', 'fsh', 'creatinine', 'weight', 'height', 'body_fat_percent'];

    const unreadable_fields = expectedFields.filter(f => !(f in extracted_fields));
    const foundCount = expectedFields.length - unreadable_fields.length;
    const ratio = foundCount / expectedFields.length;
    
    const confidence = ratio > 0.7 ? 'high' : ratio > 0.4 ? 'medium' : 'low';

    const result: ExtractResponse = {
      mode,
      extracted_fields,
      unreadable_fields,
      confidence
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({
      mode: 'patient',
      extracted_fields: {},
      unreadable_fields: [],
      confidence: 'low'
    }, { status: 500 });
  }
}

export const maxDuration = 60
