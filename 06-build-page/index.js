const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const pathFolder = path.join(__dirname, "project-dist");
fsPromises.rm(pathFolder, { recursive: true, force: true }).then(() => {
  fsPromises
    .mkdir(pathFolder, { recursive: true })
    .then(() => newHTML())
    .then(() => newCSS())
    .then(() => copyFolder(pathFromFolder, pathToFolder))
    .catch((error) => console.log(error));
});
async function newHTML() {
  const template = await fsPromises.readFile(
    path.join(__dirname, "template.html"),
    "utf-8",
    (error) => {
      if (error) throw error;
    }
  );
  let fileHTML = template;
  const items = template.match(/\{\{+[a-w]+}}/g);
  for (let item of items) {
    let component = await fsPromises.readFile(
      path.join(__dirname, "components", `${item.slice(2, -2)}.html`),
      "utf-8",
      (error) => {
        if (error) throw error;
      }
    );
    fileHTML = fileHTML.replace(`${item}`, `${component}`);
    await fsPromises.writeFile(path.join(pathFolder, "index.html"), fileHTML);
  }
}
const pathFolderStyles = path.join(__dirname, "styles");
const bundlePath = path.join(pathFolder, "style.css");
function newCSS() {
  fsPromises
    .readdir(pathFolderStyles, { withFileTypes: true })
    .then((files) => {
      fsPromises.writeFile(bundlePath, "").then(() => {
        for (let file of files) {
          if (file.isFile() && path.extname(file.name) === ".css") {
            let filePath = path.join(pathFolderStyles, file.name);
            fsPromises.readFile(filePath).then((data) => {
              fsPromises
                .appendFile(bundlePath, data)
                .catch((error) => console.log(error));
            });
          }
        }
      });
    });
}
const pathFromFolder = path.join(__dirname, "assets");
const pathToFolder = path.join(pathFolder, "assets");
function copyFolder(pathFromFolder, pathToFolder) {
  fs.readdir(pathFromFolder, { withFileTypes: true }, (error, files) => {
    if (error) throw error;
    files.forEach((file) => {
      if (file.isDirectory()) {
        fs.rm(
          `${pathToFolder}/${file.name}`,
          { recursive: true, force: true },
          (error) => {
            if (error) throw error;
            fs.mkdir(
              `${pathToFolder}/${file.name}`,
              { recursive: true },
              (error) => {
                if (error) throw error;
                copyFolder(
                  `${pathFromFolder}/${file.name}`,
                  `${pathToFolder}/${file.name}`
                );
              }
            );
          }
        );
      } else {
        fs.copyFile(
          `${pathFromFolder}/${file.name}`,
          `${pathToFolder}/${file.name}`,
          (error) => {
            if (error) {
              throw error;
            }
          }
        );
      }
    });
  });
}
