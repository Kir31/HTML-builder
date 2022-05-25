const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'some_text.txt'), 'utf-8');
stdout.write('Hello! Write your text here...\n');
stdin.on('data', data => {
  output.write(data);
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
});
process.on('exit', () => stdout.write('Good bye!'));
process.on('SIGINT', () => exit());