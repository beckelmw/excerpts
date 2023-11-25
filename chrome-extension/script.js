(() => {
  const { href } = document.location;
  const title = document.title;
  const today = new Date().toISOString().slice(0, 16).replace(":", "");

  let md = `---
      title: ${title}
      tags:
      date: ${new Date().toISOString()}
      ---`;

  const quote = document.getSelection();
  if (quote) {
    md += "\n";
    md += `> ${quote}`;
  }

  if (href) {
    md += ` — ${href}`;
  }

  const baseURL = `https://github.com/beckelmw/excerpts/new/main/excerpts`;
  const githubUrl = `${baseURL}?filename=${today}.md&value=${encodeURIComponent(
    md
  )}`;

  return githubUrl;
})();
