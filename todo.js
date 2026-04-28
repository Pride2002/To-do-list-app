const input = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const list = document.querySelector("#taskList");
const clearBtn = document.querySelector("#clearBtn");
const fetchDataBtn = document.querySelector("#fetchData");
const form = document.querySelector("#form");

form.addEventListener("submit", function (event) {
  event.preventDefault();
});

function updateTaskCount() {
  const count = list.querySelectorAll("li").length;
  document.getElementById("taskCount").textContent = count;
}

addBtn.addEventListener("click", function () {
  const newTask = input.value.trim();
  if (newTask === "") {
    alert("Please enter task");
    return;
  }
  input.value = "";
  createTaskElement(newTask);
  saveTasks();
  updateTaskCount();
});

function saveTasks() {
  const allTasks = [];
  const listItems = list.querySelectorAll("li");
  for (let li of listItems) {
    allTasks.push(li.firstChild.textContent);
  }
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}

loadTasks();

// CLEAR ALL TASKS
clearBtn.addEventListener("click", function () {
  if (confirm("Are you sure you want to clear all tasks?")) {
    list.innerHTML = "";
    updateTaskCount();
    localStorage.clear();
    // localStorage.removeItem("tasks");
  }
});

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  for (let task of savedTasks) {
    createTaskElement(task);
  }
  updateTaskCount();
}

function createTaskElement(taskText) {
  const li = document.createElement("li");
  li.textContent = taskText;
  list.appendChild(li);
  updateTaskCount();

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "editBtn";
  editBtn.innerHTML = '<i class="fas fa-edit"></i>';
  editBtn.id = "editBtn";

  li.appendChild(editBtn);
  editBtn.addEventListener("click", function () {
    const updatedTask = prompt(
      "Enter the updated task",
      li.firstChild.textContent,
    );
    if (updatedTask !== null && updatedTask.trim() !== "") {
      li.firstChild.textContent = updatedTask.trim();
      saveTasks();
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Clear";
  deleteBtn.className = "deleteBtn";
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.id = "deleteBtn";
  li.appendChild(deleteBtn);
  deleteBtn.addEventListener("click", function () {
    // alert("Are you sure you want to delete this task?");
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateTaskCount();
      saveTasks();
    }
  });
}

//fetch tasks from fake API
fetchDataBtn.addEventListener("click", function () {
  fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((todos) => {
      //Add fetched tasks to the UI
      todos.forEach((todo) => {
        createTaskElement(todo.title);
      });
      saveTasks();
      updateTaskCount();
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      alert("Failed to fetch tasks. Please check your connection.");
    });
});
