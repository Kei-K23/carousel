const wrapper = document.querySelector(".slide-wrapper");
const firstSlide = wrapper.querySelectorAll(".slide")[0];
const indicators = document.querySelectorAll("i");
const paginationContainer = document.querySelector(".pagination-container");

let isStartDrag = false,
  isStartDragging = false,
  prevPageX = 0,
  prevScrollLeft = 0,
  positionDifference = 0;

function createPaginationDots() {
  const totalSlides = document.querySelectorAll(".slide").length;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalSlides; i++) {
    const span = document.createElement("span");
    span.classList.add("pagination");
    span.dataset.index = i;
    fragment.appendChild(span);
  }

  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(fragment);
}

createPaginationDots();

function activeIndex() {
  const paginations = Array.from(document.querySelectorAll(".pagination"));
  const slideWidth = firstSlide.clientWidth + 20;
  const activeSlideIndex = Math.ceil(wrapper.scrollLeft / slideWidth);
  paginations.forEach((dot, index) => {
    dot.classList.toggle("active", index === activeSlideIndex);
  });
}

function showHideIcons() {
  const scrollableTotalWidth = wrapper.scrollWidth - wrapper.clientWidth;
  indicators[0].style.display = wrapper.scrollLeft === 0 ? "none" : "block";
  indicators[1].style.display =
    wrapper.scrollLeft === scrollableTotalWidth ? "none" : "block";
}

function moveSlideByPagination(index) {
  const slideWidth = firstSlide.clientWidth + 20;
  wrapper.scrollLeft = slideWidth * index;
  setTimeout(showHideIcons, 600);
  setTimeout(activeIndex, 600);
}

function moveSlideByIndicator(e) {
  const firstImgWidth = firstSlide.clientWidth + 20;
  wrapper.scrollLeft += e.target.id === "rd" ? firstImgWidth : -firstImgWidth;

  setTimeout(showHideIcons, 600);
  setTimeout(activeIndex, 600);
}

indicators.forEach((icon) => {
  icon.addEventListener("click", (e) => moveSlideByIndicator(e));
});

paginationContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("pagination")) {
    const index = parseInt(e.target.dataset.index, 10);
    moveSlideByPagination(index);
  }
});

function autoSlide() {
  if (
    wrapper.scrollLeft - (wrapper.scrollWidth - wrapper.clientWidth) > -1 ||
    wrapper.scrollLeft <= 0
  ) {
    return;
  }

  positionDifference = Math.abs(positionDifference);
  const firstImgWidth = firstSlide.clientWidth + 20;
  const difference = firstImgWidth - positionDifference;

  if (wrapper.scrollLeft > prevScrollLeft) {
    wrapper.scrollLeft +=
      positionDifference > firstImgWidth / 3 ? difference : -positionDifference;
  } else {
    wrapper.scrollLeft -=
      positionDifference > firstImgWidth / 3 ? difference : -positionDifference;
  }
}

function dragStart(e) {
  isStartDrag = true;
  prevPageX = e.pageX;
  prevScrollLeft = wrapper.scrollLeft;
}

function dragging(e) {
  if (!isStartDrag) {
    return;
  }
  isStartDragging = true;
  wrapper.classList.add("dragging");
  positionDifference = e.pageX - prevPageX;
  wrapper.scrollLeft = prevScrollLeft - positionDifference;
  setTimeout(showHideIcons, 600);
  setTimeout(activeIndex, 600);
}

function draggingStop() {
  isStartDrag = false;
  wrapper.classList.remove("dragging");
  if (isStartDrag) return;
  isStartDragging = false;
  autoSlide();
}

activeIndex();

wrapper.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", draggingStop);

wrapper.addEventListener("touchstart", dragStart);
wrapper.addEventListener("touchmove", dragging);
wrapper.addEventListener("touchend", draggingStop);
