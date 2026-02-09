import { NextResponse } from "next/server";

// Google Form Configuration
const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSejBS1pA4ddRU_2DMPv1LsJmbzCF9md-CidHUaHOF87ERAK0w/formResponse";

const FIELD_MAPPING = {
    name: "entry.1283266528",
    role: "entry.122595403",
    rating: "entry.1197868331",
    review: "entry.287233578"
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { author, role, rating, text } = body;

        if (!author || !rating || !text) {
            return NextResponse.json(
                { error: "Author, rating, and text are required" },
                { status: 400 }
            );
        }

        // Construct Form Data for Google Forms
        const formData = new URLSearchParams();
        formData.append(FIELD_MAPPING.name, author);
        formData.append(FIELD_MAPPING.role, role || "Verified Buyer");
        formData.append(FIELD_MAPPING.rating, rating.toString());
        formData.append(FIELD_MAPPING.review, text);

        // Submit to Google Forms
        const response = await fetch(GOOGLE_FORM_ACTION_URL, {
            method: "POST",
            mode: "no-cors", // Google Forms doesn't support CORS for direct browser fetch, but server-side is fine
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData.toString(),
        });

        // Google Forms returns an opaque response in no-cors mode, or HTML. 
        // Since we are proxying, we just assume success if no network error thrown.
        // Actually, on server side 'no-cors' isn't a thing like in browser, 
        // but Google returns 200 OK with HTML content on success.

        if (response.ok) {
            return NextResponse.json({ success: true });
        } else {
            console.error("Google Form Submission Failed:", response.status, response.statusText);
            return NextResponse.json({ error: "Failed to submit to Google Form" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Review API Route Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
