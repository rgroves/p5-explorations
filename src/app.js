import sketchConfig from './lib/sketch-loader/config.js';
import SketchLoader from './lib/sketch-loader/SketchLoader.js';
import SketchMenuHtmlDetailsTreeRenderer from './lib/SketchMenuRenderer.js';
import './style.css'

const app = document.querySelector('#app');

if (!app) {
  console.error("No app element found.");
}

const sketchMenuContainer = document.querySelector('#sketch-menu');

if (!sketchMenuContainer) {
  console.error("No sketch menu element found.");
}

const sketchLoader = new SketchLoader(sketchConfig);
const sketchMenuRenderer = new SketchMenuHtmlDetailsTreeRenderer();
sketchLoader.registerMenuRenderer(sketchMenuRenderer);
sketchLoader.renderMenu(sketchMenuContainer);
