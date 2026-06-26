const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const version = require('../package.json').version;
const src = path.resolve(__dirname, '../dist/expanded');
const out = path.resolve(__dirname, `../dist/sei-trello-${version}.zip`);

if (fs.existsSync(out)) fs.unlinkSync(out);

const zip = new AdmZip();

function addDir(dirPath, zipPath) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
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
console.log('ZIP criado com sucesso:', out);
