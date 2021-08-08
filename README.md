#  This is the legacy version of my bog [https://leo-blog-legacy.vercel.app/](https://leo-blog-legacy.vercel.app/)

## First thing first
I don't create this from scratch, this blog built with [Gatsby](https://www.gatsbyjs.org/), using [Gatsby Starter Lumen](https://github.com/alxshelepenok/gatsby-starter-lumen). I've added many things to personalize it.

A huge thanks to [Alexander Shelepenok
](https://github.com/alxshelepenok) for the minimal, lightweight and super easy-to-customize blog starter.

If you wish to use the original version, you can take a look [here](https://lumen.netlify.com)

Or else if you love my customization - feel free to use this!

## Quick Start

#### Create a Gatsby site

Use the Gatsby CLI to create a new site

```sh
# Create a new Gatsby site
git clone https://github.com/hta218/leo-blog.git blog
```

#### Start Developing

Navigate into your new site’s directory and start it up.

```sh
cd blog
gatsby develop
```

#### Open the source code and start editing!

Your site is now running at `http://localhost:8000`!

Note: You'll also see a second link: `http://localhost:8000/___graphql`. This is a tool you can use to experiment with querying your data. Learn more about using this tool in the [Gatsby tutorial](https://www.gatsbyjs.org/tutorial/part-five/#introducing-graphiql).

Open the `blog` directory in your code editor of choice and edit `src/templates/index-template.js`. Save your changes and the browser will update in real time!

## Folder Structure

```
└── content
    ├── pages
    └── posts
└── static
    ├── admin
    └── media
└── src
    ├── assets
    │   └── fonts
    │   └── scss
    │       ├── base
    │       └── mixins
    ├── cms
    │   └── preview-templates
    ├── components
    │   ├── Feed
    │   ├── Icon
    │   ├── Layout
    │   ├── Page
    │   ├── Pagination
    │   ├── Post
    │   │   ├── Author
    │   │   ├── Comments
    │   │   ├── Content
    │   │   ├── Meta
    │   │   └── Tags
    │   └── Sidebar
    │       ├── Author
    │       ├── Contacts
    │       ├── Copyright
    │       └── Menu
    ├── constants
    ├── templates
    └── utils

```

## License
The MIT License (MIT)

Copyright (c) 2020 Tuan Anh Huynh - alrights reserved.
