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
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "2",
        media_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80",
        media_type: "VIDEO",
        caption: "Morning routine sorted ☀️ #Oats #Breakfast",
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "3",
        media_url: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?w=800&q=80",
        media_type: "VIDEO",
        caption: "Mocha Rush energy ☕️ #CoffeeLover #Protein",
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "4",
        media_url: "https://images.unsplash.com/photo-1511690656952-34342d5c2895?w=800&q=80",
        media_type: "VIDEO",
        caption: "Healthy snacking ideas 🥗 #Wellness",
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "5",
        media_url: "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80",
        media_type: "VIDEO",
        caption: "Cook with us! 👩‍🍳 #Recipe #HealthyEating",
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "6",
        media_url: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
        media_type: "VIDEO",
        caption: "Behind the scenes 🎥 #CleanCrate",
        permalink: "https://www.instagram.com/poushtpop/"
    },
    {
        id: "7",
        media_url: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80",
        media_type: "VIDEO",
        caption: "Our story ✨ #HealthyLiving",
        permalink: "https://www.instagram.com/poushtpop/"
    }
];

export async function getLatestReels(): Promise<InstagramReel[]> {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!token) {
        console.warn("INSTAGRAM_ACCESS_TOKEN not found, using static mock data.");
        return MOCK_REELS;
    }

    try {
        // Fetch fields: id, media_type, media_url, thumbnail_url, permalink, caption
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=8`;

        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Failed to fetch Instagram posts: ${response.status} ${response.statusText}`, errorText);
            return MOCK_REELS;
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            console.error("Invalid response structure from Instagram API", data);
            return MOCK_REELS;
        }

        return data.data;

    } catch (error) {
        console.error("Error fetching Instagram posts:", error);
        return MOCK_REELS;
    }
}
