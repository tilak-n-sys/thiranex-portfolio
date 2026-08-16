const button = document.getElementById("theme-toggle");

if (button) {
  button.addEventListener("click", function () {
    document.body.classList.toggle("light-mode");
  });
}
