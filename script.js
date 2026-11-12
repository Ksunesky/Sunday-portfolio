// ACADEMIC PLANNER

function addTask() {

    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter an academic task.");
        return;
    }

    const taskList = document.getElementById("taskList");

    const listItem = document.createElement("li");

    const taskName = document.createElement("span");
    taskName.textContent = taskText;

    const buttons = document.createElement("div");
    buttons.className = "task-buttons";

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";

    completeButton.addEventListener("click", function() {
        listItem.classList.toggle("completed");

        completeButton.textContent =
            listItem.classList.contains("completed")
            ? "Undo"
            : "Complete";
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";

    deleteButton.addEventListener("click", function() {
        listItem.remove();
    });

    buttons.appendChild(completeButton);
    buttons.appendChild(deleteButton);

    listItem.appendChild(taskName);
    listItem.appendChild(buttons);

    taskList.appendChild(listItem);

    taskInput.value = "";
}
// CONTACT FORM VALIDATION

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const message = document.getElementById("message").value.trim();

        const response = document.getElementById("formResponse");

        if (name === "" || email === "" || phone === "" || message === "") {
            response.textContent = "Please fill in all fields.";
            response.style.color = "red";
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            response.textContent = "Please enter a valid email address.";
            response.style.color = "red";
            return;
        }

        const phonePattern = /^[0-9]+$/;

        if (!phonePattern.test(phone)) {
            response.textContent = "Phone number must contain digits only.";
            response.style.color = "red";
            return;
        }

        response.textContent = "Your form has been validated successfully!";
        response.style.color = "green";

        contactForm.reset();

    });

}