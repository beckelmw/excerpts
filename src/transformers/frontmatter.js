// @ts-nocheck
import { visit } from "unist-util-visit";
import { load as yaml } from "js-yaml";

/**
 *
 * @param {string} tags
 * @returns
 */
function getTags(tags) {
  if (!tags) return [];

  return tags.split(",").map((tag) => tag.trim());
}

export default () => {
  function frontmatter(ast, file) {
    file.data.meta = file.data.meta || {};

    visit(
      ast,
      (x) => x.type === "yaml",
      (node) => {
        const meta = { ...yaml(node.value) };
        if (meta.tags) {
          meta.tags = getTags(meta.tags);
        }
        file.data.meta = meta;
      }
    );
  }

  return frontmatter;
};
