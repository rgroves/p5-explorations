export class SketchMenuPopoverRenderer {
  renderMenu(menuRootElement, menuLevelMap, clickHandler) {
    const menu = this.#render(menuLevelMap, undefined, clickHandler);

    // Set up tab traps to keep focus within the popover when navigating with
    // the keyboard.
    menu.querySelectorAll("dialog").forEach((dialog) => {
      dialog.addEventListener("toggle", (e) => {
        if (e.newState === "open") {
          e.target.querySelector("div.sketch-menu-body > button:first-of-type").focus();
        }
      });

      const buttons = dialog.querySelectorAll("&>div>button.menu-btn");
      buttons.forEach((btn, key) => {
        btn.dataset.btnIdx = key + 1;
        btn.addEventListener("mouseenter", (e) => {
          e.target.focus();
        });
        btn.addEventListener("keydown", (e) => {
          if (e.key === "Tab") {
            const curBtnIdx = Number(e.target.dataset.btnIdx);
            const maxBtnIdx = Number(dialog.dataset.btnCount);
            const tabDirMod = e.shiftKey ? -1 : 1;
            let nextBtnIdx = curBtnIdx + tabDirMod;
            nextBtnIdx += (nextBtnIdx < 1 || nextBtnIdx > maxBtnIdx) ? -tabDirMod * maxBtnIdx : 0;
            const nextBtn = dialog.querySelector(`&>div>button.menu-btn[data-btn-idx="${nextBtnIdx}"]`);
            if (nextBtn) {
              e.stopPropagation();
              e.preventDefault();
              nextBtn.focus();
            }
          }
        });
      });
      dialog.dataset.btnCount = buttons.length;
    });

    menuRootElement.appendChild(menu);
  }

  #render(menuLevelMap, levelName, clickHandler) {
    const levelStack = [];
    let mainPopover = null;

    function createMenuButton() {
      const btn = document.createElement("button");
      btn.classList.add("menu-btn");
      return btn;
    }

    function createPopoverHeader(popover, levelName) {
      const popoverHeader = document.createElement("div");
      popoverHeader.className = "sketch-menu-header";

      const menuHeading = document.createElement("h2");
      menuHeading.className = "sketch-menu-label";
      menuHeading.id = `${popover.id}-heading`;
      menuHeading.innerText = levelName === undefined ? "Sketches" : levelName;

      popover.setAttribute("aria-labelledby", menuHeading.id);

      if (levelName) {
        const prevBtnSpan = document.createElement("span");
        prevBtnSpan.className = "sr-only";
        prevBtnSpan.innerText = "Previous Menu";

        const prevBtn = createMenuButton();
        prevBtn.classList.add("menu-prev-btn");
        prevBtn.appendChild(prevBtnSpan);
        prevBtn.popoverTargetElement = popover;
        prevBtn.popoverTargetAction = "hide"
        prevBtn.setAttribute("aria-label", "Go to previous menu");

        popoverHeader.appendChild(prevBtn);
      }
      popoverHeader.appendChild(menuHeading);

      return popoverHeader
    }

    function _render(menuLevelMap, levelName) {
      const level = menuLevelMap.get(levelName || "/");
      const popover = document.createElement("dialog");
      const popoverId = crypto.randomUUID();
      popover.id = popoverId;
      popover.className = "sketch-menu-popover";
      popover.popover = "";
      popover.setAttribute("aria-modal", "true");

      if (!mainPopover) {
        mainPopover = popover;
      }

      const dialogBtn = createMenuButton();
      dialogBtn.popoverTargetElement = popover;
      dialogBtn.innerText = levelName ? levelName : "Sketch Menu";
      dialogBtn.setAttribute("aria-haspopup", "dialog");
      dialogBtn.setAttribute("aria-controls", popover.id);

      const popoverHeader = createPopoverHeader(popover, levelName);

      const closeBtnSpan = document.createElement("span");
      closeBtnSpan.className = "sr-only";
      closeBtnSpan.innerText = "Close";

      const closeBtn = createMenuButton();
      closeBtn.classList.add("menu-close-btn");
      closeBtn.appendChild(closeBtnSpan);
      closeBtn.popoverTargetElement = mainPopover;
      closeBtn.popoverTargetAction = "hide"
      closeBtn.setAttribute("aria-label", "Close menu");


      popoverHeader.appendChild(closeBtn);

      const popoverBody = document.createElement("div");
      popoverBody.className = "sketch-menu-body";

      popover.appendChild(popoverHeader);
      popover.appendChild(popoverBody);

      const parent = levelStack.length > 0 ? levelStack[levelStack.length - 1] : document.createDocumentFragment();
      const parentContainer = levelStack.length > 0 ? parent.querySelector(".sketch-menu-body") : parent;

      if (!parentContainer) {
        throw new Error("No parent menu body found.");
      }

      parentContainer.append(dialogBtn);
      parentContainer.append(popover);

      if (level.subMenu) {
        levelStack.push(popover);
        level.subMenu.keys().forEach((subLevelName) => {
          _render(level.subMenu, subLevelName);
        });
        levelStack.pop();
      }

      if (level.sketches) {
        level.sketches.forEach((sketch, idx) => {
          const sketchBtn = createMenuButton();
          sketchBtn.innerText = sketch.menuItemName;
          sketchBtn.classList.add("sketch-menu-item");
          popoverBody.appendChild(sketchBtn);
          sketchBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (clickHandler) {
              clickHandler(sketch.sketchUid, sketch.filepath);
            }
            mainPopover.hidePopover();;
          });
        });
      }

      return popover.parentNode;
    }

    return _render(menuLevelMap, levelName);
  }
}
