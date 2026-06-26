const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const src = path.resolve(__dirname, '..');
const version = require('../package.json').version;
const out = path.resolve(__dirname, `../dist/sei-trello-${version}-source.zip`);
const exclude = ['node_modules', 'dist', '.git'];

if (fs.existsSync(out)) fs.unlinkSync(out);

const zip = new AdmZip();

function addDir(dirPath, zipPath) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    if (exclude.includes(entry)) continue;
    const fullPath = path.join(dirPath, entry);
    const entryZipPath = zipPath ? zipPath + '/' + entry : entry;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      addDir(fullPath, entryZipPath);
    } else {
      zip.addFile(entryZipPath, fs.readFileSync(fullPath));
    }
  }
}

addDir(src, '');
zip.writeZip(out);
console.log('ZIP source criado:', out);
console.log('Tamanho:', (fs.statSync(out).size / 1024).toFixed(0) + ' KB');
