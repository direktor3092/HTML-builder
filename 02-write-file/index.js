const fs = require('fs')
const path = require('path');
const { stdin, stdout } = process;

//create file 
fs.writeFile(
    path.join(__dirname, 'text.txt'),
    '',
    (err) => {
        if (err) throw err;
    }
);

stdout.write('Aстральный психолог готов выслушать ваши проблемы.\n');

//add text
stdin.on('data', data => {
    const dataStringified = data.toString();

    if(dataStringified.trim() === 'exit'){
        process.exit();
    }
    fs.appendFile(
        path.join(__dirname,  'text.txt'),
        dataStringified,
        err => {
            if (err) throw err;
        }
    );
});
process.on('SIGINT', () => process.exit()); //press ctrl + c

process.on('exit', code => {
    if (code === 0) {
        stdout.write('Все будет хорошо!');
    } else {
        stderr.write(`Что-то пошло не так. Программа завершилась с кодом ${code}`);
    }
});

process.on('SIGINT', () => process.exit()); //if Ctrl + C