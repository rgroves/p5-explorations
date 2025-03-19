import p5 from 'p5/lib/p5';

class SketchLoader {
  #currentSketch;
  #currentSketchUid;
  #pathExclusions;
  #sketchImportsMap;

  constructor(sketchConfig) {
    const { dynamicImportsMap, pathPrefix } = sketchConfig;

    this.#currentSketch = null;
    this.#currentSketchUid = null;
    this.#pathExclusions = [...pathPrefix.split('/')];
    this.#sketchImportsMap = dynamicImportsMap;

    this.menuLevels = new Map();
    this.menuLevels.set("/", { sketches: [], subMenu: new Map() });

    Object.keys(this.#sketchImportsMap).forEach(filepath => {
      const pathLevels = filepath.split('/').filter(
        (part) => !this.#pathExclusions.includes(part)
      );
      this.#addToMenu(filepath, pathLevels);
    });
  }

  #addToMenu(filepath, pathLevels) {
    const nameNormalizer = (name) => name.replace('.js', '').replace(/[ ]/g, "__");

    const sketchUid = nameNormalizer(pathLevels.join("_"));
    const menuItemName = nameNormalizer(pathLevels[pathLevels.length - 1]).replace(/-/g, ' ');

    let targetMenuLevel = this.menuLevels.get("/");

    pathLevels.forEach((level, index) => {
      const isDirectoryLevel = index < (pathLevels.length - 1);

      if (isDirectoryLevel) {
        if (!targetMenuLevel.subMenu.has(level)) {
          const newLevel = { sketches: [], subMenu: new Map() };
          targetMenuLevel.subMenu.set(level, newLevel);
        }

        targetMenuLevel = targetMenuLevel.subMenu.get(level);
      } else {
        targetMenuLevel.sketches.push({ sketchUid, filepath, menuItemName });
      }
    });
  }

  async #load(uid, filepath) {
    try {
      if (this.#currentSketch && this.#currentSketchUid === uid) {
        return;
      }

      const module = await this.#sketchImportsMap[filepath]();
      const sketch = module.default;

      if (this.#currentSketch) {
        this.#currentSketch.remove();
        this.#currentSketch = null;
      }

      this.#currentSketchUid = uid;
      this.#currentSketch = new p5(sketch);
    } catch (err) {
      console.error(err);
    }
  }

  registerMenuRenderer(renderer) {
    this.menuRenderer = renderer;
  }

  #_renderMenu(menuLevel, element, clickHandler) {
    let curElement;

    menuLevel.forEach((levelMeta, level) => {
      curElement = this.menuRenderer.onNewMenuLevel(
        level,
        levelMeta.sketches.map(sketch => {
          return {
            sketchUid: sketch.sketchUid,
            filepath: sketch.filepath,
            menuItemName: sketch.menuItemName
          };
        }),
        clickHandler
      );

      if (levelMeta.subMenu.size > 0) {
        this.#_renderMenu(levelMeta.subMenu, curElement, clickHandler);
      }

      element.appendChild(curElement);
    });

  }

  renderMenu(menuContainerElement) {
    if (!this.menuRenderer) {
      console.error("No menu renderer registered.");
      return;
    }

    this.#_renderMenu(
      this.menuLevels,
      menuContainerElement,
      (uid, filepath) => {
        this.#load(uid, filepath);
      }
    );
  }
}

export default SketchLoader;