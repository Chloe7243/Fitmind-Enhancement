document.addEventListener("DOMContentLoaded", () => {
    const menuBtn = document.querySelector(".menu-btn");
    const menuBox = document.querySelector("#menu-box");

    menuBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        menuBox.classList.toggle("active");
        menuBtn.classList.toggle("pushed");
    });

    document.addEventListener("click", (event) => {
        if (!menuBox.contains(event.target) && !menuBtn.contains(event.target)) {
            menuBox.classList.remove("active");
            menuBtn.classList.remove("pushed");
        }
    });

    const form = document.getElementById('exercise-form');
    const typeSelect = document.getElementById('exercise-type');
    const customInput = document.getElementById('custom-exercise');
    const exerciseList = document.getElementById('exercise-list');
    const suggestionsList = document.getElementById('suggestions-list');
    const ctx = document.getElementById('progress-chart').getContext('2d');

    let exerciseData = JSON.parse(localStorage.getItem('exercises')) || [];
    let progressChart;

    typeSelect.addEventListener('change', () => {
        customInput.style.display = typeSelect.value === 'Custom' ? 'block' : 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = typeSelect.value === 'Custom' ? customInput.value : typeSelect.value;
        const duration = parseInt(document.getElementById('duration').value);

        if (type && duration > 0) {
            exerciseData.push({ type, duration });
            saveAndRender();
            updateSuggestions(type);
            form.reset();
            customInput.style.display = 'none';
        }
    });

    function saveAndRender() {
        localStorage.setItem('exercises', JSON.stringify(exerciseData));
        renderExerciseLog();
        updateChart();
    }

    function renderExerciseLog() {
        exerciseList.innerHTML = '';
        exerciseData.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${exercise.type} - ${exercise.duration} mins 
                <button onclick="removeExercise(${index})">X</button>`;
            exerciseList.appendChild(li);
        });
    }

    window.removeExercise = (index) => {
        exerciseData.splice(index, 1);
        saveAndRender();
    };

    function updateChart() {
        if (progressChart) progressChart.destroy();

        const labels = exerciseData.map(e => e.type);
        const durations = exerciseData.map(e => e.duration);

        progressChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Duration (mins)',
                    data: durations,
                    backgroundColor: '#00bfa5'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    function updateSuggestions(type) {
        suggestionsList.innerHTML = "";

        const suggestions = {
            Cardio: ["Stay hydrated!", "Mix cardio with strength training for balance."],
            Stretching: ["Stretch daily to improve flexibility.", "Hold each stretch for 30 seconds."],
            Strength: ["Focus on form, not weight.", "Take rest days to recover."],
            Recreational: ["Join a group for fun!", "Track your distance if running."],
            Yoga: ["Focus on your breathing.", "Morning yoga is energizing."],
            HIIT: ["Alternate high and low intensity.", "Don't skip your warm-up."],
            Pilates: ["Engage your core.", "Controlled movements improve results."]
        };

        if (suggestions[type]) {
            suggestions[type].forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
        } else {
            const customSuggestions = [
                `Great choice with "${type}"! Keep it fun.`,
                `Track your progress with "${type}" to stay motivated.`,
                `Pair "${type}" with relaxation exercises for balance.`
            ];
            customSuggestions.forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
        }
    }

    saveAndRender();
});
