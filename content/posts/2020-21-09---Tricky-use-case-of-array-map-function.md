---
title: "Tricky use case of Array.prototype.map function"
date: "2020-09-21T22:12:03.284Z"
template: "post"
draft: false
slug: "tricky-use-case-of-array-map-function"
category: "Javascript"
tags:
  - "javascript"
  - "array"
  - "map"
  - "functional-programming"
  - "use-cases"
  - "trick"
description: "hehehe"
socialImage: "/media/gutenberg.jpg"
headerImage: "/media/gutenberg.jpg"
---

If you familiar with [functional programming](https://en.wikipedia.org/wiki/Functional_programming), **Array.prototype.map** must be a **function** that you work with everyday.

For me **map()** is a powerful function, but there might be some tricky use case of it that you not know about!

Let's walk through some basic knowledge

> The **map()** method creates a new array from the calling array by applying a provided **callback function** once for each element of the calling array

## Simple use cases

Giving this array

```js
const devs = [
	{ id: "1", name: "Leo", yob: 1995 },
	{ id: "2", name: "Paul", yob: 1995 },
	{ id: "3", name: "Jesse", yob: 1996 },
	{ id: "4", name: "Ken", yob: 1997 }
];
```

What can we do using **map()** function:

- Getting new values from array

```js
const ages = devs.map(dev => {
	const currentYear = new Date().getFullYear()
	return currentYear - dev.yob
});

console.log(ages); // => [25, 25, 24, 23]
```

- Extracting values from array of objects

```js
const names = devs.map(dev => dev.name);

console.log(names); // => ["Leo", "Paul", "Jesse", "Ken"]
```

- Rendering list in React application

```jsx
import React from "react";

export default DeveloperProfiles = ({ devs }) => {
	return (
		<ul>
			{
				devs.map(dev => <li key={dev.id}>{dev.name}</li>)
			}
		</ul>
	);
}
```

## Tricky use case

It is common to pass the pre-defined **callback** function as **map()** argument like this:

```js
const extractId = (dev) => {
	return dev.id
};

const ids = devs.map(extractId);

console.log(ids); // => ["1", "2", "3", "4"]
```

But this habit may lead to unexpected behaviors with **functions** that take additional **arguments**.

Consider this case - we need to get all **ids** as **numbers**:

```js
// ids = ["1", "2", "3", "4"]
const idsInNumber = ids.map(parseInt);

console.log(idsInNumber); // => ???
```

You might expect the result is `[1, 2, 3, 4]`, but the actual result is `[1, NaN, NaN, NaN]` 😮😮

We encountered this problem at [Cốc Cốc](https://coccoc.com/) recently, it took me a while to figure out and here the answer...

Usually, we use **map()** callback with 1 **argument** (the element being traversed), but **Array.prototype.map** passes 3 arguments:

- the **element**
- the **index**
- the **calling array** (which we don't use most of the time)

And the callback in this case - [parseInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) is often used with 1 **argument** but it takes 2:

```js
// Syntax
parseInt(string [, radix])
```

- `string`: the value to parse
- `radix` **[Optional]**: an integer that represent the **radix** (the base in mathematical numeral systems) - usually, it's **10**

For example:

```js
parseInt("10"); // => 10
parseInt("10", 10); // => 10
parseInt("10", 2); // => 2
parseInt("10", 4); // => 4
```

And here you can see the source of confusion 👀!

The third **argument** of **map()** is ignored by **parseInt** - but ***not*** the second one!

Hence, the **iteration** steps of **map()** look like this:

```js
// map(parseInt) => map(parseInt(value, index))

/* index is 0 */ parseInt("1", 0); // => 1
/* index is 1 */ parseInt("2", 1); // => NaN
/* index is 2 */ parseInt("3", 2); // => NaN
/* index is 3 */ parseInt("4", 3); // => NaN
```

## Solution

As you've known the source of the problem, the solution is just do not pass all the **map()**'s arguments to your **callback** if you not sure how it work

```js
// Be sure to pass only the arguments that your callback needs
["1", "2", "3", "4"].map(numb => parseInt(numb)); // => [1, 2, 3, 4]

// A simpler way to achieve our case like Airbnb style guide
// https://github.com/airbnb/javascript#coercion--numbers
["1", "2", "3", "4"].map(Number); // => [1, 2, 3, 4]
```

And that's all I knew about **Array.prototype.map** function, feel free to share your use case in the comment section 👇

Happy coding!

## References

- [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

- [**parseInt** is a bad guy](https://github.com/denysdovhan/wtfjs#parseint-is-a-bad-guy)

- [A JavaScript Optional Argument Hazard](http://www.wirfs-brock.com/allen/posts/166)

- [https://codesource.io/use-cases-of-array-map-you-should-know](https://codesource.io/use-cases-of-array-map-you-should-know)
