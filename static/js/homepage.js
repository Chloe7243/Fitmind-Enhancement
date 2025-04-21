document.addEventListener("DOMContentLoaded", function () {
    const menuBtn = document.querySelector("#menu-icon");
    const menuBox = document.querySelector("#menu-box");
    const body = document.querySelector("body");

    menuBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        menuBox.classList.toggle("active");
        menuBtn.classList.toggle("pushed");
        body.classList.toggle("overlay-active");
    });

    document.addEventListener("click", function (event) {
        if (!menuBox.contains(event.target) && !menuBtn.contains(event.target)) {
            menuBox.classList.remove("active");
            menuBtn.classList.remove("pushed");
            body.classList.remove("overlay-active");
        }
    });

    // ✅ 🔔 Flash Message Popup
    const flashPopup = document.getElementById("flash-popup");
    if (flashPopup) {
      flashPopup.style.display = "block";
      setTimeout(() => {
        flashPopup.style.display = "none";
      }, 3000);
    }

    // Real-time Greeting Message
    const greetingEl = document.getElementById("greeting-text");
    function getGreeting() {
        const now = new Date();
        const hour = now.getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    }

    if (greetingEl) {
        greetingEl.textContent = getGreeting();
    }
});
