import { NextResponse } from "next/server";

export async function GET() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
        return NextResponse.json({
            status: "ERROR",
            message: "INSTAGRAM_ACCESS_TOKEN environment variable is NOT SET",
            tokenExists: false,
        });
    }

    // Show first/last 6 chars of token for verification
    const tokenPreview = `${token.substring(0, 6)}...${token.substring(token.length - 6)}`;

    try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=3`;

        const response = await fetch(url, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                status: "API_ERROR",
                message: `Instagram API returned ${response.status}`,
                tokenExists: true,
                tokenPreview,
                tokenLength: token.length,
                apiError: data,
            });
        }

        return NextResponse.json({
            status: "SUCCESS",
            message: `Fetched ${data.data?.length || 0} posts successfully`,
            tokenExists: true,
            tokenPreview,
            tokenLength: token.length,
            postsCount: data.data?.length || 0,
            posts: data.data?.map((p: any) => ({
                id: p.id,
                type: p.media_type,
                caption: p.caption?.substring(0, 50),
                hasMediaUrl: !!p.media_url,
                hasThumbnail: !!p.thumbnail_url,
            })),
            lastUpdated: new Date().toISOString(),
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "FETCH_ERROR",
            message: error.message,
            tokenExists: true,
            tokenPreview,
            tokenLength: token.length,
        });
    }
}
