const fs = require('fs');
const path = require('path');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');



const copyDir = async () =>{
    try {
    await fs.promises.mkdir(path.join(__dirname, 'files-copy'), { recursive: true});//create new dir
    const folder  = path.join(__dirname, 'files');//get files dir
    const files = await fs.promises.readdir(folder, {withFileTypes: true});//get files

    for (let file of files) {// обход файлов
        let fromFile = path.join(__dirname, 'files', file.name);//откуда
        let toFile = path.join(__dirname, 'files-copy', file.name);//куда
        await fs.promises.copyFile(fromFile, toFile);// copy files
    };

    } catch (err) {
    console.error(err);
}
};

copyDir();