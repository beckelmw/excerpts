import { default as xml } from "../html.js";

/**
 * Given a list of processed excerpts, this function will
 * create an RSS feed
 *
 * @param {ProcessResponse[]} content
 * @param {string} domain
 *
 * @returns {string}
 */
export default function getFeed(content, domain) {
  return xml`<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" 
      xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>${domain}</title>
        <description></description>
        <link>https://${domain}</link>
        <atom:link href="https://${domain}/feed.xml" rel="self" type="application/rss+xml" />
        ${content.slice(0, 10).map(({ html, meta }) => {
          const link = `https://${domain}#${meta?.id}`;
          return xml`
          <item>
              ${meta?.title && xml`<title>${escapeXml(meta?.title)}</title>`}
              <description>${escapeXml(html.toString())}</description>
              ${
                meta?.date &&
                xml`<pubDate>${new Date(meta.date).toUTCString()}</pubDate>`
              }
              <link>${link}</link>
              <guid isPermaLink="true">${link}</guid>
          </item>
        `;
        })}
      </channel>
    </rss>`;
}

/**
 *
 * @param {string} unsafe
 * @returns
 */
function escapeXml(unsafe) {
  // @ts-ignore
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
}
