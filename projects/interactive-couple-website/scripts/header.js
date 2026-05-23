const userImage = document.querySelector("#userImage");
const isIndex = document.querySelector("#headerOfIndex");

// Set profile name and image
const hisName = "User she or her";
let profileImage = "../images_videos/images/forStyle/genericProfileImage.png";
if (isIndex) {profileImage = "images_videos/images/forStyle/genericProfileImage.png"};
userImage.src = profileImage;
userName.innerHTML = hisName;

// Show or Hide nav::before
function toogleNavLinks() {
    const navLinks = document.querySelector("#navLinks");
    navLinks.classList.toggle("showNavLinks");
    applyAnimation();
};

// Toggle the animate for each bar on the menu
function applyAnimation() {
    const bar1 = document.querySelector("#bar1");
    const bar2 = document.querySelector("#bar2");
    const bar3 = document.querySelector("#bar3");
    const allBars = [bar1, bar2, bar3];

    allBars.forEach(bar => bar.classList.toggle("animate"));
};
