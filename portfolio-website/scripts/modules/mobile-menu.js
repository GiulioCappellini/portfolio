export function toggleMenuClass() {
    const menuButton = document.querySelector(".nav-hamburger");
    
    if (menuButton) {
        const nav = document.querySelector("nav");
        const classToToggle = ["hide-nav", "show-nav"];

        menuButton.addEventListener("click", () => {
            nav.classList.remove(classToToggle[0]);
            nav.classList.add(classToToggle[1]);
        });

        document.addEventListener("click", (event) => {
            if (nav.classList.contains(classToToggle[1])) {
                const clickedInsideNav = nav.contains(event.target);
                const clickedInsideMenu = menuButton.contains(event.target);
                const clickedLink = event.target.tagName == "A";
                if (!clickedInsideNav && !clickedInsideMenu) {
                    nav.classList.remove(classToToggle[1]);
                    nav.classList.add(classToToggle[0]);
                };
                if (clickedLink) {
                    nav.classList.remove(classToToggle[1]);
                    nav.classList.add(classToToggle[0]);
                };
            };
        });
    };
};