---
title: "Deploy và cấu hình website trên namecheap trong vòng 1 nốt nhạc [Part 1]"
date: "2020-04-23T16:20:03.284Z"
template: "post"
draft: false
slug: "depoy-and-config-website-on-name-cheap-part-1"
category: "Tutorials"
tags:
  - "deployment"
  - "domain"
  - "hosting"
  - "dns"
  - "namecheap"
description: "Trước giờ mình luôn muốn sở hữu 1 site cá nhân, nhưng vì mình không có thời gian nên đợt này nghỉ việc, ở nhà cách ly mới tìm hiểu để làm đc..."
socialImage: "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
headerImage: "https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80"
---

Trước giờ mình luôn muốn sở hữu 1 site cá nhân, nhưng vì mình ~~lười~~ không có thời gian nên đợt này nghỉ việc, ở nhà cách ly mới tìm hiểu để làm đc.

Bài này mình chỉ hướng dẫn anh em cách config **domain** và **web hosting** mua trên namecheap (nên mặc định anh em đã có source code của riêng mình rồi nhé 🗿)

## Tại sao có tutorial này?

Mặc dù namecheap đã có [hướng dẫn](https://www.namecheap.com/resource-center/tutorials/building-your-first-website/) đầy đủ để build 1 website from scratch nhưng bơi 🏊 trong 1 đống document là k dễ dàng gì.

![Kid swimming](/media/swim.gif)

Nên mình viết tutorial này để chia sẻ lại những gì mình đã làm và tìm hiểu trong **2 ngày** để ~~mình xem lại nhỡ sau này quên~~ giúp anh em có thể tự config site của mình nhanh hơn nhé 😄.

## Để có 1 site hoàn chỉnh cần những gì?

Lúc đầu mình nghĩ chỉ cần mua 1 tên miền (**domain**) rồi đẩy code lên đó là xong. Nhưng k phải thế, 3 thứ cơ bản để chạy 1 website bao gồm: **domain name**, **hosting** và **platform**
- **Domain name** 🔍: là địa chỉ website của mình, vd: *[pondhub.com](http://www.thepondhub.com/)*, *[leohuynh.dev](https://leohuynh.dev)* ... Có thể hiểu đây như là địa chỉ nhà của mình, thay cho địa chỉ ip giúp ng khác dễ dàng tìm kiếm.
- **Hosting** 🏠: là nơi lưu trữ toàn bộ data và thông tin về website.
> -- Web hosting, in the simplest term, is a remote hard drive connected to your computer by (you guessed it) the Internet.

Nếu domain là địa chỉ nhà thì hosting chính là ngôi nhà của mình.
- **Platform** 💻: là những công cụ để build trang web, sản phẩm chính là phần source code của website.

=> cần mua **domain** và **hosting** để có 1 trang hoàn chỉnh.

Mình quyết định mua cả 2 trên namecheap ~~do chưa có nhiều kinh nghiệm~~ cho tiện config và có gì còn dễ hỏi support bên họ 😄.

Anh em lên [https://www.namecheap.com/domains/](https://www.namecheap.com/domains/) (nhớ tạo account trc nhé), search domain, click **Add To Cart** thì namecheap sẽ gợi ý mua cùng **Web Hosting** và **PositiveSSL** (cái này để bảo mật cho site của mình, giải thích rõ hơn [ở dưới](#activate-ssl-certificate)).

![namecheap domain search](/media/namecheap1.png)

Mua trên namecheap khá đơn giản, chỉ cần cung cấp đủ thông tin rồi 💸💸💸 thế là xong.

![namecheap bill](/media/bill.png)

## Connect domain với hosting như thế nào?
Nhà và địa chỉ tất nhiên ở 1 nơi rồi, tại sao phải connect làm gì nữa 👀?

Lí do đơn giản là vì địa chỉ nhà (**Web hosting**) thực chất là 1 dãy số (**IP Address**, vd: **127.0.0.1**) chúng ta đi đến địa chỉ này mới thực sự là truy cập vào website.

=> cần connect **domain name** với **hosting** để có thể đến đúng nơi bằng địa chỉ dễ nhớ.

![name cheap dns](/media/dns.jpg)

Khi mua **domain** và **hosting** cùng ở **namecheap**, việc config này sẽ rất dễ dàng
- Vào **Account / Dashboard / Domain List**, click **Manage** ở domain vừa mua
- Chọn **Namecheap Web Hosting DNS** ở section **Nameservers**
- Click save (dấu ✔️ ở cuối dòng)
- Done

Vậy tại sao truy cập vào ~~**domain name**~~ địa chỉ dễ nhớ hơn chúng ta vẫn đến đc nơi cần đến 👀??

Chính là nhờ DNS (Mình k đi sâu vào khái niệm này)
> -- DNS (domain name system) hiểu đơn giản là ***The Phone Book of the Internet***, bạn hoàn toàn có thể bấm trực tiếp số (IP Address) để gọi cho gấu (hosting) hoặc tìm theo tên (domain) trong danh bạ.

## Activate SSL Certificate
Nếu anh em k mua **PositiveSSL** có thể bỏ qua phần này nhé.

**SSL** (Secure Sockets Layer) là 1 lớp bảo mật cho website, bảo vệ website bằng **HTTPS** với 2 nhiệm vụ chính:
- Đảm bảo data đến và đi từ website luôn đc mã hóa.
- Kiểm duyệt data đến và đi có nội dung chính xác.

![SSL certificate](/media/https.png)

Trang nào có **SSL Certificate** sẽ đc gắn cờ **Secured** trên Web browser, đảm bảo sự tin tưởng khi truy cập.

Mình sẽ hướng dẫn anh em cách đơn giản nhất đó là sử dụng **cPanel** của **namecheap**:

![Go to cPanel](/media/cpanel.png)

- Vào **Account / Dashboard / Domain List**, chọn tab **Products**.
- Click **Go to cPanel**, đăng nhập với tài khoản **namecheap**.
- Trong **cPanel** mở **Namecheap SSL**.
- Click **Activate** PossitiveSSL.

Đợi khoảng 5-10' rồi ấn **sync** để xem đã **activate** thành công chưa nhé (nếu chưa thì anh em đợi thêm rồi **sync** lại cho đến khi status chuyển sang **active** là đc).

![Go to cPanel](/media/cpanel3.png)

## Tạm kết

Đến đây anh em đã hoàn thiện đc 90% website của mình rồi 😮, [phần tiếp theo](/posts/deploy-and-config-website-on-namecheap-part-2) mình sẽ hướng dẫn ~~90%~~ 10% còn lại 😢 bao gồm:
- Tìm hiểu cấu trúc thư mục trên server (**web hosting**).
- Sử dụng [FileZilla](https://filezilla-project.org/) để đẩy code lên server.
- Set up 2FA (**Two Factor Authentication** - hay bảo mật 2 lớp) để tăng bảo mật.

Rất cảm ơn anh em đã kiên nhẫn đọc đến đây 🙏, để lại suy nghĩ cho mình dưới phần bình luận nhé. Thanks you so much!
