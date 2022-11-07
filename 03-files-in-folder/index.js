const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stdout } = process;

const folder = path.join(__dirname, './secret-folder');

(async () => {
try {
    const allСontent = await readdir(folder, { withFileTypes: true });
    const files = [];
    for(i = 0; i < allСontent.length; i++){
        if(allСontent[i].isFile()) files.push(allСontent[i]);
    }
    files.forEach(async file =>{
      const filePath = path.join(folder, file.name);
      const stats = await stat(filePath);
      stdout.write(`file name: ${file.name.split('.')[0]}, file extension: ${path.extname(file.name)}, file size: ${stats.size}b\n`);
    });
} catch (err) {
  console.error(err);
}
})();