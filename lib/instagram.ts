export interface InstagramReel {
    id: string;
    media_url: string;
    thumbnail_url?: string;
    caption: string;
    permalink: string;
    media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
}

// Fallback to mock data if API fails or token is missing
const MOCK_REELS: InstagramReel[] = [
    {
        id: "1",
        media_url: "https://images.unsplash.com/photo-1541604112-2e09e2956c15?w=800&q=80",
        media_type: "VIDEO",
        caption: "Crunchy goodness! 🍪 #CleanCrate #HealthySnacks",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "2",
        media_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
        media_type: "VIDEO",
        caption: "Morning routine sorted ☀️ #Oats #Breakfast",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "3",
        media_url: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80",
        media_type: "VIDEO",
        caption: "Mocha Rush energy ☕️ #CoffeeLover #Protein",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "4",
        media_url: "https://images.unsplash.com/photo-1511690656952-34342d5c2895?w=800&q=80",
        media_type: "VIDEO",
        caption: "Healthy snacking ideas 🥗 #Wellness",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "5",
        media_url: "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80",
        media_type: "VIDEO",
        caption: "Cook with us! 👩‍🍳 #Recipe #HealthyEating",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "6",
        media_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        media_type: "VIDEO",
        caption: "Behind the scenes 🎥 #CleanCrate",
        permalink: "https://www.instagram.com/thecleancrate/"
    },
    {
        id: "7",
        media_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80",
        media_type: "VIDEO",
        caption: "Our story ✨ #HealthyLiving",
        permalink: "https://www.instagram.com/thecleancrate/"
    }
];

// Valid token starting with IGAA...
const HARDCODED_VALID_TOKEN = "IGAANONTVltZAxBZAFk4TWYtOFlWc3ZAZATEljZAFVKNEduR0pRdEFsZAVc0VWI1T1ZAKMUFpT2RlT1piOXVjUzBSSXYwMXp6V2NISGVNU3liOXUtcURTb2libXctaHlxWW9CZA0R2bGFGclJWR0lwbGtuc3VNanV1dkxmZAjhNQTRQTlZApUQZDZD";

export async function getLatestReels(): Promise<InstagramReel[]> {
    let token = process.env.INSTAGRAM_ACCESS_TOKEN;

    // Fix for Vercel env var issue: If token is missing OR starts with 'EAA' (Facebook format, wrong), use hardcoded valid token
    if (!token || token.startsWith("EAA")) {
        console.warn("[Instagram] Env var invalid or missing, using hardcoded fallback token.");
        token = HARDCODED_VALID_TOKEN;
    }

    if (!token) {
        console.warn("INSTAGRAM_ACCESS_TOKEN not found, using static mock data.");
        return MOCK_REELS;
    }

    console.log("[Instagram] Token found, fetching live data...");

    try {
        // Fetch fields: id, media_type, media_url, thumbnail_url, permalink, caption
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=8`;

        const response = await fetch(url, {
            cache: 'no-store' // Always fetch fresh data, never cache
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Instagram] Failed to fetch posts: ${response.status} ${response.statusText}`, errorText);
            return MOCK_REELS;
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            console.error("[Instagram] Invalid response structure from Instagram API", data);
            return MOCK_REELS;
        }

        console.log(`[Instagram] Successfully fetched ${data.data.length} posts`);
        return data.data;

    } catch (error) {
        console.error("[Instagram] Error fetching posts:", error);
        return MOCK_REELS;
    }
}
