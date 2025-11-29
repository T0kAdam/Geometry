let box = document.querySelector(".box");
let title = document.querySelector(".main-title");

title.addEventListener("click", () => {
  box.classList.toggle("show");
});
