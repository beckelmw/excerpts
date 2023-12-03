import { rollup } from "rollup";
import getFilePaths from "./get-files-paths.js";
import { getHtml } from "./get-html.js";
import getDocument from "./get-document.js";
import { writeFile, mkdir, cp } from "fs/promises";
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
    getHtml(path, "https://excerpts.beckelman.net").then((content) => {
      const id = path.replace("./excerpts/", "").replace(/\.md$/, "");
      content.meta = content.meta || {};
      content.meta.id = id;
      return content;
    })
  )
);
const rss = getFeed(feedContent, "excerpts.beckelman.net");
await writeFile("./public/feed.xml", rss, "utf-8");

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

await mkdir("./public/js", { recursive: true });

// Color mode JS
const colorModeBundle = await rollup({
  input: "./src/components/color-mode.js",
});
const { output } = await colorModeBundle.generate({ format: "umd" });
await writeFile("./public/js/color-mode.js", output[0].code, "utf-8");

const hueSelectorBundle = await rollup({
  input: "./src/components/hue-selector.js",
});
const { output: hueSelector } = await hueSelectorBundle.generate({
  format: "umd",
});
await writeFile("./public/js/hue-selector.js", hueSelector[0].code, "utf-8");

// Copy images
await cp("./how/img", "./public/img", { recursive: true });
