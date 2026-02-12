import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    return NextResponse.json({
        buildId: "v2-check-" + new Date().toISOString(),
        timestamp: new Date().toISOString(),
        envVarExists: !!token,
        tokenStart: token ? token.substring(0, 5) : "MISSING",
        tokenLength: token ? token.length : 0,
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV,
    });
}
