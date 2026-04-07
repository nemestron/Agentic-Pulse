// In-memory rate limiter tracking (Note: resets on serverless cold starts)
const DAILY_LIMIT = 95; // NewsAPI free tier strictly caps at 100
let requestCount = 0;
let currentDay = new Date().getUTCDate();

export async function rateLimitedFetch(url: string, options?: RequestInit): Promise<Response> {
  const today = new Date().getUTCDate();
  
  if (today !== currentDay) {
    currentDay = today;
    requestCount = 0;
  }

  if (requestCount >= DAILY_LIMIT) {
    throw new Error(`NewsAPI Rate Limit Reached. Buffer capped at ${DAILY_LIMIT} requests.`);
  }

  requestCount++;
  console.log(`[NewsAPI] Request ${requestCount}/${DAILY_LIMIT} | URL: ${url}`);
  
  return fetch(url, options);
}