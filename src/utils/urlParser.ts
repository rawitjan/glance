export interface ParsedLink {
  url: string;
  domain: string;
}

const URL_REGEX = /(https?:\/\/[^\s<>"{}|\\^`[\]]+)/gi;

export function extractUrls(text: string): ParsedLink[] {
  if (!text) return [];
  const matches = text.match(URL_REGEX);
  if (!matches) return [];

  // Deduplicate URLs
  const uniqueUrls = Array.from(new Set(matches));
  return uniqueUrls.map((url) => {
    try {
      const parsed = new URL(url);
      return {
        url,
        domain: parsed.hostname.replace('www.', ''),
      };
    } catch {
      return {
        url,
        domain: 'link',
      };
    }
  });
}
