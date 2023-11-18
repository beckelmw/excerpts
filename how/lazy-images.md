---
title: Adding loading="lazy" to all images
---

This is a rehype plugin for my [unified](https://unifiedjs.com/) pipeline which runs once the [markdown has been converted to HTML](/how/converting-markdown.md). 

```javascript
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
        parent.children[idx] = h("img", {
          loading: "lazy",
          ...node.properties,
        });
      }
    );
  };
};
```

Now all images from my markdown have a `loading="lazy"` attribute.

You can inspect this example:

```html
<img loading="lazy" src="/img/lazy-docs.png" alt="lazy docs">
```

![lazy docs](./img/lazy-docs.png)



