const fs = require('fs');
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'), 'utf-8');

fs.promises.readdir(path.join(__dirname, 'styles')).then(data => {
  data.forEach(file => {
    const infoArr = [];
    fs.promises.stat(path.join(__dirname, 'styles', file)).then(stats => {
      if (stats.isFile() && path.extname(file) === '.css') {
        fs.promises.readFile(path.join(__dirname, 'styles', file), 'utf-8').then(info => {         
          infoArr.push(info);
          output.write(infoArr.join(''));
        });
      }
    });    
  });
});

