import { ChiaSeeds } from './test/fixtures/chia-products.js';

console.log('Product:', JSON.stringify(ChiaSeeds, null, 2));
console.log('');
console.log('Variants:', ChiaSeeds.variants);
console.log('');
console.log('First variant pricing:', ChiaSeeds.variants[0]?.pricing);
