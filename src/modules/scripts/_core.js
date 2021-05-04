import 'lazysizes'
import UIkit from 'uikit'
import validate from 'validate.js'
  
class App {
    constructor() {
        this.isMobile = {
            Android: () => navigator.userAgent.match(/Android/i),
            BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
            iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
            Opera: () => navigator.userAgent.match(/Opera Mini/i),
            Windows: () => navigator.userAgent.match(/IEMobile/i),
            any: () => (this.isMobile.Android() || this.isMobile.BlackBerry() || this.isMobile.iOS() || this.isMobile.Opera() || this.isMobile.Windows())
        }
        
        this.md = 768
        this.lg = 1230

        this._apiBase = '/api/';  

        this.loaderHtml = `
        <div class="loader-wrap">
            <div class="loader">
                <div></div>
            </div>
            <div class="loader-text">Идет загрузка...</div>
        </div>`
    }


    init() {

        // this.dynamicVideo()
    }



    // plural(number, ['год', 'года', 'лет'])
    plural(number, titles) {
        const cases = [2, 0, 1, 1, 1, 2]
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
    }

    matchMediaListener(breakpoint, callbackLessThan = () => undefined, callbackBiggerThan = () => undefined) {
        const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`)
        function handleBreakpointCross(e) {
            // Check if the media query is true
            if (e.matches) {
                callbackBiggerThan()
            } else {
                callbackLessThan()
            }
        }
        // Register event listener
        mediaQuery.addEventListener('change', handleBreakpointCross)

        // Initial check
        handleBreakpointCross(mediaQuery)
    }

    // возвр. индекс элемента в сете
    getItemIndex(el, set) {
        return [...set].indexOf(el)
    }

    // меняют класс акстивности в сетах
    changeActivitySet(set, index, activeClass = `active`) {
        set.forEach(e => e.classList.remove(activeClass))
        set[index].classList.add(activeClass)
    }
    // 
    changeActivityElement(el, activeClass = `active`) {
        const set = [...el.parentElement.children]
        set.forEach(e => e.classList.remove(activeClass))
        set[this.getItemIndex(el, set)].classList.add(activeClass)
    }

    // все потомки первого уровня для списка будут менять активность по клику
    letListClickActive(listElement, activeClass = `active`) {
        listElement.addEventListener( 'click', ev => {
            const path = ev.path
            if (path[0] !== listElement) {
                const listIndex = path.findIndex(el => el === listElement)
                this.changeActivityElement(path[listIndex - 1], activeClass)
            } 
        })
    }

    // при любом изменении слайда возвращает его индекс в CB функцию
    sliderSpy(slider, callback = (index) => {}) {
        document.querySelectorAll(`${slider} .uk-slider-items > li`).forEach((el, idx) => {
            el.addEventListener(`beforeitemshow`, (event) => {
                const target = event.target
                callback([...target.parentElement.children].indexOf(target))
            })
        })
    }

    // поздагрузка YouTube видео внутрь блока только при его появлении
    videoSpy(videoWrapper, YTid) {
        const $videoWrapper = document.querySelector(videoWrapper)
        UIkit.scrollspy($videoWrapper)
        $videoWrapper.addEventListener(`inview`, (event) => {
            $videoWrapper.insertAdjacentHTML(`beforeend`, this.loaderHtml)
            $videoWrapper.insertAdjacentHTML(`beforeend`, `<iframe class="embed-responsive-item" src="https://www.youtube-nocookie.com/embed/${YTid}" frameborder="0" allowfullscreen="true" data-uk-video data-uk-responsive"></iframe>`)
        })
    }

    // поздагрузка Google карты внутрь блока только при его появлении
    mapSpy(mapWrapper, mapSrc) {
        const $mapWrapper = document.querySelector(mapWrapper)
        UIkit.scrollspy($mapWrapper)
        $mapWrapper.addEventListener(`inview`, (event) => {
            $mapWrapper.insertAdjacentHTML(`beforeend`, this.loaderHtml)
            $mapWrapper.insertAdjacentHTML(`beforeend`, `<iframe src="${mapSrc}" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`)
        })
    }

    dynamicVideo(toggleSelector = '[data-app-video]') {
        document.querySelectorAll(toggleSelector)?.forEach(el => {
            el.addEventListener('click', ev => {
                ev.preventDefault()

                const id = el.getAttribute('href'),
                      hash = el.getAttribute('href').slice(1),
                      ythash = hash.startsWith('_') ? hash.slice(1) : hash
                

                document.querySelector(`.app-wrapper`).insertAdjacentHTML(
                    'beforeend',
                    `<div class="popup-video popup uk-flex-top uk-modal" id="${hash}">
                        <div class="popup__body uk-modal-dialog uk-modal-body uk-margin-auto-vertical embed-responsive embed-responsive-16by9">
                            <button class="popup__close uk-modal-close-default uk-icon uk-close" type="button" data-uk-close="data-uk-close"></button>
                        </div>
                    </div>`
                )
                this.videoSpy(`${id} .popup__body`, ythash)
                 
                UIkit.modal(id)
                setTimeout(() => UIkit.modal(id).show(), 100)
    
                el.addEventListener('click', ev => {
                    ev.preventDefault()
                    UIkit.modal(id).show()
                })
            }, {once: true})
        })
    }

    
    // параллакс на элемент, должен иметь класс и data-parallax-k="10xx"
    mouseMove(mouseMoveItemSelector = '.mouse-parallax') {

        window.addEventListener('mousemove', function(e) {
            let x = e.clientX / window.innerWidth
            let y = e.clientY / window.innerHeight
            document.querySelectorAll(mouseMoveItemSelector).forEach(e => {
                e.style.transform = `translate(${-x * e.getAttribute('data-parallax-k')}px, ${-y * e.getAttribute('data-parallax-k')}px)`
            })
        })
    }

    // маска для телефонов
    PhoneMask(input) {
        if (input) {
            const getInputNumbersValue = (input) => {
                // Return stripped input value — just numbers
                return input.value.replace(/\D/g, '');
            }
        
            const onPhonePaste = (e) => {
                const input = e.target,
                      inputNumbersValue = getInputNumbersValue(input);
                const pasted = e.clipboardData || window.clipboardData;
                if (pasted) {
                    const pastedText = pasted.getData('Text');
                    if (/\D/g.test(pastedText)) {
                        // Attempt to paste non-numeric symbol — remove all non-numeric symbols,
                        // formatting will be in onPhoneInput handler
                        input.value = inputNumbersValue;
                        return;
                    }
                }
            }
        
            const onPhoneInput = function (e) {
                let input = e.target,
                    inputNumbersValue = getInputNumbersValue(input),
                    selectionStart = input.selectionStart,
                    formattedInputValue = "";
        
                if (!inputNumbersValue) {
                    return input.value = "";
                }
        
                if (input.value.length != selectionStart) {
                    // Editing in the middle of input, not last symbol
                    if (e.data && /\D/g.test(e.data)) {
                        // Attempt to input non-numeric symbol
                        input.value = inputNumbersValue;
                    }
                    return;
                }
        
                if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
                    if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
                    const firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
                    formattedInputValue = input.value = firstSymbols + " ";
                    if (inputNumbersValue.length > 1) {
                        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
                    }
                    if (inputNumbersValue.length >= 5) {
                        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
                    }
                    if (inputNumbersValue.length >= 8) {
                        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
                    }
                    if (inputNumbersValue.length >= 10) {
                        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
                    }
                } else {
                    formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
                }
                input.value = formattedInputValue;
            }
            const onPhoneKeyDown = function (e) {
                // Clear input after remove last symbol
                const inputValue = e.target.value.replace(/\D/g, '');
                if (e.keyCode == 8 && inputValue.length == 1) {
                    e.target.value = "";
                }
            }
            input.addEventListener('keydown', onPhoneKeyDown);
            input.addEventListener('input', onPhoneInput, false);
            input.addEventListener('paste', onPhonePaste, false);
        }
        

        this.isComplete = () => {
            const inputNumbersValue = getInputNumbersValue(input);
            if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
                return inputNumbersValue.length === 11 ? true : false;
            } else {
                return inputNumbersValue.length >= 11 ? true : false;
            }
        };
        this.checkCompleteness = (anyFormatNumber) => {
            if (anyFormatNumber) {
                const inputNumbersValue = anyFormatNumber.replace(/\D/g, '');
                if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
                    return inputNumbersValue.length === 11 ? true : false;
                } else {
                    return inputNumbersValue.length >= 11 ? true : false;
                }
            } else {
                return false;
            }
        };
        this.destroy = () => {
            input.removeEventListener('keydown', onPhoneKeyDown);
            input.removeEventListener('input', onPhoneInput, false);
            input.removeEventListener('paste', onPhonePaste, false);
        }
        return this;
    }
}


class Form extends App {
    constructor({
        onSuccess = () => undefined
    } = {}) {
        super()
        this.onSuccess = onSuccess,
        this.selectorMessages = `.messages`
        this.classHasError = `has-error`
        this.classHasSuccess = `has-success`
        this.formInput = `.input-wrap`
        this.disableMessages = true,
        this.removeErrorOnFocus = true,
        this.constraints = {
            email: {
              presence: true,
              email: true
            },
            password: {
              presence: true,
              length: {
                minimum: 5
              }
            },
            "confirm-password": {
              presence: true,
              // it needs to be equal to the other password
              equality: {
                attribute: "password",
                message: "^The passwords does not match"
              }
            },
            "Имя": {
              presence: true,
              length: {
                minimum: 3,
                maximum: 20
              },
              format: {
                // We don't allow anything that a-z and 0-9
                pattern: "[А-яA-z ]+",
                // but we don't care if the username is uppercase or lowercase
                flags: "i",
                message: "Только русские буквы"
              }
            },
            // birthdate: {
            //   // The user needs to give a birthday
            //   presence: true,
            //   // and must be born at least 18 years ago
            //   date: {
            //     latest: moment().subtract(18, "years"),
            //     message: "^You must be at least 18 years old to use this service"
            //   }
            // },
            country: {
              presence: true,
              // And we restrict the countries supported to Sweden
              inclusion: {
                within: ["SE"],
                // The ^ prevents the field name from being prepended to the error
                message: "^Sorry, this service is for Sweden only"
              }
            },
            zip: {
              // Zip is optional but if specified it must be a 5 digit long number
              presence: true,
              format: {
                pattern: "\\d{5}"
              }
            },
            "number-of-children": {
              presence: true,
              numericality: {
                onlyInteger: true,
                greaterThanOrEqualTo: 0
              }
            },
            "Телефон": {
                presence: true,
                isMaskComplete: true
            }
        }
    }

    init(form = `form`) {
        validate.validators.isMaskComplete = (value, options, key, attributes) => {
            if (options) {
                if (this.PhoneMask().checkCompleteness(value)) {
                    return null
                } else {
                    return false
                }
            } else {
                return null
            }
        };


        // Hook up the form so we can prevent it from being posted
        document.querySelectorAll(form).forEach(el => {
            el.addEventListener(`submit`, ev => {
                ev.preventDefault();
                this.handleFormSubmit(el)
            });
        });

        // Hook up the inputs to validate on the fly
        document.querySelectorAll(`${form} input, ${form} textarea, ${form} select`).forEach((el) => {
            el.addEventListener("change", ev => {

                const target = ev.target
                const currentForm = target.closest(form)
                const errors = validate(currentForm, this.formConstraints(currentForm)) || {}
                this.showErrorsForInput(target, errors[target.name])
            });
            if (this.removeErrorOnFocus) {
                el.addEventListener('focus', ev => {
                    ev.target.closest(this.formInput).classList.remove(this.classHasError)
                });
            }
        })

    }


    phoneMask(form) {
        document.querySelectorAll(`${form} input.phone`).forEach((e) => {
            this.PhoneMask(e)
        })
    }

    handleFormSubmit(form, input) {
        // validate the form against the constraints
        
        let errors = validate(form, this.formConstraints(form));
        // then we update the form to reflect the results
        this.showErrors(form, errors || {});
        if (!errors) {
            this.showSuccess(form);
        }
    }

    // Updates the inputs with the validation errors
    showErrors(form, errors) {
        // We loop through all the inputs and show the errors for that input
          // Since the errors can be null if no errors were found we need to handle
          // that
        form.querySelectorAll("input[name], select[name], textarea[name]").forEach(input => this.showErrorsForInput(input, errors && errors[input.name]))
    }

      // Shows the errors for a specific input
    showErrorsForInput(input, errors) {
        // This is the root of the input
        let formGroup = input.closest(this.formInput)
          // Find where the error messages will be insert into
        let messages = null
        if (formGroup != null) {
            if (!this.disableMessages) {
                messages = formGroup.querySelector(this.selectorMessages)
            }
            // First we remove any old messages and resets the classes
            this.resetFormGroup(formGroup);
            // If we have errors
            if (errors) {
              // we first mark the group has having errors
              formGroup.classList.add(this.classHasError);
              // then we append all the errors
              errors.forEach(error => this.addError(error, messages))
            } else {
              // otherwise we simply mark it as success
              formGroup.classList.add(this.classHasSuccess);
            }
        }
    }

    

    resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove(this.classHasError);
        formGroup.classList.remove(this.classHasSuccess);
        // and remove any old messages
        formGroup.querySelectorAll(".help-block.error").forEach(el => el.parentNode.removeChild(el))
    }

      // Adds the specified error with the following markup
      // <p class="help-block error">[message]</p>
    addError(error, messages) {
        const block = document.createElement("p");
        block.classList.add("help-block");
        block.classList.add("error");
        block.innerText = error;
        if (!this.disableMessages && messages != null) {
            messages.appendChild(block);
        }
        
    }

    showSuccess(form) {
        // const formData = new FormData(form)
        this.onSuccess(form)
    }

    formConstraints(form) {
        let localConstraints = {}
        form.querySelectorAll(`input[name], select[name], textarea[name]`).forEach(e => {
            if (this.constraints[e.name] != undefined) {
                localConstraints[e.name] = this.constraints[e.name]
            }
            
        })
        return localConstraints
    }
    
}



export { App, Form }
