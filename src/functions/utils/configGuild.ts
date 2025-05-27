import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../../settings.json');

export function getConfig() {
  const raw = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(raw);
}

export function setConfigValue(pathString: string, newValue: string) {
  const pathKeys = pathString.split('.');
  const config = getConfig();
  let obj = config;

  for (let i = 0; i < pathKeys.length - 1; i++) {
    if (obj[pathKeys[i]] === undefined) {
      throw new Error(`Caminho inválido: ${pathKeys.slice(0, i + 1).join('.')}`);
    }
    obj = obj[pathKeys[i]];
  }

  const finalKey = pathKeys[pathKeys.length - 1];

  if (!(finalKey in obj)) {
    throw new Error(`Chave final inválida: ${finalKey}`);
  }

  obj[finalKey] = newValue;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
}

