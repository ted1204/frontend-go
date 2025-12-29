import translations from './index';

const zhKeys = Object.keys(translations.zh);
const enKeys = Object.keys(translations.en);

const missingInEn = zhKeys.filter((key) => !enKeys.includes(key));

if (missingInEn.length > 0) {
  console.error('Keys missing in English:', missingInEn);
  process.exit(1);
} else {
  console.log('All Chinese keys exist in English.');
}
