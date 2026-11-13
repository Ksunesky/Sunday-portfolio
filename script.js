/* =========================================
   1. ACADEMIC PLANNER FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", function() {
    const STORAGE_KEY = "academicTasks";

    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const emptyMessage = document.getElementById("emptyMessage");

    let tasks = loadTasks();

    function loadTasks() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(saved) ? saved : [];
        } catch (error) {
            return [];
        }
    }

    function saveTasks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
            console.error("Could not save tasks:", error);
        }
    }

    function todayString() {
        return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
    }

    function formatDate(str) {
        const [y, m, d] = str.split("-").map(Number);
        return new Date(y, m - 1, d).toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    function renderTasks() {
        if (!taskList) return;
        taskList.innerHTML = "";
        const today = todayString();

        // Unfinished first, then by due date (no date goes last)
        const sorted = [...tasks].sort(function(a, b) {
            if (a.done !== b.done) return a.done ? 1 : -1;
            return (a.dueDate || "9999").localeCompare(b.dueDate || "9999");
        });

        sorted.forEach(function(task) {
            const overdue = !task.done && task.dueDate && task.dueDate < today;

            const listItem = document.createElement("li");
            listItem.className = "task-item";
            if (task.done) listItem.classList.add("completed");
            if (overdue) listItem.classList.add("overdue");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.done;
            checkbox.setAttribute("aria-label", "Mark task complete");
            checkbox.addEventListener("change", function() {
                task.done = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const taskDetails = document.createElement("div");
            taskDetails.className = "task-details";

            const taskName = document.createElement("span");
            taskName.className = "task-name";
            taskName.textContent = task.text;
            taskDetails.appendChild(taskName);

            if (task.dueDate) {
                const taskDateSpan = document.createElement("span");
                taskDateSpan.className = "task-date";
                taskDateSpan.textContent =
                    (overdue ? "Overdue: " : "Due: ") + formatDate(task.dueDate);
                taskDetails.appendChild(taskDateSpan);
            }

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "delete-task";
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.setAttribute("aria-label", "Delete task");
            deleteButton.addEventListener("click", function() {
                tasks = tasks.filter(function(t) { return t.id !== task.id; });
                saveTasks();
                renderTasks();
            });

            listItem.appendChild(checkbox);
            listItem.appendChild(taskDetails);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });

        if (emptyMessage) {
            emptyMessage.style.display = tasks.length === 0 ? "block" : "none";
        }

        updateProgress();
    }

    function updateProgress() {
        const totalEl = document.getElementById("totalTasks");
        if (!totalEl) return;

        const total = tasks.length;
        const completed = tasks.filter(function(t) { return t.done; }).length;
        const remaining = total - completed;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalEl.textContent = total;
        document.getElementById("completedTasks").textContent = completed;
        document.getElementById("remainingTasks").textContent = remaining;
        document.getElementById("progressBar").style.width = `${percentage}%`;
        document.getElementById("progressText").textContent = `${percentage}% completed`;
    }

    if (taskForm) {
        const taskInput = document.getElementById("taskInput");
        const taskDate = document.getElementById("taskDate");

        // Inline error message instead of alert()
        const errorEl = document.createElement("span");
        errorEl.className = "error-message";
        taskInput.parentElement.appendChild(errorEl);

        taskInput.addEventListener("input", function() {
            errorEl.textContent = "";
        });

        taskForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const taskText = taskInput.value.trim();

            if (taskText === "") {
                errorEl.textContent = "Please enter an academic task.";
                taskInput.focus();
                return;
            }
            errorEl.textContent = "";

            tasks.push({
                id: Date.now(),
                text: taskText,
                dueDate: taskDate.value || "",
                done: false
            });

            saveTasks();
            renderTasks();

            taskInput.value = "";
            taskDate.value = "";
            taskInput.focus();
        });

        renderTasks();
    }


    /* =========================================
       2. CONTACT FORM VALIDATION
    ========================================= */

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();

            document.getElementById("nameError").textContent = "";
            document.getElementById("emailError").textContent = "";
            document.getElementById("phoneError").textContent = "";
            document.getElementById("messageError").textContent = "";
            
            const formFeedback = document.getElementById("formFeedback");
            formFeedback.textContent = "";

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            let isValid = true;

            if (name === "") {
                document.getElementById("nameError").textContent = "Please enter your full name.";
                isValid = false;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email === "") {
                document.getElementById("emailError").textContent = "Please enter your email address.";
                isValid = false;
            } else if (!emailPattern.test(email)) {
                document.getElementById("emailError").textContent = "Please enter a valid email address.";
                isValid = false;
            }

            const phonePattern = /^[0-9]+$/;
            if (phone === "") {
                document.getElementById("phoneError").textContent = "Please enter your phone number.";
                isValid = false;
            } else if (!phonePattern.test(phone)) {
                document.getElementById("phoneError").textContent = "Phone number must contain digits only.";
                isValid = false;
            }

            if (message === "") {
                document.getElementById("messageError").textContent = "Please write your message.";
                isValid = false;
            }

            // STOPS execution here if validation fails
            if (!isValid) {
                formFeedback.textContent = "Please fix the errors above before submitting.";
                formFeedback.style.color = "#ff4d4d";
                return;
            }

            formFeedback.textContent = "Your message has been sent successfully!";
            formFeedback.style.color = "#2ecc71";

            contactForm.reset();
        });
    }
});
