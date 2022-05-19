const fs = require('fs');
const path = require('path');

fs.promises.readdir(path.join(__dirname, 'secret-folder')).then(data => {
  data.forEach(file => {
    fs.promises.stat(path.join(__dirname, 'secret-folder', file)).then(stats => {
      const fileSize = stats.size === 0 ? 0 : (stats.size / 1024).toFixed(3);
      if (stats.isFile()) {
        console.log(`${(path.parse(file).name)} - ${path.extname(file).slice(1)} - ${fileSize}kb`);
      }
    });
  });
});