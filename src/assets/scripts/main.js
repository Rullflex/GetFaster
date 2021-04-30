import UIkit from 'uikit'
import { App } from '../../modules/scripts/_core'

document.addEventListener(`DOMContentLoaded`, function () {
  const app = new App()
  app.init()

  // HEADER

  if (window.innerWidth < app.lg) {
    UIkit.sticky(`.header`, {
      top: '100vh',
      animation: 'uk-animation-slide-top'
    })
    UIkit.slider(`.advantages__slider`)
    UIkit.slider(`.reviews__slider`)
  }

  // app.letListClickActive(document.querySelector(`ul.list`))
  // app.videoSpy(`#video .popup__body`, 'fmT2FFVuWDA')
  // app.mapSpy(`#map`, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.681137224115!2d45.91315441602808!3d51.592407112304684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4114c599cd81712b%3A0x2ebcd457d28444b3!2z0YPQuy4g0J_QsNC90YTQuNC70L7QstCwLCA1Mywg0KHQsNGA0LDRgtC-0LIsINCh0LDRgNCw0YLQvtCy0YHQutCw0Y8sIDQxMDAzMw!5e0!3m2!1sru!2sru!4v1618227745566!5m2!1sru!2sru')
})

