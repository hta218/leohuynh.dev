# Chào

Mình là [__Tuấn Anh__](https://www.facebook.com/hta218)

Đây là bài viết _đầu tiên_ của mình sử dụng Markdown

Đây là mình đang làm việc cùng team ![me with team](https://scontent.fsgn2-4.fna.fbcdn.net/v/t1.0-9/42085292_10155910165683519_7502404419741286400_n.jpg?_nc_cat=109&oh=ade9b74c8b991683f4ef8763b6223eff&oe=5C22041C)

Mình là 1 junior js với based knowlegde về:
* JS
  * Vanila JS
  * [ReactJS](https://reactjs.org)
  * [NodeJS](https://nodejs.org)

- [x] this is a complete item
- [ ] this is an incomplete item
- [x] @mentions, #refs, [links](),
**formatting**, and <del>tags</del>
supported
- [x] list syntax required (any
unordered or ordered list
supported)

Trích dẫn ưa thích của tui: 
> how you do any thing is how you do everything
> 
> how you do any thing is how you do everything

First Header | Second Header
------------ | -------------
Content cell 1 | Content cell 2
Content column 1 | Content column 2

`import * as React from 'react'`

```javascript
const handleUploadFile = (event) => {
  console.log("A file uploaded");
  let file = event.target.files[0]
  const fileReader = new FileReader();

  fileReader.onload = (event) => {
    let { result } = event.target;
    
    result = JSON.parse(result);
    result.dates.map((date, i) => {
      let { activities } = date.sessions[0];
      activities = activities.map((act, j) => {
        act.date = date.date;
        return act;
      });

      data = data.concat(activities);
    });

    displayData(data);
    $(".table-row").click((e) => handleSelectRow(e));
  }

  fileReader.readAsText(file);
}
```