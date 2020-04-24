const ESCAPE = 27

setTimeout(function () {
  const $html = document.body.parentElement
  const $lbCont = document.querySelector(".post__image-lightbox")
  const $lbImg = $lbCont.querySelector("img")

  function openLightbox($img) {
    console.log("open")
    $html.classList.add("prevent-scroll")
    $lbCont.classList.add("show")
    $lbImg.alt = $img.alt
    $lbImg.src = $img.src
    document.addEventListener("keydown", e => {
      if (e.keyCode == ESCAPE) { closeLightbox() }
    })
  }

  function closeLightbox() {
    $html.classList.remove("prevent-scroll")
    $lbImg.removeAttribute("src")
    $lbImg.removeAttribute("alt")
    $lbCont.classList.remove("show")
  }

  $lbCont.addEventListener("click", closeLightbox)

  document.querySelectorAll('img:not([role="presentation"])').forEach($img => {
    console.log($img)
    $img.classList.add('image-lightbox')
    $img.addEventListener("click", () => openLightbox($img))
  })
}, 2000)
