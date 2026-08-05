const AdmZip = require('adm-zip');
const path = require('path');

const base = path.resolve(__dirname, '../dist') + path.sep;
const arquivos = process.argv.slice(2);

const flat = (obj, prefix = '') => {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? prefix + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(out, flat(v, key));
    else out[key] = JSON.stringify(v);
  }
  return out;
};

const mapas = arquivos.map((f) => {
  const m = JSON.parse(new AdmZip(base + f).getEntry('manifest.json').getData().toString('utf8'));
  return flat(m);
});

const chaves = [...new Set(mapas.flatMap((m) => Object.keys(m)))].sort();

for (const chave of chaves) {
  const valores = mapas.map((m) => m[chave]);
  if (new Set(valores).size === 1) continue;
  console.log('* ' + chave);
  valores.forEach((v, i) => console.log('    ' + arquivos[i] + ': ' + (v === undefined ? '(ausente)' : v)));
}
