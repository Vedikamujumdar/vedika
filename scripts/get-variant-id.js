const https = require('https');

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "cleancrate-8642.myshopify.com";
const apiKey = process.env.SHOPIFY_API_KEY || "";
const apiSecret = process.env.SHOPIFY_API_SECRET || "";


console.log("Fetching products...");

const auth = Buffer.from(apiKey + ':' + apiSecret).toString('base64');
const options = {
    hostname: domain,
    path: '/admin/api/2024-01/products.json',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + auth
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.products) {
                json.products.forEach(p => {
                    console.log(`\nProduct: ${p.title}`);
                    p.variants.forEach(v => {
                        console.log(` - Variant: ${v.title} | ID: ${v.id}`);
                    });
                });
            } else {
                console.log("No products found or error:", json);
            }
        } catch (e) {
            console.error("Error parsing JSON:", e);
            console.log("Raw data:", data);
        }
    });
});

req.on('error', (e) => {
    console.error("Request error:", e);
});

req.end();
