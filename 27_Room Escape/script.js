(() => {
  // Cache DOM elements
  const roomWrap = document.querySelector(".room-wrap");
  const room = document.querySelector(".room");
  const roomCanvas = document.querySelector("#room");
  const inventory = document.querySelector("#inventory");

  // Constants and state
  const views = ["back-view", "left-view", "front-view", "right-view"];
  const walls = ["wall-back", "wall-left", "wall-front", "wall-right"];
  let currentViewIndex = 1; // Start at 'front-view'
  let currentRotationY = -90;

  // Room transformation functions
  const updateRoomTransform = (offsetX, offsetY) => {
    room.style.transform = `rotateX(${offsetY}deg) rotateY(${currentRotationY + offsetX}deg)`;
  };

  const updateView = (direction) => {
    if (direction === "left") {
      currentViewIndex = (currentViewIndex + 1) % views.length;
      currentRotationY -= 90;
    } else if (direction === "right") {
      currentViewIndex = (currentViewIndex - 1 + views.length) % views.length;
      currentRotationY += 90;
    }

    roomWrap.classList.remove(...views);
    roomWrap.classList.add(views[currentViewIndex]);

    // Trigger CSS rotation animation
    roomWrap.classList.add("rotating");
    setTimeout(() => roomWrap.classList.remove("rotating"), 500);

    // Update active wall
    document.querySelectorAll(".room div").forEach((wall) => wall.classList.remove("active"));
    document.querySelector(`.${walls[currentViewIndex]}`).classList.add("active");

    updateRoomTransform(0, 0);
  };

  // Button click event listeners
  const initButtons = () => {
    document.getElementById("turnLeft").addEventListener("click", () => updateView("left"));
    document.getElementById("turnRight").addEventListener("click", () => updateView("right"));
    document.getElementById("zoom").addEventListener("click", () => roomCanvas.classList.toggle("zoomed"));
    document.getElementById("inv").addEventListener("click", () => roomCanvas.classList.toggle("inv-open"));
  };

  // Keyboard arrow key support
  const initKeyboardSupport = () => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") updateView("left");
      else if (e.key === "ArrowRight") updateView("right");
    });
  };

  // Mobile swipe support
  const initSwipeSupport = () => {
    let touchStartX = null;
    roomWrap.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    roomWrap.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const touchEndX = e.changedTouches[0].screenX;
      const diffX = touchStartX - touchEndX;
      if (Math.abs(diffX) > 30) { // Minimum swipe distance threshold
        diffX > 0 ? updateView("left") : updateView("right");
      }
      touchStartX = null;
    });
  };

  // Mouse movement interactivity
  const initMouseMovement = () => {
    roomWrap.addEventListener("mousemove", (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;
      const rotateXOffset = parseFloat((xPercent * 15).toFixed(2));
      const rotateYOffset = parseFloat((-yPercent * 15).toFixed(2));
      updateRoomTransform(rotateXOffset, rotateYOffset);
    });
  };

  // Create cube faces for each .cube element
  const initCubes = () => {
    document.querySelectorAll(".cube").forEach((cube) => {
      const faces = ["top", "left", "front", "right", "back", "bottom"];
      faces.forEach((face) => {
        const faceElement = document.createElement("div");
        faceElement.classList.add(`cube-${face}`);
        cube.appendChild(faceElement);
      });
    });
  };

  // Tooltip tracker functionality
  const initTooltip = () => {
    const tooltip = document.querySelector("#tooltip");
    document.addEventListener("mousemove", (event) => {
      const tooltipPadding = 10;
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;
      let top = event.clientY + tooltipPadding;
      let left = event.clientX + tooltipPadding;

      // Adjust if overflowing right or bottom edge
      if (left + tooltip.offsetWidth > pageWidth) {
        left = event.clientX - tooltip.offsetWidth - tooltipPadding;
      }
      if (top + tooltip.offsetHeight > pageHeight) {
        top = event.clientY - tooltip.offsetHeight - tooltipPadding;
      }
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    });

    document.querySelectorAll("[data-title]").forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const span = document.createElement("span");
        tooltip.innerHTML = "";
        span.textContent = el.getAttribute("data-title");
        span.classList.add("tooltip-content");
        tooltip.appendChild(span);
        tooltip.style.display = "block";
      });
      el.addEventListener("mouseleave", () => {
        tooltip.innerHTML = "";
        tooltip.style.display = "none";
      });
    });
  };

  // Comment dialogs with fade-out and hint functionality
  const initCommentDialogs = () => {
    const commentElements = document.querySelectorAll("[data-comment]");
    const dialog = document.querySelector("#dialog");

    const addComment = (htmlContent, commentClass) => {
      const commentDiv = document.createElement("div");
      commentDiv.innerHTML = htmlContent;
      if (commentClass) commentDiv.className = commentClass;
      commentDiv.style.cursor = "pointer";
      commentDiv.style.transition = "opacity 0.5s ease";

      const fadeOut = (element) => {
        element.style.opacity = "0";
        setTimeout(() => {
          if (element.parentElement) {
            element.parentElement.removeChild(element);
          }
        }, 500);
      };

      commentDiv.addEventListener("click", () => fadeOut(commentDiv));
      dialog.appendChild(commentDiv);
      setTimeout(() => fadeOut(commentDiv), 4000);
    };

    commentElements.forEach((el) => {
      el.addEventListener("click", () => {
        addComment(el.getAttribute("data-comment"));
      });
    });

    const hints = [
      "Ask again later.",
      "Think for yourself.",
      "Don't leave the house today.",
      "Stay asleep.",
      "Have you seen the exit?",
      "Always look on the bright side.",
      "Go outside."
    ];
    document.querySelector("#hint").addEventListener("click", () => {
      addComment(hints[Math.floor(Math.random() * hints.length)], "hint");
    });
  };

  // Utility: Fan toggle and dark mode switch
  const initUtilities = () => {
    const fan = document.querySelector(".fan");
    if (fan) {
      fan.addEventListener("click", () => fan.classList.toggle("active"));
    }
    document.querySelectorAll(".switch").forEach((toggler) => {
      toggler.addEventListener("click", () => roomCanvas.classList.toggle("dark"));
    });
  };

  // Inventory item transfer setup
  const initInventory = () => {
    const roomItems = document.querySelectorAll('#room [data-item]');
    const invSlots = document.querySelectorAll('#invGrid li');
    roomItems.forEach((item) => {
      item.addEventListener('click', () => {
        // Move the item to the first empty inventory slot
        for (let slot of invSlots) {
          if (slot.children.length === 0) {
            slot.appendChild(item);
            break;
          }
        }
      });
    });
  };

  // Main initialization function called on DOMContentLoaded
  const init = () => {
    updateView(); // Initialize room view
    initButtons();
    initKeyboardSupport();
    initSwipeSupport();
    initMouseMovement();
    initCubes();
    initTooltip();
    initCommentDialogs();
    initUtilities();
    initInventory();
  };

  document.addEventListener("DOMContentLoaded", init);
})();