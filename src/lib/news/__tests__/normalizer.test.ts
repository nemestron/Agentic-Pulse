import { describe, it, expect } from 'vitest';
import { normalizeNewsArticle } from '../normalizer';

describe('News Normalizer', () => {
  it('should normalize a valid NewsAPI article', () => {
    const rawArticle = {
      source: { id: 'techcrunch', name: 'TechCrunch' },
      author: 'John Doe',
      title: 'AI Revolution',
      description: 'AI is changing everything.',
      url: 'https://techcrunch.com/ai-revolution',
      urlToImage: null,
      publishedAt: '2026-04-01T12:00:00Z',
      content: 'Full content here.'
    };

    const result = normalizeNewsArticle(rawArticle);
    
    expect(result).not.toBeNull();
    expect(result?.title).toBe('AI Revolution');
    expect(result?.sourceDomain).toBe('TechCrunch');
    expect(result?.articleId).toBeDefined();
  });

  it('should reject articles with missing titles or URLs', () => {
    const invalidArticle = {
      source: { id: 'techcrunch', name: 'TechCrunch' },
      author: null,
      title: '[Removed]',
      description: null,
      url: 'https://removed.com',
      urlToImage: null,
      publishedAt: '2026-04-01T12:00:00Z',
      content: null
    };

    const result = normalizeNewsArticle(invalidArticle);
    expect(result).toBeNull();
  });
});