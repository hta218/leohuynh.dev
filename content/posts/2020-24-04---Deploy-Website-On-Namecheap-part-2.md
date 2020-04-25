---
title: "Deploy và cấu hình website trên namecheap trong vòng 1 nốt nhạc [Part 2]"
date: "2020-04-25T16:20:03.284Z"
template: "post"
draft: false
slug: "deploy-and-config-website-on-namecheap-part-2"
category: "Tutorials"
tags:
  - "deployment"
  - "domain"
  - "hosting"
  - "dns"
  - "namecheap"
description: "Ở phần trước mình đã hướng dẫn anh em mua và connect domain với hosting, activate SSL Certificate. Phần này mình sẽ hướng dẫn cách đẩy code lên server để website go live nhé 🚀 ..."
socialImage: "https://images.unsplash.com/photo-1579484955380-8859fccd3d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
headerImage: "https://images.unsplash.com/photo-1579484955380-8859fccd3d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80"
---

Ở [phần trước](/posts/depoy-and-config-website-on-name-cheap-part-1) mình đã hướng dẫn anh em mua và connect **domain** với **hosting**,  activate **SSL Certificate**.

Phần này mình sẽ hướng dẫn cách đẩy code lên **server** để website go live nhé 🚀 

## Trên server có những gì 👀?
Để tìm hiểu cấu trúc folder trên server anh em vào **cPanel** (bài trc mình có hướng dẫn cách vào). Mở **File Manager** trong section **Files**

![cpanel file manager](/media/file-manager.png)

Đây chính là cấu trúc thư mục trên server! By default mình sẽ ở **root directory** là `/home/<cpanel-username>`

Folder chúng ta cần quan tâm là `./public_html`, đây là nơi chứa toàn bộ source code (*html*, *css*, *js*) của trang. Mục tiêu chính là đưa toàn bộ file code lên đây.

**File Manager** cho phép upload trực tiếp file lên nhưng k cho upload **folder** 💆. Chính vì vậy mình sử dụng 1 tool đc **namecheap** [recommend](https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/) là [FileZilla](https://filezilla-project.org/).

## Authorize FileZilla

**FileZilla** sẽ kết nối và 🚚 lên **server** thông qua việc truy cập đến server bằng FTP (**File Transfer Protocol**).

Để 1 **middle-man** 👷 có thể giúp chúng ta đưa file lên **server**, nghiễm nhiên cần cấp quyền cho tool đó => cần tạo 1 [**FTP Account**](https://www.namecheap.com/support/knowledgebase/article.aspx/9523/205/how-to-create-an-ftp-account), **FileZilla** sẽ dùng tài khoản này để đưa code lên server cho chúng ta.

Tạo 1 **FTP Account** rất đơn giản:
- Vào **cPanel**, click **FPT Accounts** trong section **Files**.
- Nhập **username**, **password** (chú ý đừng quên nhé 😅).

![FTP Account](/media/ftp.png)

**Note ⚠️:** 1 điểm cần chú ý khi tạo **FTP Account** là anh em cần để `access-directory` cho account này là `root-directory` nhé, không thì account này sẽ k có quyền access vào `./public_html` folder đâu 😅.

## Setup FileZilla
Sau khi đã [download](https://filezilla-project.org/) và cài đặt **FileZilla**, chúng ta sẽ connect đến server bằng **FTP Account** vừa tạo.

[Quick connect](https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/#quickconnect) là cách đơn giản nhất để connect đến server, anh em cần 4 thông tin:
- **Host name**: `ftpes://<host-name>` (đừng quên prefix `ftpes://` nhé!)

![Host name](/media/hostname.png)

*(Host name ở ngay trên __URL__ trong __cPanel__)*.

- **Username**: chính là **FTP Account** anh em vừa tạo, với format: `<ftp-account-name>@<your-domain>`
- **Password**
- **Port**: auto là `21`.

Cung cấp đủ thông tin rồi click **Quickconnect**.
Phải thấy tín hiệu **successful** thì mới đc nhé.

![Connect to server via FileZilla](/media/filezilla.png)

*(Đừng giật mình khi thấy mất __port__ nhé, __FileZilla__ tự xoá đấy 😤)*
## Đẩy code lên server
Phần phức tạp nhất đã xong 🙈 🙉, bây giờ đẩy code lên **server** thôi!

![Close](https://media.giphy.com/media/R2m2NzVxQ3pbG/giphy.gif)

Trong **FileZilla** gồm 2 phần:

- **Local site**: toàn bộ thư mục trong máy, anh em tìm đến folder chứa code của mình (chú ý là phần code đã build nhé) - trong trường hợp này của mình là folder `./public` (có thể là `./build`, `./dist`, `./public` ... tuỳ theo config app)

- **Remote site**: toàn bộ folder trên **server**, anh em tìm đến `./public_html`.

![Close](/media/filezilla2.png)

Chọn tất cả file ở **Local** và kéo sang **Remote** là ... xong  🎉 

Bây giờ chỉ việc mở site của mình ra kiểm tra thành quả rồi fix lỗi typo thôi 😆😆😆

![Done](https://media.giphy.com/media/SfYTJuxdAbsVW/giphy.gif)

## Two Factor Authentication (Optional)

Two Factor Authentication (**2FA**) hay bảo mật 2 lớp (hoàn toàn free từ [namecheap](https://www.namecheap.com/security/2fa-two-factor-authentication/)) là việc thêm 1 lớp bảo mật cho tài khoản **namecheap** (phải qua đc cả 2 lớp mới truy cập đc resource của mình - sẽ k lo lắng nếu chẳng may bị mất account vì lớp bảo mật thứ 2 nằm trên 1 device khác).

Lớp thứ nhất chính là **username/password** lớp thứ 2 có thể chọn 1 trong nhiều cách:
- **U2F (Universal 2nd Factor)**: sử dụng 1 [physical device](https://www.namecheap.com/support/knowledgebase/article.aspx/10102/45/how-can-i-use-the-u2f-method-for-twofactor-authentication) giống như 1 chiếc chìa khoá để bảo mật.
- **TOTP (Time-based One-Time Password)**: sử dụng 1 password ngắn hạn trên 1 device khác thông qua **Authentication app** như: [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en), [Authy](https://authy.com/) ...
- **Text Message Authentication**: thông qua tin nhắn trên điện thoại.

Mình chọn sử dụng **TOTP** thông qua app [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en).

Anh em tải app về điện thoại rồi vào **cPanel** mở **Two Factor Authentication** trong section **Security**, scan **QR Code**, Done!

Mỗi lần đăng nhập **namecheap** sẽ hỏi thêm **TOTP** từ app để bảo an toàn.

## Kết bài

Hi vọng [tutorial](/category/tutorials) này giúp anh em hiểu thêm về server và có thể tự host 1 trang của riêng mình.

Nếu k muốn mua chúng ta hoàn toàn có thể sử dụng các **Free Hosting Service** khác như: **Github Page**, **Heroku**, **Netlify**, **Zeit Now**... (đều có hỗ trợ **build tool** và **config** đầy đủ, chỉ cần **connect** source code là xong).

Anh em có suy nghĩ gì thì để lại dưới phần comment nhé! (**Email** chỉ để generate [Gravatar](https://gravatar.com/) thôi, mình k spam gì đâu 😉).

#### Tham khảo

- [https://www.namecheap.com/resource-center/tutorials/building-your-first-website/](https://www.namecheap.com/resource-center/tutorials/building-your-first-website/)
- [https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/](https://www.namecheap.com/support/knowledgebase/article.aspx/1279/205/how-to-set-up-filezilla/)
- [https://www.namecheap.com/security/2fa-two-factor-authentication/](https://www.namecheap.com/security/2fa-two-factor-authentication/)