const https = require('https');
const http = require('http');
const url = require('url');
const { exec } = require('child_process');

// ==========================================
// Credentials loaded from environment variables
// Set SHOPIFY_API_KEY and SHOPIFY_API_SECRET in your .env.local
// ==========================================
const SHOP_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || 'cleancrate-8642.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_API_KEY || '';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '';
const SCOPES = 'unauthenticated_read_product_listings,unauthenticated_write_checkouts,unauthenticated_read_checkouts,unauthenticated_read_product_inventory';
const REDIRECT_URI = 'http://localhost:3001/callback'; // Changed to 3001 to avoid conflict
// ==========================================


console.log('🚀 Starting OAuth Flow to get Storefront Token...');

// 1. Start a temporary server to handle the callback
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/callback') {
        const authCode = reqUrl.query.code;

        if (authCode) {
            console.log(`\n✅ Authorization Code Received: ${authCode}`);
            res.end('Authorization successful! You can check your terminal now.');

            // 2. Exchange Auth Code for Access Token
            exchangeCodeForToken(authCode);

            // Close server after short delay
            setTimeout(() => {
                server.close();
                process.exit(0);
            }, 5000);
        } else {
            res.end('Error: No authorization code found.');
        }
    } else {
        res.end('Waiting for callback...');
    }
});

server.listen(3001, () => {
    // 3. Construct Authorization URL
    const authUrl = `https://${SHOP_DOMAIN}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;

    console.log(`\n👉 Please open this URL in your browser to authorize the app:\n`);
    console.log(authUrl);
    console.log('\n(Once authorized, you will be redirected to localhost:3001/callback)');

    // Try to open automatically (Mac)
    exec(`open "${authUrl}"`);
});

function exchangeCodeForToken(code) {
    console.log('\n🔄 Exchanging code for Access Token...');

    const postData = JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code
    });

    const options = {
        hostname: SHOP_DOMAIN,
        path: '/admin/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.access_token) {
                    console.log('\n🎉 ADMIN ACCESS TOKEN RECEIVED:', json.access_token);

                    // 4. Now use this Admin Token to generate the Storefront Token
                    createStorefrontToken(json.access_token);
                } else {
                    console.error('❌ Failed to get Access Token:', json);
                }
            } catch (e) {
                console.error('Error parsing token response:', e);
            }
        });
    });

    req.write(postData);
    req.end();
}

function createStorefrontToken(adminAccessToken) {
    console.log('\n🔄 Creating Storefront Access Token...');

    const postData = JSON.stringify({
        storefront_access_token: {
            title: "Next.js Storefront Token",
            access_scope: SCOPES
        }
    });

    const options = {
        hostname: SHOP_DOMAIN,
        path: '/admin/api/2024-01/storefront_access_tokens.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'X-Shopify-Access-Token': adminAccessToken
        }
    };

    const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                if (json.storefront_access_token) {
                    console.log('\n✅✅✅ SUCCESS! YOUR STOREFRONT ACCESS TOKEN:\n');
                    console.log(json.storefront_access_token.access_token);
                    console.log('\n👉 Copy this into .env as NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN');
                } else {
                    console.error('❌ Failed to create Storefront Token:', json);
                }
            } catch (e) {
                console.error('Error parsing storefront response:', e);
            }
        });
    });

    req.write(postData);
    req.end();
}
