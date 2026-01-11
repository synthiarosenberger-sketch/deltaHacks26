//this is what makes the website interactive, responds to button clicks, talks to backened, updates the task checklist
// script.js - Echo Buddy frontend logic

// ---------------------------
// 1️⃣ Show today's date
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
document.getElementById("date").textContent = today.toLocaleDateString(undefined, options);

// ---------------------------
// 2️⃣ Fetch tasks from backend and display them
async function loadTasks() {
    try {
        // Fetch first user (Option 2)
        const userResponse = await fetch("http://localhost:3000/users");
        const users = await userResponse.json();
        const user = users[0]; // use first user
        const userId = user._id;

        // Fetch tasks from backend
        const taskResponse = await fetch("http://localhost:3000/tasks");
        const tasks = await taskResponse.json();

        const taskList = document.querySelector('.task-list');

        // Create checkbox for each task
        tasks.forEach(task => {
            const li = document.createElement('li');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            const span = document.createElement('span');
            span.textContent = task.title;

            li.appendChild(checkbox);
            li.appendChild(span);
            taskList.appendChild(li);

            // When checkbox is clicked
            checkbox.addEventListener('change', async () => {
                // Update backend completion
                if (checkbox.checked) {
                    await fetch("http://localhost:3000/tasks/complete", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ taskId: task._id, userId })
                    });
                }

                updateBuddyImage();
            });
        });

    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

// ---------------------------
// 3️⃣ Change Globert image when all tasks completed
function updateBuddyImage() {
    const checkboxes = document.querySelectorAll('.task-list input');
    const buddyImage = document.getElementById('buddyImage');

    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    if (allChecked) {
        buddyImage.src = 'assets/cute_globe.jpg'; // happy version
    } else {
        buddyImage.src = 'assets/sad_globert.jpg'; // default/sad
    }
}

// ---------------------------
// Load tasks on page load
loadTasks();
