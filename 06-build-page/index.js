const fs = require('fs');
const path = require('path');

(async () => {
  await fs.promises.rm(path.join(__dirname, 'project-dist'), {recursive: true, force: true});
  await fs.promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});

  readComponents();
  const styleOutput = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'), 'utf-8');
  await fs.promises.readdir(path.join(__dirname, 'styles')).then(data => {
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
  await fs.promises.mkdir(path.join(__dirname, 'project-dist', 'assets'), {recursive: true});
  copyAssets((path.join(__dirname, 'assets')), path.join(__dirname, 'project-dist', 'assets'));
})();

async function readComponents() {
  const htmlOutput = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
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
