const fs = require("fs");
// const path = require("path");

function exportToJSON(data, outputPath) {
  const jsonData = JSON.stringify(data, null, 2); // Prettify JSON with 2-space indentation

  fs.writeFile(outputPath, jsonData, (err) => {
    if (err) {
      return err;
    } else {
      return 1;
    }
  });
}

export { exportToJSON };
