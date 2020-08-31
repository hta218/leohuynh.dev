---
title: "Set up path aliases trong Node.js + Typescript"
date: "2020-08-26T22:12:03.284Z"
template: "post"
draft: false
slug: "set-up-path-aliases-in-nodejs"
category: "Tutorial"
tags:
  - "alias"
  - "path-aliases"
  - "nodejs"
  - "typescript"
  - "tsconfig"
  - "javascript"
description: "Nếu như có thể định nghĩa alias (hiểu đơn giản là shortcut) cho những module mà chúng ta thường xuyên phải import trong toàn bộ project thì code sẽ đơn giản như thế nào...
"
socialImage: "/media/road.jpg"
headerImage: "/media/road.jpg"
---

Dạo gần đây mình đang code 1 **pet project** sử dụng **nodejs** ở **back-end**, vừa để tự học thêm trong thời gian rảnh vừa khỏi quên kiến thức, thì gặp phải 1 vấn để rất nhức nhối liên quan đến đường dẫn (**path**) mà có thể anh em đã gặp phải nhiều rồi...

```javascript
import { saveUser } from '../../../../../models/User'
import homeController from '../../../../../controllers/home'
```

Code này hẳn đã khiến nhiều anh em đau đầu khi không thể biết được cần phải đi ra, đi vào bao nhiêu **folder** để tìm đúng **file** mong muốn 😭😭, nếu chẳng may cần chuyển chỗ 1 folder thì sẽ phải update lại **path** ở tất cả những file **import** module đó 😤

Nhưng nếu chúng ta có thể định nghĩa **alias** (hiểu đơn giản là **shortcut**) cho những **module** thường xuyên phải **import** trong toàn bộ project thì sao?

Ví dụ như này:

```javascript
import { saveUser } from '@models/User'
import homeController from '@controllers/home'
```

Trong đó:

* `@models` tương đương với module `./src/models/*`
* `@controllers` tương đương với module `./src/controllers/*`

Giải pháp hoàn toàn đơn giản với [module-alias](https://www.npmjs.com/package/module-alias) và config `tsconfig.json`. Anh em làm theo hướng dẫn để set up nhé

## Update tsconfig.json

Mở file **tsconfig.json** lên và thêm vào những config sau vào **compilerOptions** object:

```json
"compilerOptions": {
	// other configs...
	"baseUrl": "./src",
	"paths": {
			"*": [
					"node_modules/*",
					"src/types/*"
			],
			"@controllers/*": [
					"controllers/*"
			],
			"@models/*": [
					"models/*"
			]
	}
}
```

Trong đó `@controllers` hay `@models` chính là **alias** cho module của các bạn (có thể dùng bất cứ **naming convention** nào tùy ý, không cần thiết phải chứa `@` ở đầu, đó chỉ là **prefix** mình dùng để dễ phân biệt thôi)

Bây giờ bạn hoàn toàn có thể sử dụng **alias** đã config trong project rồi, nhưng JS sẽ không **resolve** được module import với lỗi sau

> [Node] Error: Cannot find module '@models/User'

## Cài đặt module-alias package

Module này sẽ giúp **resolve** các **path alias** trong file JS sau khi biên dịch

* Cài đặt:
```bash
npm i --save module-alias # hoặc yarn add module-alias
```

* Config trong **package.json**:
```json
"_moduleAliases": {
		"@models": "dist/models",
		"@controllers": "dist/controllers"
}
```
Lưu ý rằng `dist/` là **folder** chứa code sau khi **build** của các bạn nhé (tùy vào config nó có thể là `dist/`, `build/`...)

* Cuối cùng là register module vào app của anh em
```javascript
import 'module-alias/register';
```
Chỉ cần **import** 1 lần vào file **start** của project thôi nhé (có thể là `index.ts`, `app.ts`, `server.ts`...)

## 🎉🎉🎉 Done

Bây giờ anh em chỉ cần reload **IDE**, **start project** và có thể xài **alias** thoải mái rồi nhé.

![VS Code Recommendation](/media/vscode.png)

**VS Code** support luôn tính năng này bằng cách đọc file **tsconfig.json**, chỉ cần **reload** lại là được.

Chúc anh em thành công!

## Tham khảo

- [https://medium.com/zero-equals-false/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa](https://medium.com/zero-equals-false/how-to-use-module-path-aliases-in-visual-studio-typescript-and-javascript-e7851df8eeaa)
- [https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353](https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353)



