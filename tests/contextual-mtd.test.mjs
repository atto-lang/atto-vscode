import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const grammar=JSON.parse(readFileSync(new URL('../syntaxes/atto.tmLanguage.json',import.meta.url),'utf8'));
const snippets=JSON.parse(readFileSync(new URL('../snippets/atto.code-snippets',import.meta.url),'utf8'));
// Portable regex tests; separate full TextMate tests verify actual scopes.
test('mtd is contextual rather than an unconditional keyword',()=>{
 const rules=grammar.repository.keywords.patterns.filter(r=>r.name==='keyword.entity.atto').map(r=>new RegExp(r.match,'u'));
 for(const header of ["mtd answer()","pub mtd method()","mtd mtd()","mtd id<T>()","mtd (C self) answer()","mtd [Symbol.iterator]()"])
   assert.ok(rules.some(r=>r.test(header)),header);
 for(const identifier of ["method answer()","method()","mtd()","mtd (value)","x.mtd()","mtd value;","mtd List<int> value;","some_mtd foo()"])
   assert.ok(rules.every(r=>!r.test(identifier)),identifier);
});
test('method snippet uses the canonical introducer',()=>{
 const s=snippets['Atto instance method (preview)'];
 assert.equal(s.prefix,'atto-mtd');
 assert.match(s.body[0],/^mtd /);
});
