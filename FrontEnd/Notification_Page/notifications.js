/* script.js */
document.addEventListener("DOMContentLoaded", () => {
    const notificationList = document.getElementById("notificationList");
    const reminderText = document.getElementById("reminderText");
    const reminderTime = document.getElementById("reminderTime");
    const addReminder = document.getElementById("addReminder");
    
    function loadReminders() {
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        notificationList.innerHTML = "";
        reminders.forEach(reminder => {
            addNotification(reminder.text, reminder.time);
        });
    }
    
    function addNotification(text, time) {
        const li = document.createElement("li");
        li.textContent = `${text} - Reminder at ${time}`;
        notificationList.appendChild(li);
    }
    
    addReminder.addEventListener("click", () => {
        const text = reminderText.value.trim();
        const time = reminderTime.value;
        if (text === "" || time === "") {
            alert("Please enter a task and time.");
            return;
        }
        
        const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
        reminders.push({ text, time });
        localStorage.setItem("reminders", JSON.stringify(reminders));
        
        addNotification(text, time);
        reminderText.value = "";
        reminderTime.value = "";
    });
    
    loadReminders();
});
