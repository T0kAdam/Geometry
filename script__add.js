let burger = document.querySelector(".header__burger");
let list = document.querySelector(".header__list");
let list__item = document.querySelectorAll(".header__list--item");
let task = document.querySelector("#list-task");
let number = document.querySelector("#number");
let answer = document.querySelector("#answer");

number = Number(number.value);

burger.addEventListener("click", () => {
  list.classList.toggle("active");
  burger.classList.toggle("open");
});

list__item.forEach((item) => {
  item.addEventListener("click", () => {
    list.classList.remove("active");
    burger.classList.remove("open");
  });
});

answer.addEventListener("click", () => {
  if (!number.value) {
    answer.textContent = "Укажите число";
  } else if (task.value === "Объём куба") {
    answer.textContent = "Ответ: " + number.value ** 3;
  } else if (task.value === "Площадь куба") {
    answer.textContent = "Ответ: " + number.value ** 2 * 6;
  } else if (task.value === "Диагональ грани куба") {
    answer.textContent = "Ответ: " + number.value * Math.sqrt(2);
  } else if (task.value === "Пространственная диагональ куба") {
    answer.textContent = "Ответ: " + number.value * Math.sqrt(3);
  } else if (task.value === "Вписанный радиус куба") {
    answer.textContent = "Ответ: " + number.value * Math.sqrt(2);
  } else if (task.value === "Описанный радиус куба") {
    answer.textContent = "Ответ: " + number.value * Math.sqrt(2);
  } else {
    answer.textContent = "Укажите операцию";
  }
});

// Typewriter for large content — preserves HTML, uses IntersectionObserver and rAF
document.addEventListener("DOMContentLoaded", () => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Если пользователь предпочёл reduced motion — показываем всё сразу.
    document
      .querySelectorAll(".typewriter")
      .forEach((el) => el.classList.add("tw--instant"));
    return;
  }

  const elements = Array.from(document.querySelectorAll(".typewriter"));
  if (!elements.length) return;

  // Helper: sleep that yields to browser using requestAnimationFrame for smoother updates.
  const rafSleep = (ms = 0) =>
    new Promise((resolve) => {
      if (ms <= 0) {
        requestAnimationFrame(resolve);
        return;
      }
      const t0 = performance.now();
      function loop(now) {
        if (now - t0 >= ms) return resolve();
        requestAnimationFrame(loop);
      }
      requestAnimationFrame(loop);
    });

  // Type text preserving HTML structure.
  async function typePreserveHTML(target, speed = 40) {
    // Create an empty clone to fill while reading source.
    const sourceNodes = Array.from(target.childNodes);
    target.innerHTML = ""; // clear visual content
    // recursive function that appends nodes and types text nodes char-by-char
    async function processNodes(nodes, container) {
      for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          // create text node we will incrementally fill
          const text = node.textContent || "";
          const newTextNode = document.createTextNode("");
          container.appendChild(newTextNode);
          for (let i = 0; i < text.length; i++) {
            newTextNode.textContent += text[i];
            // throttle: await per-chunk, not per-character for speed control and performance
            if (i % 2 === 0) await rafSleep(speed);
          }
          // small pause between text nodes
          await rafSleep(Math.max(0, speed * 0.5));
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // clone the element tag (without children) and append, then recurse into children
          const elClone = document.createElement(node.tagName);
          // copy attributes (class, href, etc.)
          for (const attr of node.attributes)
            elClone.setAttribute(attr.name, attr.value);
          container.appendChild(elClone);
          // recurse into its children
          await processNodes(Array.from(node.childNodes), elClone);
        } else {
          // ignore comments and others
        }
      }
    }

    await processNodes(sourceNodes, target);
  }

  // Orchestrator: start typing when element enters viewport (IO) OR immediately
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // don't observe again
        observer.unobserve(el);
        // get speed and delay from dataset (milliseconds)
        const speed = parseInt(el.dataset.speed) || 40; // ms per small chunk
        const delay = parseInt(el.dataset.delay) || 0;
        if (delay) await rafSleep(delay);
        // If element has class tw--instant (reduced motion), reveal instantly
        if (el.classList.contains("tw--instant")) {
          // show original content immediately
          // To restore original content, we must have stored it somewhere — easiest: use data-orig
          if (el.dataset.orig) el.innerHTML = el.dataset.orig;
          return;
        }
        // store original HTML in case user clicks "show all"
        if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
        await typePreserveHTML(el, speed);
      });
    },
    { root: null, rootMargin: "0px", threshold: 0.05 }
  );

  // Observe each element
  elements.forEach((el) => {
    // If element already has data-orig absent, store original
    if (!el.dataset.orig) el.dataset.orig = el.innerHTML;
    // optionally start immediately for above-the-fold items:
    // if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
    //   observer.observe(el); // will trigger quickly
    // } else {
    observer.observe(el);
    // }
  });

  // Optional: add a "show all" global shortcut — press "S" to reveal everything instantly
  document.addEventListener("keydown", (e) => {
    // ctrl/cmd + s? or single key?
    if (e.key.toLowerCase() === "s") {
      document.querySelectorAll(".typewriter").forEach((el) => {
        if (el.dataset.orig) el.innerHTML = el.dataset.orig;
        observer.unobserve(el);
      });
    }
  });
});

