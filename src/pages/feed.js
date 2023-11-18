import { Feed } from "feed";

/**
 * Given a list of processed excerpts, this function will
 * create a Feed which can be output as ATOM or RSS2.0
 *
 * @param {ProcessResponse[]} excerptContent
 *
 * @returns {Feed}
 */
export default function getFeed(excerptContent) {
  const rss = new Feed({
    id: "excerpts.beckelman.net",
    title: "excerpts.beckelman.net",
    link: "https://excerpts.beckelman.net/feed.xml",
    description: "A collection of excerpts by Bill Beckelman",
    updated: excerptContent[0]?.meta?.date
      ? new Date(excerptContent[0].meta.date)
      : new Date(),
    copyright: `All rights reserved, ${new Date().getFullYear()} Bill Beckelman`,
    language: "en",
    author: {
      name: "Bill Beckelman",
      email: "bill+excerpts@beckelman.net",
      link: "https://beckelman.net",
    },
  });

  excerptContent.map(({ html: content, meta, filePath }) => {
    const id = filePath.replace("./excerpts/", "").replace(/\.md$/, "");

    /** @type {FeedItem} */
    const item = {};
    if (meta?.title) {
      item.title = meta.title;
    }
    if (meta?.date) {
      item.date = new Date(meta.date);
    }
    item.content = content;
    const link = `https://excerpts.beckelman.net#${id}`;
    item.id = link;
    item.link = link;
    item.description = meta?.tags
      ? `An excerpt tagged with ${meta.tags.join(", ")}`
      : "An excerpt";
    rss.addItem(item);
  });

  return rss;
}
