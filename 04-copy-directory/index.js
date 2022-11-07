const fs = require("fs");
const path = require("path");
const pathToData = path.join(__dirname, "files");
const pathToCopyData = path.join(__dirname, "files-copy");

fs.readdir(pathToCopyData, { withFileTypes: true }, (err, data) => {
  if (err) {
    fs.mkdir(
      "./04-copy-directory/files-copy",
      { recursive: true },
      function (err) {
        if (err) throw err;
      }
    );
  } else {
    data.forEach((file) => {
      if (file.isFile()) {
        let pathToCopyFile = path.join(pathToCopyData, file.name);
        fs.unlink(pathToCopyFile, (err) => {
          if (err) throw err;
        });
      }
    });
  }
});

fs.readdir(
  pathToData,
  {
    withFileTypes: true,
  },
  (_, data) => {
    data.forEach((file) => {
      let pathToFile = path.join(pathToData, file.name);
      let pathToCopyFile = path.join(pathToCopyData, file.name);
      if (file.isFile()) {
        fs.copyFile(pathToFile, pathToCopyFile, (error) => {
          if (error) throw error;
        });
      }
    });
  }
);
