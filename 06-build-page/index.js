const fs = require('fs');
const path = require('path');

fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

const htmlOutput = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
const styleOutput = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');

async function readComponents() {
  const data = await fs.promises.readdir(path.join(__dirname, 'components'));
  let obj = {};
  let arr = [];
  let tagName;
  let re;
  const html = await fs.promises.readFile(path.join(__dirname, 'template.html'), 'utf-8');
  arr.push(html);
  let str = arr.join('');

  for (let i = 0; i < data.length; i++) {
    const file = data[i];
    const tag = await fs.promises.readFile(path.join(__dirname, 'components', file), 'utf-8');
    tagName = path.parse(file).name;
    obj[tagName] = tag;
    re = new RegExp(`{{${tagName}}}`, 'g');
    if (path.extname(file) === '.html') str = str.replace(re, obj[tagName]);
  }
  htmlOutput.write(str);
}
readComponents();

fs.promises.readdir(path.join(__dirname, 'styles')).then(data => {
  data.forEach(file => {
    const infoArr = [];
    fs.promises.stat(path.join(__dirname, 'styles', file)).then(stats => {
      if (stats.isFile() && path.extname(file) === '.css') {
        fs.promises.readFile(path.join(__dirname, 'styles', file), 'utf-8').then(info => {
          infoArr.push(info);
          styleOutput.write(infoArr.join(''));
        });
      }
    });
  });
});

fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true});

async function copyAssets(path, pathTo) {  
  const data = await fs.promises.readdir(path);  
  for (let i = 0; i < data.length; i++) {
    const file = data[i];
    const stats = await fs.promises.stat(path + '/' + file);    
    if (stats.isFile()) {
      fs.promises.copyFile((path + '/' + file), (pathTo + '/' + file));
    } else {
      fs.promises.mkdir((pathTo + '/' + file), {recursive: true});
      copyAssets((path + '/' + file), (pathTo + '/' + file));
    }
  } 
}
copyAssets((path.join(__dirname, 'assets')), path.join(__dirname, 'project-dist', 'assets'));
