const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/\.ge'([^']+)'/g, ".get('$1')");
    content = content.replace(/\.selec'([^']+)'/g, ".select('$1')");
    content = content.replace(/\.spli'([^']+)'/g, ".split('$1')");
    
    // Some are .spli' '[0] for example
    content = content.replace(/\.spli' '/g, ".split(' '");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            replaceInFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'app/dashboard'));
walkDir(path.join(__dirname, 'components/dashboard'));
console.log('Fix done!');
