import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import test from "node:test";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const pkg=JSON.parse(readFileSync(path.join(root,"package.json"),"utf8"));
const snippets=JSON.parse(readFileSync(path.join(root,"snippets/atto.code-snippets"),"utf8"));
test("Atto snippet contribution is correctly registered",()=>{
  assert.deepEqual(pkg.contributes.snippets,[{language:"atto",path:"./snippets/atto.code-snippets"}]);
  assert.equal(pkg.contributes.languages[0].id,"atto");
});
test("preview snippets have unique prefixes and editable insertion points",()=>{
  const prefixes=new Set();
  for(const [name,entry] of Object.entries(snippets)){
    assert.ok(entry.prefix.startsWith("atto-"),name);
    assert.ok(!prefixes.has(entry.prefix),"duplicate prefix: "+entry.prefix);
    prefixes.add(entry.prefix);
    assert.ok(entry.description,name);
    const body=Array.isArray(entry.body)?entry.body.join("\n"):entry.body;
    assert.match(body,/\$\{(?:0|1)(?::[^}]*)?\}/,name);
  }
  assert.ok(prefixes.size>=6);
});
test("function and actor templates use end delimiters; Symbol is hash-prefixed",()=>{
  assert.match(snippets["Atto function (preview)"].body.join("\n"),/\nend$/);
  assert.match(snippets["Atto actor (preview)"].body.join("\n"),/\nend$/);
  assert.match(snippets["Atto Symbol"].body,/^#/);
  assert.ok(!snippets["Atto functional pipeline"].body.includes(" pipe "));
});
