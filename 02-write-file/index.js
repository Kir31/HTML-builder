const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'some_text.txt'), 'utf-8');
stdout.write('Hello! Write your text here...\n');
stdin.on('data', data => {
  output.write(data);
  fs.readFile(path.join(__dirname, 'some_text.txt'), 'utf-8', (err, data) => {
    if (err) throw err;
    if (data.includes('exit')) {      
      exit(); 
    }
  });
});
process.on('exit', () => stdout.write('Good bye!'));
process.on('SIGINT', () => exit());