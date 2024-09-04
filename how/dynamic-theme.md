---
title: Dynamic theme via OKLCH
---

You can change the theme on this site by clicking the eye dropper icon in the navigation menu.

I am using a web component when the browser supports the OKLCH color format to change a CSS custom property representing the hue value. The hue in OKLCH is a value between 0 and 360.

The basic idea can be seen in this demo by using the slider:

<hue-demo></hue-demo>

<script src="/demos/hue-demo.js" type="module"></script>

The actual web component code can be [seen here on github](https://github.com/beckelmw/excerpts/blob/9fe9599cd10b6e91be4b2fd593d166aa40197ca0/src/components/hue-selector.js).

> The `hsl()` color model is not reliable for manipulating and creating color palettes because it can lead to accessibility issues. `oklch()` offers the same intuitive approach as HSL, but provides much more consistency in its output. — https://blog.logrocket.com/oklch-css-consistent-accessible-color-palettes/

## Related links

- [OKLCH in CSS: Consistent, accessible color palettes](https://blog.logrocket.com/oklch-css-consistent-accessible-color-palettes/)
- [OKLCH in CSS: why we moved from RGB and HSL](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)
- [Falling For Oklch: A Love Story Of Color Spaces, Gamuts, And CSS](https://www.smashingmagazine.com/2023/08/oklch-color-spaces-gamuts-css/)
- [It's Time to Learn oklch Color](https://keithjgrant.com/posts/2023/04/its-time-to-learn-oklch-color/)
- [High Definition CSS Color Guide](https://developer.chrome.com/articles/high-definition-css-color-guide/)
- [Better dynamic themes in Tailwind with OKLCH color magic](https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic)
