const fs = require('fs');
const path = require('path');

// 递归读取目录下所有的文件
function readFiles(dir, files = []) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            readFiles(filePath, files);
        } else {
            files.push(filePath);
        }
    });
    return files;
}

// 删除所有文件名包含 '-p-' 的文件
function deleteExtraImages(files) {
    files.forEach(file => {
        if (file.includes('-p-')) {
            fs.unlinkSync(file);
            console.log(`Deleted: ${file}`);
        }
    });
}

const imagesDir = './images/'; // 替换为你的图片目录路径
const imageFiles = readFiles(imagesDir);
deleteExtraImages(imageFiles);