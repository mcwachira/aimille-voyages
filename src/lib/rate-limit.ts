
import "server-only";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const enquiryRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"),
    prefix: "aimille:enquiry",
});

export async function limitEnquirySubmission(identifier: string) {
    return enquiryRateLimit.limit(identifier);
}
