const fs = require('fs');
const { stdout } = process;
const readableStream = fs.createReadStream('./01-read-file/text.txt', 'utf-8');

readableStream.on('data', chunk => stdout.write(chunk));