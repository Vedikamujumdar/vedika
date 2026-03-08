"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const META_PIXEL_ID = "737709785946835";

// Extend the Window interface
declare global {
    interface Window {
        fbq: (...args: any[]) => void;
        _fbq: (...args: any[]) => void;
    }
}

/**
 * Helper to safely call fbq from anywhere in the app.
 * Usage: fbqTrack("AddToCart", { value: 299, currency: "INR", content_name: "Mocha Rush Oats" })
 */
export function fbqTrack(
    eventName: string,
    params?: Record<string, any>
) {
    if (typeof window !== "undefined" && window.fbq) {
        if (params) {
            window.fbq("track", eventName, params);
        } else {
            window.fbq("track", eventName);
        }
    }
}

/**
 * For custom events (non-standard Meta events)
 * Usage: fbqCustom("SignupFormSubmit", { source: "homepage" })
 */
export function fbqCustom(
    eventName: string,
    params?: Record<string, any>
) {
    if (typeof window !== "undefined" && window.fbq) {
        if (params) {
            window.fbq("trackCustom", eventName, params);
        } else {
            window.fbq("trackCustom", eventName);
        }
    }
}

/**
 * MetaPixel component — place in the root layout.
 * Loads the Meta Pixel base code and fires PageView on every route change.
 */
export function MetaPixel() {
    const pathname = usePathname();

    // Fire PageView on every route change (SPA navigation)
    useEffect(() => {
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "PageView");
        }
    }, [pathname]);

    return (
        <>
            {/* Meta Pixel Base Code */}
            <Script
                id="meta-pixel-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
                }}
            />
            {/* Meta Pixel noscript fallback */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </>
    );
}
