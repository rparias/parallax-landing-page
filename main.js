import "./style.css";

// ------------------ IMAGE SLIDER ------------------  //
const slideBtns = document.querySelectorAll("[data-slideBtn]");
const slideContainer = document.querySelector("[data-slideContainer]");
const slides = [...document.querySelectorAll("[data-slide]")];
const slideImages = document.querySelectorAll("[data-slide] img");
const leftButton = slideBtns[0];
const rightButton = slideBtns[1];
let currentIndex = 0;
let isMoving = false;

// functions
function handleSlideBtnClick(e) {
  if (isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;

  slideContainer.dispatchEvent(new Event("sliderMove"));
  slideContainer.dispatchEvent(new Event("transitionEnd"));
}

function removeDisabledAttribute(elements) {
  elements.forEach((el) => el.removeAttribute("disabled"));
}

function addDisabledAttribute(elements) {
  elements.forEach((el) => el.setAttribute("disabled", "true"));
}

// event listeners
slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

slideContainer.addEventListener("sliderMove", () => {
  // 1. translate the container to the right/left
  slideContainer.style.transform = `translateX(-${
    currentIndex * slides[0].clientWidth
  }px)`;
  // 2. remove disabled attributes
  removeDisabledAttribute(slideBtns);
  // 3. renable disabled attribute if needed
  currentIndex === 0 && addDisabledAttribute([leftButton]);
  currentIndex === slides.length - 1 && addDisabledAttribute([rightButton]);
});

slideContainer.addEventListener("transitionEnd", () => (isMoving = false));

// disable image drag events
slideImages.forEach((img) => (img.ondragstart = () => false));

//intersection observer for left button for the slider
const slideObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) addDisabledAttribute([rightButton]);
  },
  { threshold: 0.75 } // % to be considered is intersected in the screen
);

slideObserver.observe(slides[slides.length - 1]);

// ------------------ END IMAGE SLIDER ------------------  //

// ------------------ FORM HANDLE ------------------  //
const contactForm = document.querySelector("#contact-form");
const contactBtn = document.querySelector("#contact-btn");
const contactInput = document.querySelector("#email");

// functions
function postEmailToDatabase(email) {
  console.info(`Your email is ${email}`);
  return new Promise(resolve => setTimeout(resolve, 1000));
}

const contactBtnOptions = {
  pending: `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="animate-spin" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
      Sending...
    </span>
  `,
  success: `
    <span class="uppercase tracking-wide animate-pulse">
      Thank you!
    </span>
    <span class="uppercase tracking-wide animate-pulse">
      ✌️
    </span>
  `
}

async function handleFormSubmit(e) {
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML = contactBtnOptions.pending;
  const userEmail = contactInput.value;
  contactInput.style.display = "none";
  await postEmailToDatabase(userEmail);
  contactBtn.innerHTML = contactBtnOptions.success;
}

// event listeners
contactForm.addEventListener("submit", handleFormSubmit);

// ------------------ END FORM HANDLE ------------------  //
