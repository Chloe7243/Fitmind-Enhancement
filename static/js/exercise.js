// Sidebar Menu Toggle
const menuBtn = document.querySelector("#menu-icon");
const menuBox = document.querySelector("#menu-box");

menuBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    menuBox.classList.toggle("active");
});

document.addEventListener("click", function (event) {
    if (!menuBox.contains(event.target) && !menuBtn.contains(event.target)) {
        menuBox.classList.remove("active");
    }
});

let exerciseData = JSON.parse(sessionStorage.getItem("exerciseData")) || [];

function pageLoaded() {
    const exerciseTypeSelect = document.querySelector("#exercise-type");
    const customInput = document.querySelector("#custom-exercise");
    const ctx = document.querySelector("#progress-chart").getContext("2d");
    const suggestionsList = document.querySelector("#suggestions-list");

    let progressChart;
    let exerciseData = []; // ⏳ Keep all exercises logged in session

    // Toggle custom input
    exerciseTypeSelect.addEventListener("change", () => {
        customInput.style.display = exerciseTypeSelect.value === "Custom" ? "block" : "none";
    });

    function updateChart(data) {
        if (progressChart) progressChart.destroy();
        const labels = data.map(entry => `${entry.time} (${entry.type})`);
        const durations = data.map(entry => parseInt(entry.duration));
        progressChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Duration (mins)",
                    data: durations,
                    backgroundColor: "#00bfa5",
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    function updateRecommendations(data) {
        const suggestions = {
            Cardio: ["Great for heart health!", "Try to reach 30 minutes."],
            Stretching: ["Good for flexibility.", "Stretch after every workout."],
            Strength: ["Builds muscle & boosts metabolism.", "Remember to rest."],
            Yoga: ["Mind + flexibility in balance.", "Try guided yoga sessions."],
            HIIT: ["Great fat burner!", "Alternate HIIT and rest days."],
            Pilates: ["Improves core and posture."],
            Recreational: ["Fun is fitness — enjoy!", "Do it regularly."],
            Custom: ["Great custom session!", "Stay consistent with it."]
        };
        const latest = data[data.length - 1];
        const type = latest.type;
        suggestionsList.innerHTML = "";
        (suggestions[type] || ["Stay active and consistent."]).forEach(msg => {
            const li = document.createElement("li");
            li.textContent = msg;
            suggestionsList.appendChild(li);
        });
    }

    // Handle form submit
    document.addEventListener("DOMContentLoaded", function () {
        const form = document.getElementById("exercise-form");
        const csrfToken = document.querySelector('input[name="csrf_token"]').value;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const type = document.getElementById("exercise-type").value;
            const custom = document.getElementById("custom-exercise").value.trim();
            const duration = document.getElementById("duration").value;
            const finalType = (type === "Custom" && custom) ? custom : type;

            if (!duration || (type === "Custom" && !custom)) {
                alert("Please complete all required fields.");
                return;
            }

            fetch("/exercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify({
                    "Exercise": finalType,
                    "duration": duration
                })
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const entry = data[0];
                    const ul = document.getElementById("exercise-list");

                    const li = document.createElement("li");
                    li.classList.add("exercise-entry");
                    li.innerHTML = `
                        <div class="entry-text">${entry.time} - ${entry.type} (${entry.duration})</div>
                        <button class="remove-btn" onclick="this.parentElement.remove()">🗑️ Delete</button>
                    `;
                    ul.prepend(li); // ✅ Add to the top of the list

                    // ✅ Add new entry to chart and recs
                    exerciseData.push(entry);
                    sessionStorage.setItem("exerciseData", JSON.stringify(exerciseData)); // ✅ Save to session
                    updateChart(exerciseData);
                    updateRecommendations(exerciseData);

                    form.reset();
                    document.querySelector(".exercise-log").scrollIntoView({ behavior: "smooth" });
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Something went wrong.");
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", pageLoaded);
