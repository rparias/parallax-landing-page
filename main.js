import "./style.css";

// IMAGE SLIDER //
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
