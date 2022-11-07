const fs = require("fs");
const path = require("path");
const pathToData = path.join(__dirname, "secret-folder");
fs.readdir(pathToData, { withFileTypes: true }, (_, data) => {
  data.filter((file) => {
    if (file.isFile()) {
      let pathToFile = path.join(pathToData, file.name);
      fs.stat(pathToFile, function (_, stats) {
        console.log(
          path.parse(pathToFile).name +
            ` -  ` +
            path.extname(file.name).slice(1) +
            `  -   ` +
            stats.size +
            " bytes"
        );
      });
    }
  });
});
