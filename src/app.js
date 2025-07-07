import sketchConfig from './lib/sketch-loader/config.js';
import SketchLoader from './lib/sketch-loader/SketchLoader.js';
import { SketchMenuPopoverRenderer } from './lib/SketchMenuRenderer.js';

import './style.css'
import './sketch-menu.css'

if (!document.getElementById('app')) {
  throw new Error("No app element found.");
}

const sketchMenuContainer = document.getElementById('sketch-menu-container');

if (!sketchMenuContainer) {
  throw new Error("No sketch menu container element found.");
}

const sketchLoader = new SketchLoader(sketchConfig);
const sketchMenuRenderer = new SketchMenuPopoverRenderer();
sketchLoader.registerMenuRenderer(sketchMenuRenderer);
sketchLoader.renderMenu(sketchMenuContainer);
