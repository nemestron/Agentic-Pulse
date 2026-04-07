import { rateLimitedFetch } from "./rateLimiter";
import { NewsApiResponse } from "@/types/news";

const BASE_URL = "https://newsapi.org/v2";

async function fetchWithAuth(endpoint: string): Promise<NewsApiResponse> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) throw new Error("NEWS_API_KEY is not defined in environment variables.");

  const url = `${BASE_URL}${endpoint}`;
  const response = await rateLimitedFetch(url, {
    headers: { "X-Api-Key": apiKey },
    next: { revalidate: 3600 } // Cache responses for 1 hour to heavily preserve rate limits
  });

  if (response.status === 401) throw new Error("NewsAPI Unauthorized: Check your API Key.");
  if (response.status === 429) throw new Error("NewsAPI Rate Limited (HTTP 429).");
  if (!response.ok) throw new Error(`NewsAPI HTTP Error: ${response.status}`);

  return response.json();
}

export async function getTopHeadlines(category: string, pageSize: number = 20) {
  return fetchWithAuth(`/top-headlines?category=${category}&language=en&pageSize=${pageSize}`);
}

export async function searchArticles(query: string, sortBy: string = "publishedAt", pageSize: number = 10) {
  return fetchWithAuth(`/everything?q=${encodeURIComponent(query)}&sortBy=${sortBy}&language=en&pageSize=${pageSize}`);
}

export async function getTechNews(pageSize: number = 20) {
  return getTopHeadlines("technology", pageSize);
}