---
applyTo: '**/*.mdx'
---

## Emoji Usages Instructions

This project use Twitter's emoji set for consistency across the site. Here are the guidelines for using emojis:

- Use the <Twemoji emoji="<emoji_name>" /> component to include emojis.
- No need to import in the \*.mdx files, just use the component directly.
- Not all emojis are available, check the ./css/twemoji.css file for the complete list.
  - The twemoji names are the class names in the CSS file, in the format `twa-<emoji_name>`.
  - The list start from `/* End preamble; begin emoji classes */` line in the CSS file.
- Use emojis to enhance the content, but don't overuse them.
