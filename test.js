// ===========================
// Simple To-Do List Web App
// Features:
// - Add / remove / edit tasks
// - Mark tasks as complete
// - Filter: All / Active / Completed
// - Search tasks
// - Dark / Light theme toggle
// - LocalStorage persistence
// ===========================

// DOM elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ============= FUNCTIONS =============

// Render tasks based on filter + search
function renderTasks() {
  list.innerHTML = "";
  const searchTerm = searchInput.value.toLowerCase();

  let filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active" && task.completed) return false;
    if (currentFilter === "completed" && !task.completed) return false;
    if (!task.text.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task ${task.completed ? "completed" : ""}`;

    // Checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => toggleComplete(index));

    // Task text (editable)
    const span = document.createElement("span");
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener("blur", () => editTask(index, span.textContent));

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => deleteTask(index));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });

  saveTasks();
}

// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;
  tasks.push({ text, completed: false });
  taskInput.value = "";
  renderTasks();
}

// Toggle task completion
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

// Edit task
function editTask(index, newText) {
  tasks[index].text = newText.trim();
  renderTasks();
}

// Delete task
function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Change filter
function setFilter(filter) {
  currentFilter = filter;
  filterBtns.forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`[data-filter="${filter}"]`).classList.add("active");
  renderTasks();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
}

// Load theme on startup
function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

// ============= EVENTS =============
addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

searchInput.addEventListener("input", renderTasks);

themeToggle.addEventListener("click", toggleTheme);

// ============= INIT =============
loadTheme();
renderTasks();
