// data.js

const ITEMS = [];

for (let i = 1; i <= 1000000; i++) {
  ITEMS.push({ id: i, name: `Item ${i}` });
}

console.log('items filled');


module.exports = { ITEMS };
