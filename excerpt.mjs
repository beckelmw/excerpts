import { writeFile } from "fs/promises";
import { join } from "path";
import { execa } from "execa";
import clipboard from "clipboardy";

const today = new Date().toISOString().slice(0, 16).replace(":", "");

function getChromeScriptFor(type) {
  return `tell application "Google Chrome" to return ${type} of active tab of front window`;
}

const { stdout: title } = await execa("osascript", [
  `-e ${getChromeScriptFor("title")}`,
]);

let md = `---
title: ${title}
tags:
date: ${new Date().toISOString()}
---`;

const quote = await clipboard.read();
if (quote) {
  md += "\n";
  md += `> ${quote}`;
}

const { stdout: url } = await execa("osascript", [
  `-e ${getChromeScriptFor("URL")}`,
]);

if (url) {
  md += ` — ${url}`;
}

const filePath = join(
  process.env.HOME,
  `projects/excerpts/excerpts/${today}.md`
);

await writeFile(filePath, md, "utf-8");

await execa("code", [filePath]);
