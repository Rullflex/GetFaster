import UIkit from 'uikit'
import { App, Form } from '../../modules/scripts/_core'

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
    
    if (app.isMobile.iOS()) {
        document.querySelectorAll(`[data-mob-any]`).forEach(el => el.classList.add('d-none'))
    } else {
        document.querySelectorAll(`[data-mob-ios]`).forEach(el => el.classList.add('d-none'))
    }
    
  }

  // MAP
  const formStepStart = new Form({
    form: '.lage-step--start',
    onSuccess: (form) => {
      if (+form.querySelector(`input`).value === 12345) {
        app.changeActivitySet([...form.parentElement.children], 1)
      } else {
        app.changeActivitySet([...form.parentElement.children], 2)
        let input = document.createElement('input')
        input.type = 'hidden'
        input.value = form.querySelector(`input`).value
        input.name = "zip"
        form.parentElement.querySelector('.lage-step--email').append(input)
      }
    }
  })


  const formStepEmail = new Form({
    form: '.lage-step--email',
    onSuccess: (form) => {
      const formData = new FormData(form)

      fetch(`${app._apiBase}mail.php`, {
          method: 'post',
          body: formData,
          mode: 'no-cors'
      }).then(response => {
          // console.log(response)
          return response.text()
      }).then(text => {
          // console.log(text)
      }).catch(error => {
          console.error(error)
      })
    }
  })


  // app.letListClickActive(document.querySelector(`ul.list`))
  // app.videoSpy(`#video .popup__body`, 'fmT2FFVuWDA')
  // app.mapSpy(`#map`, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2478.681137224115!2d45.91315441602808!3d51.592407112304684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4114c599cd81712b%3A0x2ebcd457d28444b3!2z0YPQuy4g0J_QsNC90YTQuNC70L7QstCwLCA1Mywg0KHQsNGA0LDRgtC-0LIsINCh0LDRgNCw0YLQvtCy0YHQutCw0Y8sIDQxMDAzMw!5e0!3m2!1sru!2sru!4v1618227745566!5m2!1sru!2sru')
})

