import { readFile } from "fs/promises";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypeMinifyWhitespace from "rehype-minify-whitespace";
import rehypeHighlight from "rehype-highlight";
import frontmatter from "./transformers/frontmatter.js";
import blockquotes from "./transformers/blockquotes.js";
import lazyImages from "./transformers/lazy-images.js";
import relativeToAbsolute from "./transformers/relative-to-absolute.js";

/**
 * Converts markdown to html via a [Unified](https://unifiedjs.com/) pipeline
 *
 * @param {string} content
 * @param {string} [baseURL]
 * @returns {Promise<ConversionResponse>}
 */
async function convert(content, baseURL = "") {
  const { value: html, data } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(frontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // What allows raw html to work
    .use(rehypeHighlight)
    .use(relativeToAbsolute, { baseURL })
    .use(blockquotes)
    .use(lazyImages)
    .use(rehypeMinifyWhitespace)
    .use(rehypeStringify)
    .process(content);

  // @ts-ignore
  return { html: html.toString(), meta: data.meta };
}

/**
 *
 * @param {string} filePath
 * @param {string} [baseURL]
 * @returns {Promise<ProcessResponse>}
 */
export async function getHtml(filePath, baseURL = "") {
  const fileContent = await readFile(filePath, "utf-8");
  const { html, meta } = await convert(fileContent, baseURL);
  return {
    html,
    meta,
    filePath,
  };
}
