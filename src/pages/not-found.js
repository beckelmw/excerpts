import getDocument from "../get-document.js";

export default function notFound() {
  const notFoundContent = `<h1 style="margin-bottom: 16px">
404 - The page you requested was not found
</h1>
<h3>Maybe check out some of my <a href="/">latest excerpts</a> instead?</h3>`;
  const notFoundHtml = getDocument(notFoundContent);
  return notFoundHtml;
}
