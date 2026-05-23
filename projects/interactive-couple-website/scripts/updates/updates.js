// Set the variavles to acess some the element on the DOM
const itens = document.querySelectorAll("li");

// For each Item in the list
itens.forEach(li => {
    li.addEventListener("click", () => {
        const expandImg = li.querySelector("img");
        const content = li.querySelector(".content");
        
        if (content.style.height == "0px") {
            expandImg.src = "../images_videos/images/forStyle/expandLess.png";
            expandImg.alt = "Expand less";
            content.style.height = content.scrollHeight + "px";
        } else {
            expandImg.src = "../images_videos/images/forStyle/expandMore.png";
            expandImg.alt = "Expand more";
            content.style.height = "0px";
        };
    });
});
