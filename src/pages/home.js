import getDocument from "../get-document.js";
import html from "../html.js";

/**
 * Given a list of processed excerpts, this function will
 * create a Feed which can be output as ATOM or RSS2.0
 *
 * @param {ProcessResponse[]} excerptContent
 *
 * @returns {string}
 */

export default function home(excerptContent) {
  const body = excerptContent.map(({ html: content, meta, filePath }) => {
    const id = filePath.replace("./excerpts/", "").replace(/\.md$/, "");

    return html`<article id="${id}">
      ${meta?.title &&
      html`<header>
        <h1>${meta.title}</h1>
      </header>`}
      ${content}
      <footer>
        <ul>
          <li>
            <a href="#${id}">${id.substring(0, 10)}</a>
          </li>
          ${meta?.tags?.map((tag) => html`<li>#${tag}</li>`)}
        </ul>
      </footer>
    </article>`;
  });

  const indexHtml = getDocument(body.join("\n"));
  return indexHtml;
}
