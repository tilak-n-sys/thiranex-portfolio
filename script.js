document.addEventListener("DOMContentLoaded", function () {

  // =====================================================
  // LIGHT / DARK MODE
  // =====================================================

  const themeButton = document.getElementById("theme-toggle");

  if (themeButton) {

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }

    // Change theme
    themeButton.addEventListener("click", function () {

      document.body.classList.toggle("light-mode");

      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }

    });
  }


  // =====================================================
  // TO-DO LIST
  // =====================================================

  const todoForm = document.getElementById("todo-form");
  const todoInput = document.getElementById("todo-input");
  const todoList = document.getElementById("todo-list");
  const todoCount = document.getElementById("todo-count");
  const todoEmpty = document.getElementById("todo-empty");
  const filterButtons = document.querySelectorAll(".todo-filter");


  // If this page does not contain the To-Do List,
  // stop here. This allows script.js to work on
  // index.html, about.html and contact.html too.

  if (
    !todoForm ||
    !todoInput ||
    !todoList ||
    !todoCount ||
    !todoEmpty
  ) {
    return;
  }


  // =====================================================
  // LOAD TASKS FROM LOCAL STORAGE
  // =====================================================

  let tasks = [];

  try {
    tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  } catch (error) {
    tasks = [];
  }


  let currentFilter = "all";


  // =====================================================
  // CREATE TASK
  // =====================================================

  todoForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskText = todoInput.value.trim();

    // Do nothing if input is empty
    if (taskText === "") {
      todoInput.focus();
      return;
    }


    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };


    // Add task to array
    tasks.push(newTask);

    // Save task
    saveTasks();

    // Display task
    renderTasks();

    // Clear input
    todoInput.value = "";

    // Put cursor back in input
    todoInput.focus();

  });


  // =====================================================
  // SAVE TASKS
  // =====================================================

  function saveTasks() {

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

  }


  // =====================================================
  // DISPLAY TASKS
  // =====================================================

  function renderTasks() {

    // Clear current list
    todoList.innerHTML = "";


    // Filter tasks
    let filteredTasks = tasks;


    if (currentFilter === "active") {

      filteredTasks = tasks.filter(function (task) {
        return task.completed === false;
      });

    }


    if (currentFilter === "completed") {

      filteredTasks = tasks.filter(function (task) {
        return task.completed === true;
      });

    }


    // Create HTML for each task
    filteredTasks.forEach(function (task) {

      const li = document.createElement("li");

      li.className = "todo-item";


      // Add completed class
      if (task.completed) {
        li.classList.add("completed");
      }


      // Checkbox
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.checked = task.completed;
      checkbox.dataset.id = task.id;
      checkbox.setAttribute(
        "aria-label",
        "Mark task as completed"
      );


      // Task text
      const span = document.createElement("span");

      span.className = "todo-text";
      span.textContent = task.text;


      // Edit button
      const editButton = document.createElement("button");

      editButton.type = "button";
      editButton.className = "todo-edit";
      editButton.textContent = "Edit";
      editButton.dataset.id = task.id;


      // Delete button
      const deleteButton = document.createElement("button");

      deleteButton.type = "button";
      deleteButton.className = "todo-delete";
      deleteButton.textContent = "Delete";
      deleteButton.dataset.id = task.id;


      // Put everything inside li
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(editButton);
      li.appendChild(deleteButton);


      // Put li inside list
      todoList.appendChild(li);

    });


    // Update count
    updateCount(filteredTasks.length);


    // Empty message
    if (filteredTasks.length === 0) {

      todoEmpty.style.display = "block";

    } else {

      todoEmpty.style.display = "none";

    }

  }


  // =====================================================
  // UPDATE / EDIT / DELETE
  // =====================================================

  todoList.addEventListener("click", function (event) {

    const target = event.target;

    const id = Number(target.dataset.id);


    // Ignore clicks that are not task buttons
    if (!id) {
      return;
    }


    // -------------------------------------------------
    // COMPLETE / UNCOMPLETE
    // -------------------------------------------------

    if (target.classList.contains("todo-checkbox")) {

      tasks = tasks.map(function (task) {

        if (task.id === id) {
          task.completed = target.checked;
        }

        return task;

      });


      saveTasks();
      renderTasks();

      return;
    }


    // -------------------------------------------------
    // EDIT TASK
    // -------------------------------------------------

    if (target.classList.contains("todo-edit")) {

      const task = tasks.find(function (task) {
        return task.id === id;
      });


      if (!task) {
        return;
      }


      const newText = prompt(
        "Edit your task:",
        task.text
      );


      if (
        newText !== null &&
        newText.trim() !== ""
      ) {

        task.text = newText.trim();

        saveTasks();
        renderTasks();

      }

      return;
    }


    // -------------------------------------------------
    // DELETE TASK
    // -------------------------------------------------

    if (target.classList.contains("todo-delete")) {

      const confirmed = confirm(
        "Are you sure you want to delete this task?"
      );


      if (!confirmed) {
        return;
      }


      tasks = tasks.filter(function (task) {
        return task.id !== id;
      });


      saveTasks();
      renderTasks();

    }

  });


  // =====================================================
  // FILTER BUTTONS
  // =====================================================

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      currentFilter = button.dataset.filter;


      // Remove active from all buttons
      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });


      // Add active to selected button
      button.classList.add("active");


      // Display filtered tasks
      renderTasks();

    });

  });


  // =====================================================
  // TASK COUNT
  // =====================================================

  function updateCount(count) {

    if (count === 1) {

      todoCount.textContent = "1 task";

    } else {

      todoCount.textContent = count + " tasks";

    }

  }


  // =====================================================
  // INITIAL DISPLAY
  // =====================================================

  renderTasks();

});
