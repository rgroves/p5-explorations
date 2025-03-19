// If you want to load sketches from a different directory, change the path 
// passed to the import.meta.glob function and the path set in the sketchPath 
// property of the config object below.

const sketchConfig = {
  pathPrefix: '/src/sketches',
  // ** The path argument here must be a string literal **
  dynamicImportsMap: import.meta.glob('/src/sketches/**/*.js'),
};

export default sketchConfig;
