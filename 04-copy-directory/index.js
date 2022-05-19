const fs = require('fs');
const path = require('path');

fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true });

fs.promises.readdir(path.join(__dirname, 'files')).then(data => {
  data.forEach(file => {
    fs.promises.stat(path.join(__dirname, 'files', file)).then(stats => {
      if (stats.isFile()) {
        fs.promises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
      }
    });    
  });
});
