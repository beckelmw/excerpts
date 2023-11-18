// @ts-nocheck
import { visit } from "unist-util-visit";

export default ({ baseURL = "" }) => {
  return (ast) => {
    visit(
      ast,
      (x) => x.tagName === "a",
      (node) => {
        if (node.properties.href.startsWith("/")) {
          node.properties.href = `${baseURL}${node.properties.href}`;
        }
        if (node.properties.href.endsWith(".md")) {
          node.properties.href = node.properties.href.replace(/\.md$/, "/");
        }
      }
    );
  };
};
