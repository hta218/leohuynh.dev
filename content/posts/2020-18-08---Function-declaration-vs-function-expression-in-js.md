---
title: "Javascipt - function declaration vs function expression"
date: "2020-09-16T22:12:03.284Z"
template: "post"
draft: false
slug: "function-declaration-vs-function-expression-in-js"
category: "Javascript"
tags:
  - "javascript"
  - "function"
  - "function-declaration"
  - "function-expression"
  - "anonymous-function"
  - "arrow-function"
  - "es5"
  - "es6"
description: "Phân biệt 2 khái niệm cơ bản trong Javascript - Function Declaration vs Function Expression và các trường hợp sử dụng"
socialImage: "/media/singapore.jpg"
headerImage: "/media/singapore.jpg"
---

Post này chỉ là 1 note nhỏ của mình cho những **dev** hay quên về 2 khái niệm **function declaration** và **function expression** để mỗi lần nhắc đến chỉ việc vào đây xem lại chứ không cần phải **google** nữa 😅😅


![Take note](/media/take-note.gif)

Chắc hẳn anh em ngày ngày làm việc với **javascript** sẽ viết rất nhiều **function** với các cú pháp như:

```javascript

function doSomething() {} // function declaration

// hoặc
const doSomething = function() {} // function expression

// hoặc 
const doSomething = () => {} // function expression

```

Cách viết đầu tiên chính là **function declaration**, và 2 cách sau là **function expression**, vậy chúng khác gì nhau và sử dụng như thế nào?

## Definition

Khác biết đầu tiên chính là cách định nghĩa **function**

* **Function declaraion** được khai báo với từ khóa `function` và **luôn** bao gồm tên của **function** đó

```javascript
function doSomething() {}
```

* **Function expression** được khai báo tương tự như **function declaraion** nhưng được gán vào 1 **biến** và sẽ chạy khi được gọi qua **biến** đó, tên của **function** có thể bỏ đi (**anonymous function**)

```javascript
const doSomething = function() {}

// Anonymous function in ES6 syntax
const doSomething = () => {}
```

## Hoisting
**Hoisting** là 1 cơ chế của **Javascript** thể hiện việc đưa **function** và **variable** lên trên cùng của **scope** trước khi **code** được thực thi.

> **Hoisting** chỉ áp dụng **function declarations**, không áp dụng cho **function expressions**

Có thế hiểu đơn gian qua ví dụ sau:

```js
sayHello() // => "Hello"

function sayHello() {
  console.log("Hello")
}
```

Bạn có thể **call** **function declaration** ở bất cứ đâu trong **scope** nó khởi tạo

Tuy nhiên **function expression** chỉ có thể gọi sau khi định nghĩa

```js
sayHello() // => Uncaught ReferenceError: Cannot access 'sayHello' before initialization

const sayHello = function() {
  console.log("Hello")
}
```

Tùy theo thói quen của **dev** và **rule** của **project** hoặc **team leader** đặt ra mà có thể sử dụng 1 trong 2 cách **define function** này.

Tuy nhiên có 1 số trường hợp đặc biệt để sử dụng **function expression**

## IIFE

[Immediately Invoked Function Expressions](https://mariusschulz.com/blog/use-cases-for-javascripts-iifes) hay 1 **anonymous function** được chạy ngay sau khi khởi tạo

```js
(function() {
    console.log('Code runs!')
})();

// ES6
(() => {
    console.log('Code runs!')
})();
```

## Callback

1 trường hợp sử dụng **function expressions** nữa đó là dùng làm **callback function**

```js
buttonElement.addEventListener('click', function(e) {
    console.log('button is clicked!')
})
```

hoặc

```js
array.map(item => {
  // do stuff to an item
})
```

Đây là trường hợp phổ biến sử dụng **function expression** vì chúng ta không cần biết đến **function** này trong toàn bộ scope

Tóm lại, có thể sử dụng linh hoạt 2 cách **define function** trên, nếu muốn 1 **function** có thể sử dụng linh hoạt nhiều nơi trong **scope** thì sử dụng **function declaration** còn nếu chỉ cần giới hạn trong 1 thời điểm sử dụng thì dùng **function expression**

## Tham khảo

- [Function declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

- [Function expression](https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function)

- [https://www.freecodecamp.org/news/when-to-use-a-function-declarations-vs-a-function-expression-70f15152a0a0/](https://www.freecodecamp.org/news/when-to-use-a-function-declarations-vs-a-function-expression-70f15152a0a0/)

- [https://gomakethings.com/function-expressions-vs-function-declarations/](https://gomakethings.com/function-expressions-vs-function-declarations/)
