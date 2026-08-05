const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const version = require('../package.json').version;
const src = path.resolve(__dirname, '../dist/expanded');
const out = path.resolve(__dirname, `../dist/sei-trello-${version}-edge.zip`);

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
    } else if (entry === 'manifest.json' && zipPath === '') {
      /* Edge (Chromium) ignora browser_specific_settings, que é exclusivo do Firefox.
         Removê-lo evita avisos na validação do Partner Center. */
      const manifest = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      delete manifest.browser_specific_settings;
      zip.addFile(entryZipPath, Buffer.from(JSON.stringify(manifest, null, 2)));
    } else {
      zip.addFile(entryZipPath, fs.readFileSync(fullPath));
    }
  }
}

addDir(src, '');
zip.writeZip(out);
console.log('ZIP Edge criado:', out);
