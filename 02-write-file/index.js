const fs = require("fs");
const writeStream = fs.createWriteStream("./02-write-file/text.txt");

console.log("write text");

process.stdin.on("data", (data) => {
  if (data.toString().trim().toLowerCase() === "exit") {
    console.log("Writing finished");
    process.exit();
  }
  writeStream.write(data);
});

process.on("SIGINT", function () {
  console.log("Writing finished");
  process.exit();
});
