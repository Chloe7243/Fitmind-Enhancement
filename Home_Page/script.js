document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector("#menu-icon"); // Ensure correct ID
    const menuBox = document.querySelector("#menu-box"); // Ensure correct ID
    const body = document.querySelector("body");

    menuBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents click from closing immediately
        menuBox.classList.toggle("active"); // Toggle menu visibility
        menuBtn.classList.toggle("pushed"); // Add animation effect if needed
        body.classList.toggle("overlay-active"); // Prevent scrolling when menu is open
    });

    document.addEventListener("click", function (event) {
        if (!menuBox.contains(event.target) && !menuBtn.contains(event.target)) {
            menuBox.classList.remove("active");
            menuBtn.classList.remove("pushed");
            body.classList.remove("overlay-active"); // Restore scrolling when menu closes
        }
    });
});


