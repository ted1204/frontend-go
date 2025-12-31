#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, exts = ['.ts', '.tsx', '.js', '.jsx']){
  const res = [];
  for(const name of fs.readdirSync(dir)){
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if(st.isDirectory()) res.push(...walk(p, exts));
    else if(exts.includes(path.extname(p))) res.push(p);
  }
  return res;
}

function extractKeysFromFiles(root){
  const files = walk(root);
  const re = /t\((['"])((?:\\.|(?!\1).)+)\1\)/g;
  const keys = new Set();
  for(const f of files){
    try{
      const s = fs.readFileSync(f,'utf8');
      let m;
      while((m = re.exec(s))){
        keys.add(m[2]);
      }
    }catch(e){ /* ignore read errors */ }
  }
  return Array.from(keys).sort();
}

function loadLocaleObject(){
  // prefer built JS if available
  const builtPath = path.join(process.cwd(),'build/utils/i18n/locales/en.js');
  if(fs.existsSync(builtPath)){
    return require(builtPath).default || require(builtPath);
  }
  // fallback to TS parse naive: try to read packages utils en.ts and parse top-level keys
  const srcPath = path.join(process.cwd(),'packages/utils/src/i18n/locales/en.ts');
  if(!fs.existsSync(srcPath)) return null;
  const src = fs.readFileSync(srcPath,'utf8');
  // naive eval: extract the object literal between `const en = {` and `} as const;` — not perfect but works for typical files
  const start = src.indexOf('const en =');
  const objText = start >= 0 ? src.slice(start) : null;
  try{
    // As last resort, attempt to transpile-ish by replacing `: '` with `: "` and removing `as const` then eval in node vm
    const clean = src.replace(/as const;?/, '');
    // eslint-disable-next-line no-eval
    const mod = {}; eval(clean + '\nmodule.exports = en;');
    return module.exports;
  }catch(e){
    return null;
  }
}

function hasKey(obj, pathParts){
  let cur = obj;
  for(const p of pathParts){
    if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p];
    else return false;
  }
  return true;
}

function main(){
  const srcRoot = path.join(process.cwd(),'src');
  if(!fs.existsSync(srcRoot)){
    console.error('src/ not found, run from project root');
    process.exit(2);
  }

  const usedKeys = extractKeysFromFiles(srcRoot);
  const locale = loadLocaleObject();
  if(!locale){
    console.error('Failed to load built locale (build/utils/i18n/locales/en.js) and fallback parse failed.');
    process.exit(3);
  }

  const missing = [];
  for(const key of usedKeys){
    // skip obviously invalid keys
    if(!/^[a-zA-Z0-9_.{}\-:,]+$/.test(key)) continue;
    const parts = key.split('.');
    if(hasKey(locale, parts)) continue;
    if(Object.prototype.hasOwnProperty.call(locale, key)) continue;
    missing.push(key);
  }

  console.log('Found', usedKeys.length, 'translation usages. Missing keys:', missing.length);
  for(const m of missing) console.log(m);
  // exit code 0 to avoid breaking; caller can decide
  process.exit(0);
}

main();
