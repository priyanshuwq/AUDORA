// oneko.js: https://github.com/adryd325/oneko.js

(async function oneko() {
  const nekoEl = document.createElement("div");
  let nekoPosX = 32,
    nekoPosY = 32,
    mousePosX = 0,
    mousePosY = 0,
    frameCount = 0,
    idleTime = 0,
    idleAnimation = null,
    idleAnimationFrame = 0,
    forceSleep = false,
    grabbing = false,
    grabStop = true,
    nudge = false,
    kuroNeko = false,
    variant = "classic";

  function parseLocalStorage(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(`oneko:${key}`));
      return typeof value === typeof fallback ? value : fallback;
    } catch (e) {
      console.error(e);
      return fallback;
    }
  }

  const nekoSpeed = 10,
    variants = [
      ["classic", "Classic"],
      ["dog", "Dog"],
      ["tora", "Tora"],
      ["maia", "Maia"],
      ["vaporwave", "Vaporwave"],
    ],
    spriteSets = {
      idle: [[-3, -3]],
      alert: [[-7, -3]],
      scratchSelf: [
        [-5, 0],
        [-6, 0],
        [-7, 0],
      ],
      scratchWallN: [
        [0, 0],
        [0, -1],
      ],
      scratchWallS: [
        [-7, -1],
        [-6, -2],
      ],
      scratchWallE: [
        [-2, -2],
        [-2, -3],
      ],
      scratchWallW: [
        [-4, 0],
        [-4, -1],
      ],
      tired: [[-3, -2]],
      sleeping: [
        [-2, 0],
        [-2, -1],
      ],
      N: [
        [-1, -2],
        [-1, -3],
      ],
      NE: [
        [0, -2],
        [0, -3],
      ],
      E: [
        [-3, 0],
        [-3, -1],
      ],
      SE: [
        [-5, -1],
        [-5, -2],
      ],
      S: [
        [-6, -3],
        [-7, -2],
      ],
      SW: [
        [-5, -3],
        [-6, -1],
      ],
      W: [
        [-4, -2],
        [-4, -3],
      ],
      NW: [
        [-1, 0],
        [-1, -1],
      ],
    }, // Get keys with 2 or more sprites
    keys = Object.keys(spriteSets).filter((key) => spriteSets[key].length > 1),
    usedKeys = new Set();

  function sleep() {
    forceSleep = !forceSleep;
    nudge = false;
    localStorage.setItem("oneko:forceSleep", forceSleep);
    if (!forceSleep) {
      resetIdleAnimation();
      return;
    }

    // Detect mobile vs desktop
    const isMobile = window.innerWidth < 768; // md breakpoint in Tailwind

    if (isMobile) {
      // Mobile: Sleep on the AudioPlayer mini-player (bottom of screen)
      const mobilePlayer = document.querySelector('.md\\:hidden.fixed.bottom-24');
      if (mobilePlayer) {
        const rect = mobilePlayer.getBoundingClientRect();
        // Position on top-right of mobile player
        mousePosX = rect.right - 16;
        mousePosY = rect.top - 12;
        return;
      }
    } else {
      // Desktop: Sleep on the progress bar (PlaybackControls)
      const progressSlider = document.querySelector('footer [role="slider"]');
      if (progressSlider) {
        const rect = progressSlider.getBoundingClientRect();
        // Position on the progress bar slider thumb
        mousePosX = rect.left + 16;
        mousePosY = rect.top - 8;
        return;
      }

      // Fallback: try to find the progress bar container
      const playbackFooter = document.querySelector('footer.h-16, footer.h-20, footer.h-24');
      if (playbackFooter) {
        const rect = playbackFooter.getBoundingClientRect();
        mousePosX = rect.right - 120; // near volume controls
        mousePosY = rect.top + rect.height / 2;
        return;
      }
    }

    // Ultimate fallback: bottom-right corner
    mousePosX = window.innerWidth - 32;
    mousePosY = window.innerHeight - 32;
  }

  function create() {
    variant = parseLocalStorage("variant", "classic");
    kuroNeko = parseLocalStorage("kuroneko", false);

    if (!variants.some((v) => v[0] === variant)) {
      variant = "classic";
    }

    nekoEl.id = "oneko";
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    // nekoEl.style.pointerEvents = "none";
    nekoEl.style.backgroundImage = `url('/oneko/oneko-${variant}.gif')`;
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.filter = kuroNeko ? "invert(100%)" : "none";
    // Render Oneko below Spicetify's Popup Modal
    nekoEl.style.zIndex = "99";

    document.body.appendChild(nekoEl);

    window.addEventListener("mousemove", (e) => {
      if (forceSleep) return;

      mousePosX = e.clientX;
      mousePosY = e.clientY;
    });

    window.addEventListener("resize", () => {
      if (forceSleep) {
        forceSleep = false;
        sleep();
      }
    });

    // Handle dragging of the cat
    nekoEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      grabbing = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startNekoX = nekoPosX;
      let startNekoY = nekoPosY;
      let grabInterval;

      const mousemove = (e) => {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        // Scratch in the opposite direction of the drag
        if (absDeltaX > absDeltaY && absDeltaX > 10) {
          setSprite(deltaX > 0 ? "scratchWallW" : "scratchWallE", frameCount);
        } else if (absDeltaY > absDeltaX && absDeltaY > 10) {
          setSprite(deltaY > 0 ? "scratchWallN" : "scratchWallS", frameCount);
        }

        if (grabStop || absDeltaX > 10 || absDeltaY > 10 || Math.sqrt(deltaX ** 2 + deltaY ** 2) > 10) {
          grabStop = false;
          clearTimeout(grabInterval);
          grabInterval = setTimeout(() => {
            grabStop = true;
            nudge = false;
            startX = e.clientX;
            startY = e.clientY;
            startNekoX = nekoPosX;
            startNekoY = nekoPosY;
          }, 150);
        }

        nekoPosX = startNekoX + e.clientX - startX;
        nekoPosY = startNekoY + e.clientY - startY;
        nekoEl.style.left = `${nekoPosX - 16}px`;
        nekoEl.style.top = `${nekoPosY - 16}px`;
      };

      const mouseup = () => {
        grabbing = false;
        nudge = true;
        resetIdleAnimation();
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      };

      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
    });

    nekoEl.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      // Show variant picker on right-click
      showVariantPicker();
    });

    nekoEl.addEventListener("dblclick", sleep);

    window.onekoInterval = setInterval(frame, 100);
  }

  function getSprite(name, frame) {
    return spriteSets[name][frame % spriteSets[name].length];
  }

  function setSprite(name, frame) {
    const sprite = getSprite(name, frame);
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }

    if (forceSleep) {
      avalibleIdleAnimations = ["sleeping"];
      idleAnimation = "sleeping";
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8 && nudge && forceSleep) {
          setSprite("idle", 0);
          break;
        } else if (nudge) {
          nudge = false;
          resetIdleAnimation();
        }
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192 && !forceSleep) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;

    if (grabbing) {
      grabStop && setSprite("alert", 0);
      return;
    }

    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    // Cat has to sleep on top of the progress bar
    if (forceSleep && Math.abs(diffY) < nekoSpeed && Math.abs(diffX) < nekoSpeed) {
      // Make the cat sleep exactly on the top of the progress bar
      nekoPosX = mousePosX;
      nekoPosY = mousePosY;
      nekoEl.style.left = `${nekoPosX - 16}px`;
      nekoEl.style.top = `${nekoPosY - 16}px`;

      idle();
      return;
    }

    if ((distance < nekoSpeed || distance < 48) && !forceSleep) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  function getRandomSprite() {
    let unusedKeys = keys.filter((key) => !usedKeys.has(key));
    if (unusedKeys.length === 0) {
      usedKeys.clear();
      unusedKeys = keys;
    }
    const index = Math.floor(Math.random() * unusedKeys.length);
    const key = unusedKeys[index];
    usedKeys.add(key);
    return [getSprite(key, 0), getSprite(key, 1)];
  }

  function setVariant(arr) {
    variant = arr[0];
    localStorage.setItem("oneko:variant", `"${variant}"`);
    nekoEl.style.backgroundImage = `url('/oneko/oneko-${variant}.gif')`;
  }

  // Popup modal to choose variant
  function pickerModal() {
    const container = document.createElement("div");
    container.className = "oneko-variant-container";

    const style = document.createElement("style");
    // Each variant is a 64x64 sprite
    style.innerHTML = `
      .oneko-variant-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        position: relative;
      }
      .oneko-variant-button {
        width: 56px;
        height: 56px;
        cursor: pointer;
        background-size: 800%;
        border-radius: 8px;
        transition: all 0.15s ease;
        background-position: var(--idle-x) var(--idle-y);
        image-rendering: pixelated;
        border: 2px solid rgba(255, 255, 255, 0.1);
        opacity: 0.7;
        position: relative;
      }
      .oneko-variant-button:hover {
        opacity: 1;
        border-color: rgba(239, 68, 68, 0.5);
        transform: scale(1.05);
        background-position: var(--active-x) var(--active-y);
      }
      .oneko-variant-button-selected {
        opacity: 1;
        border-color: rgb(239, 68, 68);
        box-shadow: 0 0 12px rgba(239, 68, 68, 0.5);
      }
      .oneko-tooltip {
        position: absolute;
        bottom: -28px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10;
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
      .oneko-variant-button:hover .oneko-tooltip {
        opacity: 1;
      }
    `;
    container.appendChild(style);

    const [idle, active] = getRandomSprite();

    function variantButton(variantEnum) {
      const div = document.createElement("div");

      div.className = "oneko-variant-button";
      div.id = variantEnum[0];
      div.style.backgroundImage = `url('/oneko/oneko-${variantEnum[0]}.gif')`;
      div.style.setProperty("--idle-x", `${idle[0] * 64}px`);
      div.style.setProperty("--idle-y", `${idle[1] * 64}px`);
      div.style.setProperty("--active-x", `${active[0] * 64}px`);
      div.style.setProperty("--active-y", `${active[1] * 64}px`);

      // Add tooltip
      const tooltip = document.createElement("div");
      tooltip.className = "oneko-tooltip";
      tooltip.textContent = variantEnum[1];
      div.appendChild(tooltip);

      div.onclick = () => {
        setVariant(variantEnum);
        document.querySelector(".oneko-variant-button-selected")?.classList.remove("oneko-variant-button-selected");
        div.classList.add("oneko-variant-button-selected");
      };

      if (variantEnum[0] === variant) {
        div.classList.add("oneko-variant-button-selected");
      }

      return div;
    }

    for (const variant of variants) {
      container.appendChild(variantButton(variant));
    }

    return container;
  }

  // Show variant picker modal (Audora-compatible, no Spicetify dependency)
  function showVariantPicker() {
    // Create modal overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.15s ease-out;
    `;

    // Create modal content - minimal compact design
    const modal = document.createElement("div");
    modal.style.cssText = `
      background: rgba(24, 24, 27, 0.98);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
      animation: slideUp 0.2s ease-out;
    `;

    // Add picker content
    modal.appendChild(pickerModal());

    // Add animations
    const animations = document.createElement("style");
    animations.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideUp {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(animations);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click or ESC key
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });
    
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.removeEventListener("keydown", handleEsc);
      }
    };
    document.addEventListener("keydown", handleEsc);
  }

  create();

  // Expose global function for easy skin changing via console
  window.onekoChangeSkin = (skinName) => {
    const variantObj = variants.find(v => v[0] === skinName);
    if (variantObj) {
      setVariant(variantObj);
    } else {
      console.log('Available skins:', variants.map(v => v[0]).join(', '));
    }
  };

  // Auto-sleep on page load if previously enabled
  if (parseLocalStorage("forceSleep", false)) {
    // Wait for DOM to be ready
    setTimeout(() => {
      if (!forceSleep) sleep(); // Toggle to activate sleep mode
    }, 1000);
  }
})();
