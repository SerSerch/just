import AOS from 'aos';

import 'normalize.css';
import 'aos/dist/aos.css';
import './swiper-bundle.min.css';
import './sass/index.scss';

AOS.init({
  // Global settings:
  disable: 'phone', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)


  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 50, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 800, // values from 0 to 3000, with step 50ms
  easing: 'linear', // default easing for AOS animations
  once: true, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'bottom-bottom', // defines which position of the element regarding to window should trigger the animation
});

const Swiper = require('./swiper-bundle.min.js');

function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  } else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos(input, pos) {
  setSelectionRange(input, pos, pos);
}

function clickPhone(e) {
  let element = e.currentTarget;
  let mask = '+7(___)___-____';
  if (!element.value) {
    element.value = mask;
  }
  let numberPhone = element.value.match(/\d/g);
  if (numberPhone && numberPhone.length == 1) {
    setCaretToPos(element, element.value.search("_"));
  }
}

function blurPhone(e) {
  let element = e.currentTarget;
  let numberPhone = element.value.match(/\d/g);
  if (!numberPhone || numberPhone.length <= 1) {
    element.value = '';
  }
}

function inputPhone(e) {
  let element = e.currentTarget;
  let mask = '+_(___)___-____',
    numberPhone = element.value.match(/\d/g);
  if (numberPhone && element.value.length != mask.length) {
    let reg0 = /\(/g,
      reg1 = /\)/g,
      reg2 = /\-/g;
    if (!reg0.test(element.value)) {
      numberPhone.splice(0, 1);
    }
    if (!reg1.test(element.value)) {
      numberPhone.splice(3, 1);
    }
    if (!reg2.test(element.value)) {
      numberPhone.splice(6, 1);
    }
    while (numberPhone.length < 11) {
      numberPhone.push('_');
    }
    let formatPhone = '+' + numberPhone.join('');
    formatPhone = formatPhone.replace(/\+([\d_]+)([\d_]{3})([\d_]{3})([\d_]{4,})$/g, '+$1($2)$3-$4')
    element.value = formatPhone;
  } else if (!numberPhone) {
    element.value = mask;
  }
  setCaretToPos(element, element.value.search("_"));
}

for (let i of document.querySelectorAll('input[type="tel"]')) {
  i.addEventListener("click", clickPhone);
  i.addEventListener("focus", clickPhone);
  i.addEventListener("blur", blurPhone);
  i.addEventListener('input', inputPhone);
}

const swiperClients = new Swiper('#clients', {
  slidesPerView: 'auto',
  spaceBetween: 24,
  navigation: {
    prevEl: '#clients-prev',
    nextEl: '#clients-next',
  },
});

const sendForm = function (e) {
  e.preventDefault();
  const formElement = e.currentTarget;
  const inputsForm = formElement.querySelectorAll('input');
  if (formElement.dataset.ym) {
    ym(+formElement.dataset.ym, 'reachGoal', formElement.dataset.target);
  }
  let formData = new FormData();
  for (let i of inputsForm) {
    let val = i.files ? i.files[0] : i.value;
    if (i.type != 'radio' || i.type == 'radio' && i.checked) {
      formData.append(i.getAttribute('name'), val);
    }
  }
  fetch(formElement.getAttribute('action'), {
    method: 'post',
    body: formData,
  }).then((res) => {
    if (200 <= res.status && res.status < 300){
      return res.text();
    } else {
      throw new Error('Error status: ' + res.status);
    }
  }).then((i) => {
    document.querySelector('#modal-close').checked = false;
    document.querySelector('#complete-modal').checked = true;
  }).catch((err) => {
    document.querySelector('#error-modal').checked = true;
  });
};

for (let i of document.querySelectorAll('form')) {
  i.addEventListener('submit', sendForm);
}