document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('exercise-form');
    const typeSelect = document.getElementById('exercise-type');
    const customInput = document.getElementById('custom-exercise');
    const exerciseList = document.getElementById('exercise-list');
    const suggestionsList = document.getElementById('suggestions-list');
    const ctx = document.getElementById('progress-chart').getContext('2d');

    let exerciseData = JSON.parse(localStorage.getItem('exercises')) || [];
    let progressChart;

    // Show/hide custom input field
    typeSelect.addEventListener('change', () => {
        customInput.style.display = typeSelect.value === 'Custom' ? 'block' : 'none';
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const type = typeSelect.value === 'Custom' ? customInput.value.trim() : typeSelect.value;
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

    // Suggestions system: supports both predefined and custom exercises
    function updateSuggestions(type) {
        suggestionsList.innerHTML = ""; // Clear previous

        const suggestions = {
            Cardio: [
                "Stay hydrated during long runs.",
                "Combine cardio with strength training for balanced fitness."
            ],
            Stretching: [
                "Deep breathing enhances flexibility gains.",
                "Try holding each stretch for 30 seconds."
            ],
            Strength: [
                "Focus on form over weight to avoid injury.",
                "Rest between sets for optimal recovery."
            ],
            Recreational: [
                "Group activities make it more fun!",
                "Track distances for running/cycling."
            ],
            Yoga: [
                "Focus on breath awareness during yoga flows.",
                "Morning yoga helps energize your day."
            ],
            HIIT: [
                "Mix high and low intensity to maximize results.",
                "Ensure proper warm-up and cool-down."
            ],
            Pilates: [
                "Engage your core throughout the workout.",
                "Use controlled movements for better muscle activation."
            ]
        };

        // For predefined types, use stored suggestions
        if (suggestions[type]) {
            suggestions[type].forEach(suggestion => {
                const li = document.createElement("li");
                li.textContent = suggestion;
                suggestionsList.appendChild(li);
            });
        } else {
            // For custom exercises, generate dynamic suggestions
            const customSuggestions = [
                `Great choice with "${type}"! Keep it fun.`,
                `Track your progress with "${type}" to stay motivated.`,
                `Pair "${type}" with stress-relief exercises for balanced wellness.`
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
