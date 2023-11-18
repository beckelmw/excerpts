import { rollup } from "rollup";
import getFilePaths from "./get-files-paths.js";
import { getHtml } from "./get-html.js";
import getDocument from "./get-document.js";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import getFeed from "./pages/feed.js";
import home from "./pages/home.js";
import notFound from "./pages/not-found.js";

const excerptFilePaths = await getFilePaths("./excerpts/**/*.md");
const excerptContent = await Promise.all(
  excerptFilePaths.map((path) => getHtml(path))
);

const indexHtml = home(excerptContent);
await writeFile("./public/index.html", indexHtml, "utf-8");

const notFoundHtml = notFound();
await writeFile("./public/404.html", notFoundHtml, "utf-8");

// RSS
// The links in the feed need to be absolute
const feedContent = await Promise.all(
  excerptFilePaths.map((path) =>
    getHtml(path, "https://excerpts.beckelman.net")
  )
);
const rss = getFeed(feedContent);
await writeFile("./public/feed.xml", rss.rss2(), "utf-8");

// How I made this site pages
const howFilePaths = await getFilePaths("./how/**/*.md");
const howHtmlFiles = await Promise.all(
  howFilePaths.map((filePath) => getHtml(filePath))
);

for (const { html: content, filePath, meta } of howHtmlFiles) {
  const directory = join(
    process.cwd(),
    "./public",
    filePath.replace("index.md", "").replace(/\.md$/, "")
  );

  await mkdir(directory, { recursive: true });

  const path = join(directory, "index.html");
  await writeFile(path, getDocument(content, meta?.title), "utf-8");
}

// Color mode JS
const bundle = await rollup({
  input: "./src/components/color-mode.js",
});

const { output } = await bundle.generate({ format: "umd" });
await writeFile("./public/js/color-mode.js", output[0].code, "utf-8");
