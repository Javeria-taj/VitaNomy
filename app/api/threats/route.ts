import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const threats = [
    { level: 'low', message: 'All systems nominal. Optimal recovery detected.', color: 'green' },
    { level: 'low', message: 'Metabolic efficiency stagnant. Increase water intake.', color: 'gold' },
    { level: 'medium', message: 'Slight Cardiac Drift detected. Check hydration.', color: 'red' },
    { level: 'medium', message: 'Spike in oxidative stress. Antioxidant replenishment advised.', color: 'red' },
    { level: 'high', message: 'Systolic variance outside baseline. Rest immediate.', color: 'red' },
  ];

  // Randomly pick a threat (weighted towards nominal for demo safety)
  const rand = Math.random();
  let threat;
  if (rand > 0.7) {
    threat = threats[Math.floor(Math.random() * 2) + 2]; // medium/high
  } else {
    threat = threats[Math.floor(Math.random() * 2)]; // low/nominal
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    ...threat
  });
}
