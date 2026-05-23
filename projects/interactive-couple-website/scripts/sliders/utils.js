import { initializeSlider } from "./main.js";
import { configLightbox } from "./engineSlider.js";

export function createSlider(arg) {
    let {
        tittle,
        description,
        image,
        lightboxImage=image,
        text
    } = arg;

    let main = document.querySelector("main");

    let section = document.createElement("section");
    section.id = toCamelCase(tittle);
    
    const h2 = document.createElement("h2");
    h2.classList.add("tittle")
    h2.innerText = tittle; // inputed from the user

    const figure = document.createElement("figure");

    const container = document.createElement("span");
    container.classList.add("container");

    const figcaption = document.createElement("figcaption");
    figcaption.classList.add("description");
    figcaption.innerText = description; // inputed from the user

    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    prevButton.classList.add("prevButton");
    nextButton.classList.add("nextButton");

    const arrow = document.createElement("img");
    arrow.classList.add("arrow");
    arrow.src = "../images_videos/images/forStyle/arrow.png";

    const slider = document.createElement("div");
    slider.classList.add("slider");

    const p = document.createElement("p");
    p.classList.add("text");

    let countImage = 0;
    let slide = "";
    image.forEach(img => {
        if (isVideo(img)) {
            slide = document.createElement("video");
            slide.poster = "../images_videos/images/forStyle/posterForVideos.png";
        } else {slide = document.createElement("img")};
        slide.classList.add("slide");
        slide.src = image[countImage];
        slide.setAttribute("data-full", lightboxImage[countImage]);
        slider.append(slide);

        if (!text[countImage]) {text[countImage] = ""};
        slide.setAttribute("data-text", text[countImage]);
        if (countImage == 0) {p.innerText = text[countImage]};
        countImage++;
    });

    if (document.querySelector(`#${toCamelCase(tittle)}`)) {
        section = document.querySelector(`#${toCamelCase(tittle)}`);
    } else {
        main.append(section);
        section.append(h2);
    };

    section.append(figure);

    figure.append(container);
    figure.append(p);

    container.append(figcaption);
    container.append(prevButton);
    container.append(nextButton);
    container.append(slider);

    prevButton.append(arrow);
    nextButton.append(arrow.cloneNode(true));

    initializeSlider(slider, container);
    createLightbox(container, slider, lightboxImage, text);
};

export function createLightbox(container, slider, midea, text) {
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");

    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const closeButton = document.createElement("button");
    const close = document.createElement("img");
    const downloadButton = document.createElement("a");
    const download = document.createElement("img");

    const arrow = document.createElement("img");
    arrow.classList.add("arrow");
    arrow.src = "../images_videos/images/forStyle/arrow.png";

    prevButton.classList.add("prevButton");
    nextButton.classList.add("nextButton");
    
    closeButton.classList.add("closeButton");

    close.src = "../images_videos/images/forStyle/close.png";

    downloadButton.classList.add("downloadButton");
    downloadButton.setAttribute("download", "");
    downloadButton.href = midea;

    download.src = "../images_videos/images/forStyle/download.png";

    container.append(lightbox);

    lightbox.append(prevButton);
    lightbox.append(nextButton);
    lightbox.append(closeButton);
    lightbox.append(downloadButton);

    prevButton.append(arrow);
    nextButton.append(arrow.cloneNode(true));
    closeButton.append(close);
    downloadButton.append(download);

    configLightbox(container, slider, lightbox, closeButton)
};

export function updateSliderPosition(time, figure, slider, lightbox, allSlides, slideWidth) {
    slider.style.transition = `transform ${time}s ease`;
    slider.style.transform =`translateX(${-slider.index * slideWidth}px)`;

    const p = figure.querySelector(".text");
    p.innerText = allSlides[slider.index + 1].dataset.text;

    if (lightbox) {
        let lightboxImage = lightbox.querySelector(".lightboxImage");
        lightboxImage.remove();

        if (lightboxImage && isVideo(allSlides[slider.index + 1].dataset.full)) {
            lightboxImage = document.createElement("video");
            videoOn(lightboxImage);
        } else if (lightboxImage) {lightboxImage = document.createElement("img")};

        lightbox.append(lightboxImage);
        lightboxImage.classList.add("lightboxImage");

        const downloadButton = lightbox.querySelector(".downloadButton");
        lightboxImage.src = allSlides[slider.index + 1].dataset.full;
        downloadButton.href = lightboxImage.src;
    };
};

export function tpSlider(slider, allSlides, slideWidth) {
    if (slider.index == -1) {
        slider.index = allSlides.length - 3;
    } else if (slider.index >= allSlides.length - 2) {
        slider.index = 0;
    } else {return};

    slider.style.transition = "none";
    slider.style.transform =`translateX(${-slider.index * slideWidth}px)`;
};

export function switchSlide(direction, figure, slider, lightbox, allSlides, time, slideWidth) {
    if (slider.index == -1 || slider.index >= allSlides.length - 2) {return};

    if (direction == "prev") {
        slider.index--;
    } else {slider.index++};

    updateSliderPosition(time, figure, slider, lightbox, allSlides, slideWidth);
};

export function openLightbox(slider, lightbox, index, allSlides, closeButton) {
    let lightboxImage = lightbox.querySelector(".lightboxImage");
    if (lightboxImage) {
        lightboxImage.remove();
    } else {lightboxImage = undefined};

    const slideAtual = allSlides.length > 1 ? allSlides[slider.index + 1] : allSlides[0];
    const arquivo = slideAtual.dataset.full;
    if (isVideo(arquivo)) {
        lightboxImage = document.createElement("video");
        videoOn(lightboxImage);
    } else {lightboxImage = document.createElement("img")};
    
    lightbox.append(lightboxImage);
    lightboxImage.classList.add("lightboxImage");

    const downloadButton = lightbox.querySelector(".downloadButton");

    const withReveal = lightbox.closest(".reveal");
    if (withReveal) {withReveal.classList.remove("reveal", "toReveal")};
    
    document.body.style.overflow = "hidden";

    if (allSlides.length == 1) {
        lightboxImage.src = allSlides[0].dataset.full;

        let buttons = [
            lightbox.querySelector(".lightbox > .prevButton"),
            lightbox.querySelector(".lightbox > .nextButton")
        ];
        buttons.forEach(button => button.style.display = "none");
    } else {lightboxImage.src = allSlides[index + 1].dataset.full};

    downloadButton.href = lightboxImage.src;

    closeButton.addEventListener("click", () => {
        lightbox.classList.remove("active")
        document.body.style.overflow = "";
        downloadButton.href = "";

        withReveal.classList.add("reveal", "toReveal");

        let currentLightboxImage = lightbox.querySelector(".lightboxImage");
        if (currentLightboxImage.tagName == "VIDEO") {videoOff(currentLightboxImage)};
        lightboxImage.remove();
    });
    
    lightbox.classList.add("active");
};

export function scrollReveal() {
    const main = document.querySelector("main");
    const everySection = [...main.children];
    const everything = everySection.flatMap(section => {return [...section.children]});
    const options = {threshold: 0.18};
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                observer.unobserve(entry.target);
            };
        });
    }, options);

    everything.forEach(element => {
        if (!element.closest("aside") && !element.closest(".lightbox")) {
            element.classList.add("toReveal");
            observer.observe(element);
        };
    });
};

function toCamelCase(text) {
    return text.split(" ").map((word, index) => {
        if (index === 0) {return word.toLowerCase()};
        return word[0].toUpperCase() + word.slice(1).toLowerCase()
    }).join("");
};

function isVideo(midea) {
    const formats = ["mp4", "webm", "mov"];
    const format = midea.split('.').pop().toLowerCase();
    return formats.includes(format);
};

function videoOn(video) {
    video.controls = true;
    video.playsInline = true;
    video.playbackRate = 1;
    video.volume = 1;
};

function videoOff(video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
};