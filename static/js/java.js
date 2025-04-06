function targetTextToConsole(event) {
    //event.target(event);
    //console.log(event);
    event.textContent = 'hi';
    console.log("hi");
}

function tttcAttacher() {
    const event = document.querySelector('#username');
    event.addEventListener('change', targetTextToConsole);
}



//
//    // Generate Personalized Recommendations
//    function updateSuggestions(type) {
//        suggestionsList.innerHTML = "";
//
//        const suggestions = {
//            Cardio: ["Stay hydrated!", "Mix cardio with strength training for balance."],
//            Stretching: ["Stretch daily to improve flexibility.", "Hold each stretch for 30 seconds."],
//            Strength: ["Focus on form, not weight.", "Take rest days to recover."],
//            Recreational: ["Join a group for fun!", "Track your distance if running."],
//            Yoga: ["Focus on your breathing.", "Morning yoga is energizing."],
//            HIIT: ["Alternate high and low intensity.", "Don't skip your warm-up."],
//            Pilates: ["Engage your core.", "Controlled movements improve results."]
//        };
//
//        if (suggestions[type]) {
//            suggestions[type].forEach(suggestion => {
//                const li = document.createElement("li");
//                li.textContent = suggestion;
//                suggestionsList.appendChild(li);
//            });
//        } else {
//            const customSuggestions = [
//                `Great choice with "${type}"! Keep it fun.`,
//                `Track your progress with "${type}" to stay motivated.`,
//                `Pair "${type}" with relaxation exercises for balance.`
//            ];
//            customSuggestions.forEach(suggestion => {
//                const li = document.createElement("li");
//                li.textContent = suggestion;
//                suggestionsList.appendChild(li);
//            });
//        }
//    }
//
//    // Load Existing Data on Page Load
//    saveAndRender();