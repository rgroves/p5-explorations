class SketchMenuHtmlDetailsTreeRenderer {
  onNewMenuLevel(level, sketches, clickHandler) {
    const details = document.createElement('details');
    details.className = 'sketch-menu-level';
    const summary = document.createElement('summary');
    summary.textContent = level === "/" ? "Sketches" : level;
    details.appendChild(summary);

    if (sketches.length > 0) {
      const list = document.createElement('ul');
      list.className = 'sketch-list';
      sketches.forEach((sketch) => {
        const listItem = document.createElement('li');
        listItem.className = 'sketch-list-item';
        listItem.id = sketch.sketchUid;
        listItem.textContent = sketch.menuItemName;
        listItem.addEventListener(
          'click',
          () => {
            clickHandler(sketch.sketchUid, sketch.filepath);
          }
        );
        list.appendChild(listItem);
      });

      details.appendChild(list);
    }

    return details
  }
}

export default SketchMenuHtmlDetailsTreeRenderer;