#!/usr/bin/env python3
"""Gera o pacote do Firefox (AMO) a partir do build de producao (dist/expanded).

Aplica as adaptacoes de manifest necessarias para o Firefox MV3, replicando o
formato do pacote 1.6.9 ja publicado no Firefox Add-Ons:
 - background.scripts em vez de background.service_worker
 - browser_specific_settings.gecko com id sei-trello-fork@wellratm e
   strict_min_version 140.0, incluindo data_collection_permissions
"""
import json
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
EXPANDED = os.path.join(ROOT, 'dist', 'expanded')
FIREFOX_DIR = os.path.join(ROOT, 'dist', 'firefox')
BUNDLED = os.path.join(ROOT, 'dist', 'bundled')

def main():
    if not os.path.isdir(EXPANDED):
        sys.exit('dist/expanded nao encontrado. Rode o build de producao antes.')

    # Copia o build para dist/firefox
    if os.path.isdir(FIREFOX_DIR):
        shutil.rmtree(FIREFOX_DIR)
    shutil.copytree(EXPANDED, FIREFOX_DIR)

    # Adapta o manifest para o Firefox
    manifest_path = os.path.join(FIREFOX_DIR, 'manifest.json')
    with open(manifest_path, encoding='utf-8') as f:
        manifest = json.load(f)

    version = manifest['version']
    manifest['background'] = {'scripts': ['js/service_worker.js']}
    manifest['browser_specific_settings'] = {
        'gecko': {
            'id': 'sei-trello-fork@wellratm',
            'strict_min_version': '140.0',
            'data_collection_permissions': {'required': ['none'], 'optional': []},
        }
    }

    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write('\n')

    # Compacta
    os.makedirs(BUNDLED, exist_ok=True)
    out = os.path.join(BUNDLED, f'sei-trello-firefox_v{version}.zip')
    if os.path.exists(out):
        os.remove(out)
    subprocess.run(['zip', '-rq', out, './'], cwd=FIREFOX_DIR, check=True)
    print(f'Pacote Firefox gerado: {out}')

if __name__ == '__main__':
    main()
