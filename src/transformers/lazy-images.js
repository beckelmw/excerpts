// @ts-nocheck
import { visit } from "unist-util-visit";
import { h } from "hastscript";

/**
 * This plugin adds a `loading="lazy"` attribute to all
 * images in the document.
 *
 * Instead of just setting the loading attribute
 * on the `node` I am creating a new element where
 * `loading` is the first attribute due to a bug
 * in Firefox where the `loading` attribute is not
 * respected unless it comes before `src`.
 * [Firefox bug](https://bugzil.la/1647077)
 */
export default () => {
  return (ast) => {
    visit(
      ast,
      (x) => x.tagName === "img",
      (node, idx, parent) => {
        let src = node.properties.src;

        // This converts images which work locally for previewing
        // in markdown to absolute paths in HTML
        if (src.startsWith("./")) {
          src = src.replace(/^\.\//, "/");
        }
        parent.children[idx] = h("img", {
          loading: "lazy",
          ...{...node.properties, src},
        });
      }
    );
  };
};
