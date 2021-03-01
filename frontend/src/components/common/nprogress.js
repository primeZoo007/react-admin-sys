import NProgress from 'nprogress'

import './nprogress.css'

// NProgressStyle.use()
NProgress.configure({
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div><div id="nprogress-mask" class="mask"></div>',
})

let start = NProgress.start
let done = NProgress.done

NProgress.start = () => {
  start.call(NProgress)
  let mask = document.getElementById('nprogress-mask')
  if (mask) {
    mask.onclick = e => {
      if (e && e.stopPropagation) {
        e.stopPropagation()
      }
    }
  }
}
NProgress.done = () => {
  done.call(NProgress)
  let mask = document.getElementById('nprogress-mask')
  if (mask) {
    mask.onclick = null
  }
}

export default NProgress
