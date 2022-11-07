const fs = require('fs');
const path = require('path');
const { join} = require('path');
const { mkdir, copyFile, readdir, readFile, rm, stat  } = require('fs/promises');
const bundleDir = path.join(__dirname, 'project-dist', 'style.css');
const stylesDir = path.join(__dirname, 'styles');
const assetsFromDir = path.join(__dirname, 'assets');
const assetsToDir = path.join(__dirname, 'project-dist', 'assets');
const componentsDir = path.join(__dirname, 'components');
const tagsDir = path.join(__dirname, 'template.html');
const indexDir = path.join(__dirname, 'project-dist', 'index.html');


//copy assets
const copyDir = async (assetsFromDir, assetsToDir) => {
    await fs.promises.rm(assetsToDir, { recursive: true, force: true });
    await fs.promises.mkdir(assetsToDir, { recursive: true });
    const files = await fs.promises.readdir(assetsFromDir);
    for (let file of files) {
      const fromFile = join(assetsFromDir, file);
      const toFile = join(assetsToDir, file);
      const stats = await stat(fromFile);
      if (stats.isFile()){
         await copyFile(fromFile, toFile);
      } else await copyDir(fromFile, toFile);
    }
  };

//create style.css file
const getFiles = async () => {//get files data
    try {
        await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true});//create new dir
        const folder = path.join(__dirname, 'styles');//get files dir
        const files = await fs.promises.readdir(folder, { withFileTypes: true });//get files
        for (let file of files) {
            if (path.extname(file.name) === '.css') {
                readFiles(file);
            }
        }
    } catch (error) {
        console.error(error);
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
        console.error(error);
    }
};
async function makeBundle(bundleDir, result) {
    try {
        await fs.promises.appendFile(bundleDir, result);
    } catch (error) {
        console.error(error);
    }
};

//create html
async function createSite() {
    try {
        await fs.promises.rm(path.join(__dirname, 'project-dist'), {force: true, recursive: true, maxRetries: 100});
        await fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
        await fs.promises.copyFile(tagsDir, indexDir);
        const files = await fs.promises.readdir(componentsDir, {withFileTypes: true});

        // files.forEach(async (value) => { //error?
        //     if (path.extname(value.name) === '.html') {
        //         console.log(value.name);
        //         const fileData = path.join(__dirname, 'components', value.name);
        //         const tagCode = `{{${path.basename(fileData, '.html')}}}`; 
        //         const indexData = await fs.promises.readFile(indexDir, 'utf8');
        //         await getTags(fileData, tagCode, indexData); 
        //     };
        //   })

        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i].name) === '.html') {
                // console.log(files[i].name);
                const fileData = path.join(__dirname, 'components', files[i].name);
                const tagCode = `{{${path.basename(fileData, '.html')}}}`; 
                const indexData = await fs.promises.readFile(indexDir, 'utf8');
                await getTags(fileData, tagCode, indexData); 
            };
        } 

    } catch (error) {
        console.error(error);
    }
}
async function getTags(fileData, tagCode, indexData) {
    try {
        const data = await fs.promises.readFile(fileData, 'utf-8');
        const replaceTag = indexData.replace(tagCode, data);
        await fs.promises.writeFile(indexDir, replaceTag);
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    try {
      await createSite();
      await copyDir(assetsFromDir, assetsToDir);
      await getFiles();
    } catch (error) {
        console.error(error);
    }
  })();