const chokidar = require("chokidar");
const fs = require("fs");
chokidar
  .watch("dist/background.*.{js,js.map}")
  .on("change", path => {
    removeHash(path);
  })
  .on("add", path => {
    removeHash(path);
  });

function removeHash(path) {
  if (path.includes(".js.map")) {
    fs.copyFileSync(path, "dist/background.js.map");
  } else {
    fs.copyFileSync(path, "dist/background.js");
  }
}
