// @flow strict
import React, { useRef, useEffect } from 'react';
import { withPrefix } from 'gatsby';
import NinjaComments from 'remark-ninja-react';
import secretConfs from '../../../../secrets'
import styles from './Comments.module.scss';
console.log(styles)
const Comments = ({ postSlug }) => {
  const commentsRef = useRef()

  useEffect(() => {
    const intervalId = setInterval(() => {
      const $comments = commentsRef.current
      const $name = $comments.querySelector("input#rn-author-name")
      const $email = $comments.querySelector("input#rn-author-email")
      const $cmtArea = $comments.querySelector("textarea")
      if ($name) {
        $name.placeholder = "Để trống nếu bạn muốn ẩn danh"
        $name.previousElementSibling.textContent = "Tên"
        $email.placeholder = "Để trống nếu bạn muốn ẩn danh"
        $cmtArea.previousElementSibling.textContent = "Bình luận"
        $cmtArea.placeholder = "Lắc não trc nhé :D"

        $comments.querySelectorAll(".rn-comment-item").forEach($item => {
          const $img = $item.querySelector("img")
          if ($img.alt === "Avatar for ") {
            $img.src = withPrefix('/anonymous.jpg')
            $item.querySelector(".rn-author-name").textContent = "Ẩn Danh"
          }
        })

        clearInterval(intervalId)
      }
    }, 300)
  }, [])

  function handleClick(e) {
    e.preventDefault()
    const $comments = commentsRef.current
    const $cmtTextarea = $comments.querySelector("textarea")
    $cmtTextarea.focus()
  }

  return (
    <div ref={commentsRef} className={styles['comments']}>
      <h5 className={styles['comments__questions']}>
        Bạn muốn bình luận? {' '}
        <a onClick={handleClick}>Công khai 😎</a>
        {' '} hoặc {' '}
        <a onClick={handleClick}>Ẩn danh 👻</a>
        {' '} đều đc nhé!
      </h5>
      <NinjaComments
        siteId={secretConfs.ninjaCommentSiteId}
        threadSlug={postSlug}
      />
    </div>
  )
}

export default Comments;
