import { CFConfig, CFPaymentGateway, CFEnvironment } from "cashfree-pg-sdk-nodejs";

// Load environment variables - these should be loaded once per request really, but here is fine
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_ENV = process.env.CASHFREE_ENV || "TEST"; // "TEST" or "PROD"

if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    console.warn("Cashfree App ID or Secret Key is missing in environment variables.");
}

// Ensure the gateway is instantiated
const cashfree = new CFPaymentGateway();

export const getCashfreeConfig = () => {
    return new CFConfig(
        CASHFREE_ENV === "PROD" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
        "2022-09-01",
        CASHFREE_APP_ID || "",
        CASHFREE_SECRET_KEY || ""
    );
};

export default cashfree;
