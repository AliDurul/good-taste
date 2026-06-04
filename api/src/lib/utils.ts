import { randomBytes } from "crypto";

/**
 * Generates a unique 8-character uppercase referral code.
 * Uses crypto.randomBytes for unpredictability.
 * The @unique constraint on User.referralCode handles rare collisions.
 */
export const generateReferralCode = (): string => {
    return randomBytes(4).toString("hex").toUpperCase();
};




