document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // LIGHT / DARK MODE
  // =========================

  const themeButton = document.getElementById("theme-toggle");

  if (themeButton) {
    themeButton.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");

      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }
    });

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }


  // =========================
  // TO-DO LIST CRUD
  // =========================

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoCount = document.getElementById("todo-count");
  const todoEmpty = document.getElementById("todo-empty");
  const filterButtons = document.querySelectorAll(".todo-filter");

  // If this page doesn't contain the To-Do list, stop here.
  if (!todoForm || !todoInput || !todoList) {
    return;
  }

  let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
  let currentFilter = "all";


  // =========================
  // SAVE TASKS
  // =========================

  function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
  }


  // =========================
  // READ / DISPLAY TASKS
  // =========================

  function renderTasks() {

    todoList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
      filteredTasks = tasks.filter(function (task) {
        return !task.completed;
      });
    }

    if (currentFilter === "completed") {
      filteredTasks = tasks.filter(function (task) {
        return task.completed;
      });
    }


    filteredTasks.forEach(function (task) {

      const li = document.createElement("li");
      li.className = "todo-item";

      if (task.completed) {
        li.classList.add("completed");
      }

      li.innerHTML = `
        <label class="todo-task">
          <input
            type="checkbox"
            class="todo-checkbox"
            data-id="${task.id}"
            ${task.completed ? "checked" : ""}
          >

          <span>${escapeHTML(task.text)}</span>
        </label>

        <div class="todo-actions">
          <button
            type="button"
            class="todo-edit"
            data-id="${task.id}">
            Edit
          </button>

          <button
            type="button"
            class="todo-delete"
            data-id="${task.id}">
            Delete
          </button>
        </div>
      `;

      todoList.appendChild(li);
    });


    updateCount();

    if (filteredTasks.length === 0) {
      todoEmpty.hidden = false;
    } else {
      todoEmpty.hidden = true;
    }
  }


  // =========================
  // CREATE TASK
  // =========================

  todoForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const text = todoInput.value.trim();

    if (text === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: text,
      completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    todoInput.value = "";
    todoInput.focus();
  });


  // =========================
  // UPDATE + DELETE TASK
  // =========================

  todoList.addEventListener("click", function (event) {

    const id = Number(event.target.dataset.id);

    // DELETE
    if (event.target.classList.contains("todo-delete")) {

      tasks = tasks.filter(function (task) {
        return task.id !== id;
      });

      saveTasks();
      renderTasks();
    }


    // EDIT
    if (event.target.classList.contains("todo-edit")) {

      const task = tasks.find(function (task) {
        return task.id === id;
      });

      if (!task) {
        return;
      }

      const updatedText = prompt("Edit your task:", task.text);

      if (updatedText === null) {
        return;
      }

      const cleanText = updatedText.trim();

      if (cleanText === "") {
        return;
      }

      task.text = cleanText;

      saveTasks();
      renderTasks();
    }
  });


  // =========================
  // COMPLETE TASK
  // =========================

  todoList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("todo-checkbox")) {
      return;
    }

    const id = Number(event.target.dataset.id);

    const task = tasks.find(function (task) {
      return task.id === id;
    });

    if (!task) {
      return;
    }

    task.completed = event.target.checked;

    saveTasks();
    renderTasks();
  });


  // =========================
  // FILTER TASKS
  // =========================

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      currentFilter = button.dataset.filter;

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      renderTasks();
    });
  });


  // =========================
  // TASK COUNT
  // =========================

  function updateCount() {

    const activeTasks = tasks.filter(function (task) {
      return !task.completed;
    });

    const count = activeTasks.length;

    if (todoCount) {
      todoCount.textContent =
        count + (count === 1 ? " task" : " tasks") + " remaining";
    }
  }


  // =========================
  // SECURITY
  // =========================

  function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
  }


  // Show saved tasks when page opens
  renderTasks();

});
