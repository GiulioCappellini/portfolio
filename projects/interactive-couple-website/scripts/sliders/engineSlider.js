import { updateSliderPosition } from "./utils.js";
import { switchSlide } from "./utils.js";
import { tpSlider } from "./utils.js";
import { openLightbox } from "./utils.js";

export function configSlider(arg) {
    let {
        slider,
        prevButton,
        nextButton,
        slideWidth,
        minTime = 0.3
    } = arg;
    
    // Disable image drag
    document.querySelectorAll("img").forEach(img => img.setAttribute("draggable", "false"));

    // Variables
    slider.index = 0;
    let start = 0;
    let end = 0;
    let current = 0;
    let timeStart = 0;
    let timeEnd = 0;
    let distantX = 0;
    let velocity = 0;
    let speed = 0;
    let isDragging = false;
    let allSlides = slider.querySelectorAll(".slide");

    // Clone System
    const cloneOfFirst = allSlides[0].cloneNode(true);
    const cloneOfLast = allSlides[allSlides.length - 1].cloneNode(true);

    slider.appendChild(cloneOfFirst);
    slider.insertBefore(cloneOfLast, allSlides[0]);

    allSlides = slider.querySelectorAll(".slide");

    function handleMove(event) {
        if (!isDragging) {return};

        current = event.clientX;
        let offset = current - start;
        offset = Math.max(-slideWidth, Math.min(offset, slideWidth));

        slider.style.transform =`translateX(${(-slider.index * slideWidth) + offset}px)`;
    };

    function handleUp(event) {
        if (!isDragging) {return};

        const container = slider.closest(".container");
        const figure = container.closest("figure");

        isDragging = false;
        timeEnd = Date.now();
        end = event.clientX;
        distantX = end - start;
        velocity = timeEnd - timeStart;

        if (distantX === 0) {
            speed = minTime;
        } else {speed = Math.abs(velocity) / Math.abs(distantX)};

        if (speed >= minTime) {speed = minTime};

        if (distantX > 50) {
            slider.index--;
        } else if (distantX < -50) {slider.index++};

        const isClone = slider.index == -1 || slider.index >= allSlides.length - 2;

        const exceededLimit = Math.abs(distantX) >= slideWidth;

        if (isClone && exceededLimit) {
            tpSlider(slider, allSlides, slideWidth);
        } else {updateSliderPosition(speed, figure, slider, lightbox, allSlides, slideWidth)};

        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
    };

    // Events
    slider.addEventListener("transitionend", () => tpSlider(slider, allSlides, slideWidth));

    slider.addEventListener("pointerdown", (event) => {
        if (slider.index == -1 || slider.index >= allSlides.length - 2) {return};

        isDragging = true;
        timeStart = Date.now();
        start = event.clientX;
        slider.style.transition = "none";
        window.addEventListener("pointermove", handleMove);
        window.addEventListener("pointerup", handleUp);
    });

    let lightbox = "";
    const container = slider.closest(".container");
    let figure = container.closest("figure");
    if (prevButton) {prevButton.addEventListener("click", () => switchSlide("prev", figure, slider, lightbox, allSlides, minTime, slideWidth))};
    if (nextButton) {nextButton.addEventListener("click", () => switchSlide("next", figure, slider, lightbox, allSlides, minTime, slideWidth))};
};

export function configLightbox(container, slider, lightbox, closeButton) {
    const allSlides = slider.querySelectorAll(".slide");
    const slideWidth = slider.querySelector(".slide").offsetWidth;
    const figure = container.closest("figure");

    let start;
    let end;
    let distantX;
    const minTime = 0.3;

    const prevButtonLightbox = container.querySelector(".lightbox > .prevButton");
    const nextButtonLightbox = container.querySelector(".lightbox > .nextButton");

    if (prevButtonLightbox) {prevButtonLightbox.addEventListener("click", () => {
        lightbox = container.querySelector(".lightbox");
        switchSlide("prev", figure, slider, lightbox, allSlides, minTime, slideWidth);
    })};
    if (nextButtonLightbox) {nextButtonLightbox.addEventListener("click", () => {
        lightbox = container.querySelector(".lightbox");
        switchSlide("next", figure, slider, lightbox, allSlides, minTime, slideWidth)
    })};

    slider.addEventListener("pointerdown", (event) => start = event.clientX);
    slider.addEventListener("pointerup", (event) => {
        end = event.clientX;
        distantX = end - start;
        if (Math.abs(distantX) < 6) {
            openLightbox(slider, lightbox, slider.index, allSlides, closeButton);
        };
    });
};