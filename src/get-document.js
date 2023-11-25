import html from "./html.js";
import { COLORS } from "./constants.js";

/**
 *
 * @param {string} body
 * @param {string} [title]
 * @returns {string}
 */
export default function document(body, title) {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title || "Excerpts"} | Bill Beckelman</title>
        <link rel="icon" href="/favicon.svg" />
        <meta
          name="description"
          content=${title || "A collection of excerpts by Bill Beckelman"}
        />
        <script src="/js/color-mode.js"></script>
        <style>
          ${getTheme()}
        </style>
        <link rel="stylesheet" href="/style.css" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link
          id="code-theme"
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
        />
      </head>
      <body>
        <nav>
          <a href="/">Bill Beckelman's collection of excerpts</a>

          <a class="icon" title="How I made this site" href="/how/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
          </a>

          <a href="https://github.com/beckelmw/excerpts" class="icon" title="See the code on github">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96" width="24px" height="24px">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                fill="currentColor"
              />
            </svg>
          </a>

          <a class="icon" href="/feed.xml" title="RSS feed">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12.75 19.5v-.75a7.5 7.5 0 00-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </a>

          <color-mode></color-mode>
        </nav>

        <main>${title && html`<h1>${title}</h1>`} ${body}</main>
      </body>
    </html>`;
}

function getTheme() {
  return `
  :root {
    --color-background: ${COLORS.background.light};
    --color-text: ${COLORS.text.light};
    --color-primary: ${COLORS.primary.light};
  }
  
  @media (prefers-color-scheme: dark) {
    :root {
      --color-background: ${COLORS.background.dark};
      --color-text: ${COLORS.text.dark};
      --color-primary: ${COLORS.primary.dark};
    }
  }`;
}
