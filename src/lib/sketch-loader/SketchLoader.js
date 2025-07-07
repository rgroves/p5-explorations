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

    this.menuLevelMap = new Map();
    this.menuLevelMap.set("/", { sketches: [], subMenu: new Map(), levelNbr: 0 });

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

    let targetMenuLevel = this.menuLevelMap.get("/");

    pathLevels.forEach((level, index) => {
      const isDirectoryLevel = index < (pathLevels.length - 1);

      if (isDirectoryLevel) {
        if (!targetMenuLevel.subMenu.has(level)) {
          const newLevel = { sketches: [], subMenu: new Map(), levelNbr: index + 1 };
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

  renderMenu(menuContainerElement) {
    if (!this.menuRenderer) {
      console.error("No menu renderer registered.");
      return;
    }

    this.menuRenderer.renderMenu(
      menuContainerElement,
      this.menuLevelMap,
      ((uid, filepath) => {
        this.#load(uid, filepath);
      }).bind(this)
    );
  }
}

export default SketchLoader;