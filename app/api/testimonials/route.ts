import { NextResponse } from 'next/server';

// ----------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------

// REPLACE THIS WITH YOUR GOOGLE SHEET CSV LINK
// Instructions: File > Share > Publish to web > Select Sheet > Comma-separated values (.csv)
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdda6aSHcKtg11amN9y9g3tVW5WTAeJbip1JdrHylcbllEdIVN3HW4IumYqxjVSvlCE8jlOIjaqJyw/pub?gid=1305112719&single=true&output=csv";

// ----------------------------------------------------------------------
// DATA MAPPING
// ----------------------------------------------------------------------

interface Testimonial {
    id: string | number;
    author: string;
    role: string;
    rating: number;
    text: string;
    date: string;
}

import Papa from 'papaparse';

export async function GET() {
    // Mock Data as Fallback (Use this until you add your Sheet URL)
    const mockData: Testimonial[] = [
        {
            id: "mock-1",
            author: "Sarah",
            role: "Verified Buyer",
            rating: 5,
            text: "Absolutely love the Mocha vibe! It's my go-to breakfast now. The coffee kick is real.",
            date: "2 days ago"
        },
        {
            id: "mock-2",
            author: "Mike",
            role: "Fitness Enthusiast",
            rating: 5,
            text: "Best protein oats I've tried. Not too sweet, just perfect.",
            date: "1 week ago"
        },
        {
            id: "mock-3",
            author: "Priya",
            role: "Verified Buyer",
            rating: 4,
            text: "Very tasty! I add a bit of almond milk and it's perfect.",
            date: "2 weeks ago"
        }
    ];

    try {
        const response = await fetch(GOOGLE_SHEET_CSV_URL, { cache: 'no-store' });

        if (!response.ok) throw new Error("Failed to fetch CSV");

        const csvText = await response.text();

        const parsed = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        if (parsed.errors.length > 0) {
            console.error("CSV Parsing Errors:", parsed.errors);
        }

        const data = parsed.data as any[];

        // Map CSV rows to Testimonial interface
        // Expected Headers: Timestamp, Name, Role, Rating, Review
        const testimonials: Testimonial[] = data.map((row, index) => ({
            id: index.toString(), // Use index as ID since form doesn't provide one
            author: row.Name || "Anonymous",
            role: row.Role || "Verified Buyer",
            rating: parseInt(row.Rating) || 5,
            text: row.Review || "",
            date: row.Timestamp ? new Date(row.Timestamp).toLocaleDateString() : "Recent"
        })).filter(t => t.rating); // Keep reviews as long as they have a rating

        return NextResponse.json(testimonials.length > 0 ? testimonials : mockData);

    } catch (error) {
        console.error("Testimonials API Error:", error);
        return NextResponse.json(mockData);
    }
}
