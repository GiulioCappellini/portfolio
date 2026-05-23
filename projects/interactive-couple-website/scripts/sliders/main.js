import { configLightbox, configSlider } from "./engineSlider.js";

export function initializeSlider(slider, container) {
    // Ignore slider if it have just 1 image
    if (slider.children.length <= 1) {
        slider.style.left = "0px";

        const buttons = [
            container.querySelector(".container > .prevButton"),
            container.querySelector(".container > .nextButton")
        ];
        buttons.forEach(button => {if (button) {button.style.display = "none"}});

        return;
    };

    // Ellements
    const slideWidth = slider.querySelector(".slide").offsetWidth;
    const prevButton = container.querySelector(".container > .prevButton");
    const nextButton = container.querySelector(".container > .nextButton");

    // Config slider
    configSlider({
        slider,
        prevButton,
        nextButton,
        slideWidth,
        minTime: 0.3
    });
};
