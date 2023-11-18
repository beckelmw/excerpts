---
title: Using JSDoc annotations instead of TypeScript
---

When I started this project, I did so via typescript. It's taken years, but I am finally on board with typescript especially in big team projects. For personal projects where I am the only developer I still find it painful to setup and iterate with.

I decided to give typing via JSDocs a try. Remember the [uproar svelte](https://www.youtube.com/watch?v=s234IO3RcZE) caused when they decided to "move away" from typescript? In reality they are using still typescript, just without the compile step.

>There’s also TypeScript the tool. It is perfectly happy to work with regular ole’ JavaScript. It can analyze JavaScript and infer types. It can analyze JavaScript with comments in the form of JSDoc annotations to get types. It can get types from declaration .d.ts files. Or it can do all three at once from different files in the same repository — all to make that information useful to the VSCode user. – https://blog.jim-nielsen.com/2023/the-flavors-of-typescript/


The key is having a tsconfig.json file with `"checkJs": true` or you can add a `@ts-check` to the top of each `.js` file.

If you look at my source code you will notice I went with declaring complex types in a `types.d.ts` file. I then import these in a `types.d.js` file. From that point they are easy to use within my `.js` files.

```typescript
// types.d.ts

export type Meta = {
  tags?: Array<string>;
  title?: string;
  date?: string;
};

export type ConversionResponse = {
  html: string;
  meta?: Meta;
};

export type ProcessResponse = {
  html: string;
  meta?: Meta;
  filePath: string;
};
```

```js
// types.d.js

/**
 * @typedef {import('./types.d.ts').Meta} Meta
 * @typedef {import('./types.d.ts').ConversionResponse} ConversionResponse
 * @typedef {import('./types.d.ts').ProcessResponse} ProcessResponse
 * @typedef {import('feed').Item} FeedItem
 */

```

```typescript
// An example

/**
 * Converts markdown to html via a [Unified](https://unifiedjs.com/) pipeline
 *
 * @param {string} content
 * @param {string} [baseURL]
 * @returns {Promise<ConversionResponse>}
 */
async function convert(content, baseURL = "") {
```


