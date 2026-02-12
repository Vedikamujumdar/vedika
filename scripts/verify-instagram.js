
require('dotenv').config({ path: '.env.local' });

async function checkInstagram() {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!token) {
        console.error("❌ No INSTAGRAM_ACCESS_TOKEN found in .env.local");
        return;
    }

    console.log("Verifying Instagram Token...");
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}&limit=3`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to fetch Instagram posts: ${response.status} ${response.statusText}`);
            console.error(errorText);
            return;
        }

        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
            console.log("✅ Instagram Connection Successful!");
            console.log(`Fetched ${data.data.length} recent posts:`);
            data.data.forEach(post => {
                console.log(`- [${post.media_type}] ${post.caption ? post.caption.substring(0, 30) + '...' : 'No Caption'} (${post.permalink})`);
            });
        } else {
            console.warn("⚠️ Valid response but 'data' array is missing or empty.");
            console.log(JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error("❌ Error running verification:", error);
    }
}

checkInstagram();
