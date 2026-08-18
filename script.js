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
  // TO-DO LIST
  // =========================

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoCount = document.getElementById("todo-count");
  const todoEmpty = document.getElementById("todo-empty");
  const filterButtons = document.querySelectorAll(".todo-filter");

  // Load saved tasks
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let currentFilter = "all";


  // =========================
  // CREATE
  // =========================

  todoForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (taskText === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    todoInput.value = "";
    todoInput.focus();
  });


  // =========================
  // SAVE TO LOCAL STORAGE
  // =========================

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }


  // =========================
  // READ / DISPLAY
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


      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.id = task.id;
      checkbox.className = "todo-checkbox";


      const span = document.createElement("span");

      span.textContent = task.text;
      span.className = "todo-text";


      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.textContent = "Edit";
      editButton.dataset.id = task.id;
      editButton.className = "todo-edit";


      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.textContent = "Delete";
      deleteButton.dataset.id = task.id;
      deleteButton.className = "todo-delete";


      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editButton);
      li.appendChild(deleteButton);

      todoList.appendChild(li);
    });


    updateCount(filteredTasks.length);

    if (filteredTasks.length === 0) {
      todoEmpty.style.display = "block";
    } else {
      todoEmpty.style.display = "none";
    }
  }


  // =========================
  // UPDATE
  // =========================

  todoList.addEventListener("click", function (event) {

    const id = Number(event.target.dataset.id);

    if (!id) {
      return;
    }


    // Complete / Uncomplete task
    if (event.target.classList.contains("todo-checkbox")) {

      tasks = tasks.map(function (task) {

        if (task.id === id) {
          task.completed = event.target.checked;
        }

        return task;
      });

      saveTasks();
      renderTasks();
    }


    // Edit task
    if (event.target.classList.contains("todo-edit")) {

      const task = tasks.find(function (task) {
        return task.id === id;
      });

      if (!task) {
        return;
      }

      const newText = prompt("Edit your task:", task.text);

      if (newText !== null && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();
        renderTasks();
      }
    }


    // =========================
    // DELETE
    // =========================

    if (event.target.classList.contains("todo-delete")) {

      tasks = tasks.filter(function (task) {
        return task.id !== id;
      });

      saveTasks();
      renderTasks();
    }

  });


  // =========================
  // FILTER
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

  function updateCount(count) {

    if (count === 1) {
      todoCount.textContent = "1 task";
    } else {
      todoCount.textContent = count + " tasks";
    }
  }


  // =========================
  // INITIAL LOAD
  // =========================

  renderTasks();

});
