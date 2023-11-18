---
title: Converting markdown to HTML via Unified, remark, and rehype
---

I am converting the markdown for each excerpt file using [unified](https://unifiedjs.com/) along with some third party and custom plugins.

The neat thing about Unified is you are working with an abstract syntax tree (AST) for your markdown and later your HTML. This allows you to easily find and modify things in your markdown prior to or after conversion to HTML.

For example, in the code below I am using plugins to:
- Pull frontmatter like titles and tags from the markdown for later use
- [Wrap blockquotes with `figure`, `figcaption`, and `cite` elements](/how/blockquotes.md)
- [Add a `loading=lazy` attribute to all images](/how/lazy-images.md)
- Add classes to elements with code blocks in order to provide code syntax highlighting

```javascript
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

/**
 * Converts markdown to html via Unified pipeline
 *
 * @param {string} content
 * @returns {Promise<ConversionResponse>}
 */
async function convert(content) {
  const { value: html, data } = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(frontmatter)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // What allows raw html to work
    .use(rehypeHighlight)
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
 * @returns {Promise<ProcessResponse>}
 */
export async function getHtml(filePath) {
  const fileContent = await readFile(filePath, "utf-8");
  const { html, meta } = await convert(fileContent);
  return {
    html,
    meta,
    filePath,
  };
}
```