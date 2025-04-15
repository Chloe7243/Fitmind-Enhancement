function pageLoaded(flaskData){
    let flaskdata = JSON.parse(flaskData);
    console.log(flaskdata);
    console.log(flaskdata[0]);
    // Sidebar Menu Toggle
    const menuBtn = document.querySelector("#menu-icon");
    const menuBox = document.querySelector("#menu-box");
    const body = document.querySelector("body");

    menuBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents immediate closure when clicking menu icon
        menuBox.classList.toggle("active");
    });

    // Click anywhere outside to close menu
    document.addEventListener("click", function (event) {
        if (!menuBox.contains(event.target) && !menuBtn.contains(event.target)) {
            menuBox.classList.remove("active");
        }
    });
//
//    // Exercise Form Elements
//    const form = document.querySelector("#exercise-form");
        const exerciseTypeSelect = document.querySelector("#exercise-type");
        const customInput = document.querySelector("#custom-exercise");
//    const exerciseList = document.querySelector("#exercise-list");
//    const durationInput = document.querySelector("#duration");
      const ctx = document.querySelector("#progress-chart").getContext("2d");
//    const suggestionsList = document.querySelector("#suggestions-list");
//
      let exerciseData = JSON.parse(flaskData) || [];
      let progressChart;
//
//    // Show custom exercise input field if "Custom" is selected
        exerciseTypeSelect.addEventListener("change", () => {
            customInput.style.display = exerciseTypeSelect.value === "Custom" ? "block" : "none";
        });
//
//    // Form Submission: Log Exercise
//    form.addEventListener("submit", (e) => {
//        e.preventDefault();
//        const type = exerciseTypeSelect.value === "Custom" ? customInput.value.trim() : exerciseTypeSelect.value;
//        const duration = parseInt(durationInput.value);
//
//        if (!type || duration <= 0) {
//            alert("Please enter a valid exercise and duration.");
//            return;
//        }
//
//        exerciseData.push({ type, duration, date: new Date().toLocaleDateString() });
//        saveAndRender();
//        updateSuggestions(type);
//        form.reset();
//        customInput.style.display = "none";
//    });
//
//    // Save & Render Data
//    function saveAndRender() {
//        localStorage.setItem("exercises", JSON.stringify(exerciseData));
//        renderExerciseLog();
//        updateChart();
//    }
//
//    // Render Exercise Log
//    function renderExerciseLog() {
//        exerciseList.innerHTML = "";
//        exerciseData.forEach((exercise, index) => {
//            const li = document.createElement("li");
//            li.innerHTML = `
//                ${exercise.date} - ${exercise.type} - ${exercise.duration} mins
//                <button class="remove-btn" onclick="removeExercise(${index})">🗑️ Delete</button>
//            `;
//            exerciseList.appendChild(li);
//        });
//    }
//
//    // Remove Exercise
//    window.removeExercise = (index) => {
//        exerciseData.splice(index, 1);
//        saveAndRender();
//    };
//
    // Update Chart.js Graph
    function updateChart() {
        if (progressChart) progressChart.destroy();
//        let dateString = "2025-04-01 15:50:52";
//let isoDateString = dateString.replace(" ", "T");
//console.log(isoDateString); // "2025-04-01T15:50:52"
//.replace(" ", "T")
        let data = flaskdata[0];
        const labels = exerciseData.map(data => `${data["time"]} (${data["type"]})`);
        //print(label);
        //const durations = exerciseData.map(e => `${flaskdata[0]["time"].replace(" ", "T")}`);
        const durations = exerciseData.map(data => data["duration"])
        console.log(durations)
        //const durations = exerciseData.map(e => e.time.replace(" ", "T"));



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
    updateChart();


function deleteExerciseEntry(id, button) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(`/exercise/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            const entry = button.closest('.exercise-entry');
            entry.classList.add("removed");
            setTimeout(() => entry.remove(), 300);
        } else {
            alert("Error deleting exercise: " + (result.error || ""));
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong.");
    });
}



//    if (flaskdata[0]["rating"]) {
//    console.log("running here");
//    flaskdata.forEach(suggestion => {
//                const li = document.createElement("li");
//                li.textContent = suggestions[suggestion["rating"]];
//                relaxationList.appendChild(li);
//            });
//        }

};


function deleteExerciseEntry(id, button) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    fetch(`/exercise/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            const entry = button.closest('.exercise-entry');
            entry.classList.add("removed");
            setTimeout(() => entry.remove(), 200);
        } else {
            alert("Error deleting exercise: " + (result.error || ""));
        }
    })
    .catch(err => {
        console.error("Error:", err);
        alert("Something went wrong.");
    });
}
