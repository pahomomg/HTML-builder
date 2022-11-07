const fs = require("fs");
const path = require("path");
const pathToFiles = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");

fs.readdir(pathToFiles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  else {
    fs.writeFile(bundlePath, "", (err) => {
      if (err) throw err;
    });
    files.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === ".css") {
        let filePath = path.join(pathToFiles, file.name);
        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) throw err;
          else {
            fs.appendFile(bundlePath, data, (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
  }
});
