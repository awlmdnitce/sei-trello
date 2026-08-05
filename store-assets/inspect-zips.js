const AdmZip = require('adm-zip');
const crypto = require('crypto');
const path = require('path');

const base = path.resolve(__dirname, '../dist') + path.sep;
const [zipA, zipB] = process.argv.slice(2);

const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);

const mapOf = (z) => {
  const m = new Map();
  new AdmZip(base + z)
    .getEntries()
    .filter((e) => !e.isDirectory)
    .forEach((e) => m.set(e.entryName, sha(e.getData())));
  return m;
};

const a = mapOf(zipA);
const b = mapOf(zipB);
const todas = [...new Set([...a.keys(), ...b.keys()])].sort();

let iguais = 0;
for (const nome of todas) {
  const ha = a.get(nome);
  const hb = b.get(nome);
  if (ha === hb) {
    iguais++;
  } else {
    console.log('DIFERE: ' + nome + '  [' + zipA + ': ' + (ha || 'ausente') + ']  [' + zipB + ': ' + (hb || 'ausente') + ']');
  }
}
console.log('\n' + iguais + ' de ' + todas.length + ' arquivos identicos.');
