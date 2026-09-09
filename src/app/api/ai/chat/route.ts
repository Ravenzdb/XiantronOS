import {NextResponse} from 'next/server';
// AI remains disabled until authentication, consent enforcement and a rate limiter are configured.
export async function POST(){return NextResponse.json({error:'AI Mentor is not configured.'},{status:503});}
