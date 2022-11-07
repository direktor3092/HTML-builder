const fs = require('fs');
const path = require('path');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const bundleDir = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesDir = path.join(__dirname, 'styles');

fs.writeFile(//create file
    path.join(__dirname, 'project-dist', 'bundle.css'),
    '',
    (err) => {
        if (err) throw err;
        console.log('Файл был создан');
    }
);


const getFiles = async () => {//get files data
    try {
        const folder = path.join(__dirname, 'styles');//get files dir
        const files = await fs.promises.readdir(folder, { withFileTypes: true });//get files
        for (let file of files) {
            if (path.extname(file.name) === '.css') {
                readFiles(file);
            }
        }
    } catch (err) {
        console.error(err);
    }
};

async function readFiles(file) {
    try {
        let result = '\n';
        const fileData = path.join(stylesDir, file.name);// пути к нужным файлам css
        const input = fs.createReadStream(fileData, 'utf-8');//создания потока записи
        // const output = fs.createWriteStream(bundleDir, 'utf-8'); make errors in css file
        // input.on('data', chunk => output.write(chunk));
        // input.on('error', error => console.log('Error', error.message));
        input.on('data', chunk => result += chunk);
        input.on('end', () => {//вызов функции записи при завершении чтения
            makeBundle(bundleDir, result);
        });
    } catch (error) {
        console.error(err);
    }
};

async function makeBundle(bundleDir, result) {
    try {
        await fs.promises.appendFile(bundleDir, result);
    } catch (error) {
        console.error(err);
    }
};

getFiles();