'use strict';

console.log('start test');
const t = require('tape');
console.log('got tape');

// TODO: document why __esModule is being set
Object.defineProperty(exports, '__esModule', { value: true });
console.log('defined __esModule');
const EPub = require('../../epub');
console.log('loaded epub');

t.test('EPub', t => {
  console.log('start outer test');
  t.test('init', t => {
    console.log('new EPub');
    const epub = new EPub('./example/alice.epub');
    console.log('2');
    t.equal(epub.imageroot, '/images/', 'imageroot is /images/');
    console.log('3');
    t.end();
  });
  t.test('basic parsing', t => {
    const epub = new EPub('./example/alice.epub');
    epub.parse();
    epub.on('end', () => {
      t.ok(epub.metadata.title, 'metadata includes a title');
      t.equal(epub.metadata.title, "Alice's Adventures in Wonderland", 'title is "Alice\'s Adventures in Wonderland');
      t.equal(epub.toc.length, 14, 'toc length is 14');
      t.ok(epub.toc[3].level, 'toc item 3 has a level');
      t.ok(epub.toc[3].order, 'toc item 3 has an order');
      t.ok(epub.toc[3].title, 'toc item 3 has a title');
      t.ok(epub.toc[3].href, 'toc item 3 has an href');
      t.ok(epub.toc[3].id, 'toc item 3 has an id');
      t.equal(epub.imageroot, '/images/', 'imageroot is /images/');
      t.end();
    });
  });
  t.test('supports empty chapters', t => {
    const branch = [{ navLabel: { text: '' } }];
    const epub = new EPub();
    const res = epub.walkNavMap(branch, [], []);
    t.ok(res, 'get a result');
    t.end();
  });
  t.test('raises descriptive errors', t => {
    const epub = new EPub('./example/alice_broken.epub');
    return new Promise((resolve, reject) => {
      try {
        epub.parse();
        epub.on('end', () => {
          t.pass('should emit end event despite the error');
          resolve();
        });
        epub.on('error', (err) => {
          t.ok(err.message.includes('Parsing container XML failed in TOC: Invalid character in entity name'), 'get expected error message');
        });
      } catch (err) {
        t.fail('should not throw an error');
        t.end();
        reject(err);
      }
    });
  });
  t.end();
});
