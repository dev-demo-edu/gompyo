import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * 주어진 URL에서 Open Graph og:image 썸네일을 추출합니다.
 * @param url 대상 웹페이지 URL
 * @returns og:image 썸네일 URL 또는 null
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const html = await res.text();
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr("content");
    return ogImage || null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
