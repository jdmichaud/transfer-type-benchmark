const fs = require('fs');

function generateJson() {
  return {
    someArray: function () {
      return Array.from(new Array(Math.floor(Math.random() * 100000)), function (i) { return Math.floor(Math.random() * 100); }) ;
    }(),
  };
}

function writeJson(json, filename) {
  const content = JSON.stringify(json);
  fs.writeFile(filename, content, 'utf8', function (err) {
    if (err) {
      return console.log(err);
    }

    console.log(`${filename} generated`);
  });
}

// The number of resources to generated
var n = parseInt(process.argv[2], 10);
for (let i = 0; i < n; ++i) {
  writeJson(generateJson(), `file${i}.json`);
}