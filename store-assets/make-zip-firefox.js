const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

const version = require('../package.json').version;
const src = path.resolve(__dirname, '../dist/expanded');
const out = path.resolve(__dirname, `../dist/sei-trello-${version}-firefox.zip`);

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
      // Patch manifest for Firefox: replace service_worker with scripts
      const manifest = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const sw = manifest.background.service_worker;
      manifest.background = { scripts: [sw] };
      manifest.browser_specific_settings.gecko.id = 'sei-trello-fork@wellratm';
      manifest.browser_specific_settings.gecko.strict_min_version = '140.0';
      manifest.browser_specific_settings.gecko.data_collection_permissions = { required: ['none'], optional: [] };
      zip.addFile(entryZipPath, Buffer.from(JSON.stringify(manifest, null, 2)));
    } else {
      zip.addFile(entryZipPath, fs.readFileSync(fullPath));
    }
  }
}

addDir(src, '');
zip.writeZip(out);
console.log('ZIP Firefox criado:', out);
