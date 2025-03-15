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

    const form = document.querySelector('#stress-form');
    const stressList = document.querySelector('#stress-list');
    const relaxationList = document.querySelector('#relaxation-list');

    let stressData = JSON.parse(localStorage.getItem('stressLogs')) || [];

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const stressLevel = document.querySelector('input[name="stress-level"]:checked');
        if (!stressLevel) {
            alert("Please select a stress level.");
            return;
        }

        const cause = document.querySelector('#stress-cause').value.trim();
        const notes = document.querySelector('#additional-notes').value.trim();
        const entry = {
            date: new Date().toLocaleString(),
            level: stressLevel.value,
            cause: cause || 'No specific cause',
            notes
        };

        stressData.push(entry);
        saveAndRender();
        updateRelaxationSuggestions(parseInt(stressLevel.value));

        form.reset();
    });

    function saveAndRender() {
        localStorage.setItem('stressLogs', JSON.stringify(stressData));
        renderStressLog();
    }

    function renderStressLog() {
        stressList.innerHTML = '';
        stressData.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${entry.date} - Level ${entry.level} - ${entry.cause}
                <button onclick="removeEntry(${index})">X</button>
                <div class="notes">${entry.notes ? "Notes: " + entry.notes : ""}</div>
            `;
            stressList.appendChild(li);
        });
    }

    window.removeEntry = (index) => {
        stressData.splice(index, 1);
        saveAndRender();
    };

    function updateRelaxationSuggestions(level) {
        relaxationList.innerHTML = '';

        const suggestions = {
            1: ["Keep up the great mood! Consider light stretching or a walk."],
            2: ["You’re doing well! A short meditation might enhance your calm."],
            3: ["Consider deep breathing exercises or gentle yoga."],
            4: ["Try guided meditation or journaling to process your stress."],
            5: ["Take a break. Try progressive muscle relaxation or breathing exercises."]
        };

        suggestions[level].forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            relaxationList.appendChild(li);
        });
    }

    saveAndRender();
});
