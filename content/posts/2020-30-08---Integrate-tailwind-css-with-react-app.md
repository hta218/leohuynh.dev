---
title: "Tích hợp Tailwind CSS vào React application"
date: "2020-08-30T22:12:03.284Z"
template: "post"
draft: false
slug: "integrate-tailwind-css-with-react-application"
category: "Tutorial"
tags:
  - "integration"
  - "tailwind-css"
  - "postcss"
  - "react"
description: "Tailwind CSS là 1 low-level CSS framework rất dễ tùy biến, không như các framework khác khi tập trung vào các pre-design components như buttons, cards, modals... có thể giúp bạn phát triển nhanh ban đầu nhưng sau đó sẽ rất mất công để custom các component có sẵn, Tailwind tập trung vào low-level utility classes..."
socialImage: "/media/css.jpg"
headerImage: "/media/css.jpg"
---

[Tailwind CSS](https://tailwindcss.com/) là 1 **low-level** CSS framework rất dễ tùy biến, không như những framework, UI Kits khác khi tập trung vào các **pre-design components** (buttons, cards, modals...) có thể giúp bạn phát triển nhanh ban đầu nhưng sau đó sẽ rất mất công để custom styling cho các component đó. Tailwind tập trung vào low-level utility classes (**utility-first**) giúp bạn tự build hoàn toàn design của mình mà không phải lo lắng về việc **override** các **style** có sẵn.

![Tailwind CSS example](/media/tailwindcss.png)

<small style="padding: 0px 30px">Khá giống với **Bootstrap** nhưng bộ utility class của **Tailwind CSS** phong phú hơn rất nhiều</small>

Bài này mình sẽ hướng dẫn anh em cách để tích hợp Tailwind CSS vào React app nhé  😄 😄

## Tạo react app

Nếu anh em đã có sẵn react app rồi thì có thể chuyển sang bước [tiếp theo](#thêm-dependencies) nhé

Cách đơn giản nhất để tạo react app là sử dụng [creat-react-app](https://create-react-app.dev/docs/getting-started/) script với `npx`

```bash
npx create-react-app my-app && cd my-app
```

Sử dụng `npx` anh em có thể chạy `creat-react-app` script mà không cần phải cài **package** này

## Thêm dependencies

Cài đặt các **dependency** sau để set up **Tailwind CSS**

```bash
yarn add tailwindcss postcss-cli autoprefixer -D
## hoặc npm install tailwindcss postcss-cli autoprefixer --save-dev
```

Ở đây ngoài **Tailwind CSS** chúng ta cài thêm:
 - [PostCSS](https://github.com/postcss/postcss): 1 công cụ để phân tích và chuyển đổi **styling** bằng các **JS plugin**, giúp bạn gợi ý **CSS**, hỗ trợ **variables** và **mixins**, biên dịch các CSS mới...
 - [Autoprefixer](https://github.com/postcss/autoprefixer): 1 plugin của **PostCSS** hỗ trợ việc thêm các [vendor prefix](https://www.lifewire.com/css-vendor-prefixes-3466867)(`-webkit-`, `-moz-`, `-ms-`, `-o-`,...) bằng cách lấy thông tin từ [Can I Use](https://caniuse.com/) để CSS bạn viết có thể tương thích ở nhiều trình duyệt khác nhau

## Config PostCSS




# Headers

# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------
H1
H2
H3
H4
H5
H6
Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
Alt-H2
Emphasis
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
Emphasis, aka italics, with asterisks or underscores.

Strong emphasis, aka bold, with asterisks or underscores.

Combined emphasis with asterisks and underscores.

Strikethrough uses two tildes. Scratch this.

# Lists

(In this example, leading and trailing spaces are shown with with dots: ⋅)

1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses
First ordered list item
Another item
Unordered sub-list.
Actual numbers don't matter, just that it's a number

Ordered sub-list

And another item.

You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

To have a line break without a paragraph, you will need to use two trailing spaces.
Note that this line is separate, but within the same paragraph.
(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

Unordered list can use asterisks
Or minuses
Or pluses
Links
There are two ways to create links.

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com
I'm an inline-style link

I'm an inline-style link with title

I'm a reference-style link

I'm a relative reference to a repository file

You can use numbers for reference-style link definitions

Or leave it empty and use the link text itself.

URLs and URLs in angle brackets will automatically get turned into links. http://www.example.com or http://www.example.com and sometimes example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

# Images
Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"
Here's our logo (hover to see the title text):

Inline-style: alt text

Reference-style: alt text

# Code and Syntax Highlighting
Code blocks are part of the Markdown spec, but syntax highlighting isn't. However, many renderers -- like Github's and Markdown Here -- support syntax highlighting. Which languages are supported and how those language names should be written will vary from renderer to renderer. Markdown Here supports highlighting for dozens of languages (and not-really-languages, like diffs and HTTP headers); to see the complete list, and how to write the language names, see the highlight.js demo page.

Inline `code` has `back-ticks around` it.
Inline code has back-ticks around it.

Blocks of code are either fenced by lines with three back-ticks ```, or are indented with four spaces. I recommend only using the fenced code blocks -- they're easier and only they support syntax highlighting.

```javascript
var s = "JavaScript syntax highlighting";
alert(s);

const url = `/composer/feed/v1/nre?sessionId=${window.logSession}&page=${page}&size=${size}`;
let json;
try {
	json = await(await Promise.race([dropAfter(timeout), fetch(url, fetchOptions)])).json();
	clearTimeout(dropTimeout);
} catch (e) {
	ntp.log('failedFeedFetch', { message: e.message }, false, 'feedAction');
	clearTimeout(dropTimeout);
	return null;
}
if (json && json.items?.news?.length) {
	page++;
}
console.log('feedFetch', json);
return json || null;
```

```python
s = "Python syntax highlighting"
print s
```

```
No language indicated, so no syntax highlighting.
But let's throw in a <b>tag</b>.
```
var s = "JavaScript syntax highlighting";
alert(s);
s = "Python syntax highlighting"
print s
No language indicated, so no syntax highlighting in Markdown Here (varies on Github).
But let's throw in a <b>tag</b>.
Tables
Tables aren't part of the core Markdown spec, but they are part of GFM and Markdown Here supports them. They are an easy way of adding tables to your email -- a task that would otherwise require copy-pasting from another application.

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
Colons can be used to align columns.

# Tables	Are	Cool
col 3 is	right-aligned	$1600
col 2 is	centered	$12
zebra stripes	are neat	$1
There must be at least 3 dashes separating each header cell. The outer pipes (|) are optional, and you don't need to make the raw Markdown line up prettily. You can also use inline Markdown.

Markdown	Less	Pretty
Still	renders	nicely
1	2	3
Blockquotes
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
Blockquotes are very handy in email to emulate reply text. This line is part of the same quote.

Quote break.

This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can put Markdown into a blockquote.

# Inline HTML
You can also use raw HTML in your Markdown, and it'll mostly work pretty well.

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>

  <dt>Markdown in HTML</dt>
  <dd>Does *not* work **very** well. Use HTML <em>tags</em>.</dd>
</dl>
Definition list
Is something people use sometimes.
Markdown in HTML
Does *not* work **very** well. Use HTML tags.
Horizontal Rule
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
Three or more...

Hyphens

Asterisks

Underscores

Line Breaks
My basic recommendation for learning how line breaks work is to experiment and discover -- hit <Enter> once (i.e., insert one newline), then hit it twice (i.e., insert two newlines), see what happens. You'll soon learn to get what you want. "Markdown Toggle" is your friend.

Here are some things to try out:

Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a *separate paragraph*.

This line is also a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the *same paragraph*.
Here's a line for us to start with.

This line is separated from the one above by two newlines, so it will be a separate paragraph.

This line is also begins a separate paragraph, but...
This line is only separated by a single newline, so it's a separate line in the same paragraph.

(Technical note: Markdown Here uses GFM line breaks, so there's no need to use MD's two-space line breaks.)

# YouTube Videos
They can't be added directly but you can add an image with a link to the video like this:

<a href="http://www.youtube.com/watch?feature=player_embedded&v=YOUTUBE_VIDEO_ID_HERE
" target="_blank"><img src="http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg"
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>
Or, in pure Markdown, but losing the image sizing and border:

[![IMAGE ALT TEXT HERE](http://img.youtube.com/vi/YOUTUBE_VIDEO_ID_HERE/0.jpg)](http://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)
Referencing a bug by #bugID in your git commit links it to the slip. For example #1.
