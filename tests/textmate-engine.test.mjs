import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import path from "node:path";
import {fileURLToPath} from "node:url";
import test from "node:test";

const require=createRequire(import.meta.url);
const {Registry,parseRawGrammar}=require("vscode-textmate");
const {loadWASM,OnigScanner,OnigString}=require("vscode-oniguruma");
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const grammarPath=path.join(root,"syntaxes/atto.tmLanguage.json");
const json=JSON.parse(readFileSync(grammarPath,"utf8"));
const packageJSON=JSON.parse(readFileSync(path.join(root,"package.json"),"utf8"));
const wasm=readFileSync(require.resolve("vscode-oniguruma/release/onig.wasm"));
await loadWASM(wasm.buffer.slice(wasm.byteOffset,wasm.byteOffset+wasm.byteLength));

const registry=new Registry({
  onigLib:Promise.resolve({
    createOnigScanner:sources=>new OnigScanner(sources),
    createOnigString:source=>new OnigString(source)
  }),
  loadGrammar:async scopeName=>scopeName==="source.atto"?
    parseRawGrammar(readFileSync(grammarPath,"utf8"),grammarPath):null
});
const grammar=await registry.loadGrammar("source.atto");
assert.ok(grammar,"TextMate grammar must compile");

function tokensFor(src){
  const tokens=[];let stack=null;let offset=0;
  for(const line of src.split("\n")){
    const r=grammar.tokenizeLine(line,stack);
    for(const t of r.tokens)tokens.push({
      text:line.slice(t.startIndex,t.endIndex),
      start:offset+t.startIndex,
      end:offset+t.endIndex,
      scopes:t.scopes
    });
    stack=r.ruleStack;
    offset+=line.length+1;
  }
  return tokens;
}
function tokenAt(src,needle,from=0){
  const index=src.indexOf(needle,from);
  assert.ok(index>=0,"Expected source to contain "+needle);
  const token=tokensFor(src).find(t=>t.start<=index&&t.end>=index+needle.length);
  assert.ok(token,"Token not found for "+needle);
  return token;
}
function inScope(token,scope){
  assert.ok(token.scopes.some(s=>s===scope||s.startsWith(scope+".")),
    token.text+" should contain "+scope+": "+JSON.stringify(token.scopes));
}
function notKeyword(token){
  assert.ok(!token.scopes.some(s=>s.startsWith("keyword.")),
    token.text+" unexpectedly received keyword scope: "+JSON.stringify(token.scopes));
}

test("registered .atto grammar compiles under vscode-textmate and Oniguruma",()=>{
  assert.equal(json.scopeName,"source.atto");
  assert.equal(packageJSON.contributes.languages[0].id,"atto");
  assert.deepEqual(packageJSON.contributes.languages[0].extensions,[".atto",".ores"]);
  assert.equal(packageJSON.contributes.grammars[0].path,"./syntaxes/atto.tmLanguage.json");
});

test("actor and implements receive category scopes, identifiers do not",()=>{
  const src="define actor Worker implements Runnable;";
  inScope(tokenAt(src,"define"),"keyword.declaration");
  inScope(tokenAt(src,"actor"),"keyword.entity");
  inScope(tokenAt(src,"implements"),"keyword.relationship");
  notKeyword(tokenAt(src,"Worker"));notKeyword(tokenAt(src,"Runnable"));
});

test("Java guard and unsafe are scoped while longer spellings are not",()=>{
  const src="guard ready; unsafe; guard_count; unsafe_helper; Guard;";
  inScope(tokenAt(src,"guard"),"keyword.control");
  inScope(tokenAt(src,"unsafe"),"keyword.effect");
  for(const word of ["guard_count","unsafe_helper","Guard"])notKeyword(tokenAt(src,word));
});

test("quoted literals, Symbol literals, and templates mask keywords",()=>{
  const src='// actor implements\n"actor implements" #ready #"guard unsafe" '+
    String.fromCharCode(96)+"actor await"+String.fromCharCode(96);
  inScope(tokenAt(src,"actor"),"comment.line");
  for(const [needle,scope] of [
    ['"actor implements"',"string.quoted.double"],
    ["#ready","constant.other.symbol"],
    ['#"guard unsafe"',"constant.other.symbol.quoted"],
    [String.fromCharCode(96)+"actor await"+String.fromCharCode(96),"string.quoted.template"]
  ]){
    const at=src.indexOf(needle);
    const spans=tokensFor(src).filter(t=>t.start<at+needle.length&&t.end>at);
    assert.ok(spans.length>0,needle);
    assert.ok(spans.every(t=>t.scopes.some(s=>s===scope||s.startsWith(scope+"."))),
      needle+" leaked into nonliteral scopes: "+JSON.stringify(spans));
  }
});

test("nested block comments do not leak keywords or swallow following code",()=>{
  const src="/* outer /* actor */ implements */ actor";
  inScope(tokenAt(src,"implements"),"comment.block");
  const last=tokenAt(src,"actor",src.lastIndexOf("*/")+2);
  inScope(last,"keyword.entity");
  assert.ok(!last.scopes.some(s=>s.startsWith("comment.block")));
});

test("whole-word guards exclude case variants and identifier substrings",()=>{
  const src="actor actor2 actor_thing actorΩ _actor ACTOR";
  inScope(tokenAt(src,"actor"),"keyword.entity");
  for(const word of ["actor2","actor_thing","actorΩ","_actor","ACTOR"])notKeyword(tokenAt(src,word));
});

test("nb-select is a display compound; contextual subtraction is not",()=>{
  const src="nb-select nb-select_more critical-read a-b;";
  inScope(tokenAt(src,"nb-select"),"keyword.concurrency");
  // The legal NB prefix may retain its keyword scope even if the suffix makes
  // this a subtraction expression. It must not be a *single* nb-select token.
  const near=src.indexOf("nb-select_more");
  const nearTokens=tokensFor(src).filter(t=>t.start<near+"nb-select_more".length&&t.end>near);
  assert.ok(nearTokens.length>1);
  assert.ok(!nearTokens.some(t=>t.text==="nb-select"));
  assert.ok(!tokensFor("critical-read").some(t=>t.scopes.some(s=>s.startsWith("keyword.concurrency"))));
  assert.ok(!tokensFor("a-b").some(t=>t.scopes.some(s=>s.startsWith("keyword.concurrency"))));
});

test("operator pipeline and actor pipe are visibly distinct",()=>{
  const src="spawn A() pipe spawn B(); left |> right;";
  inScope(tokenAt(src,"spawn"),"keyword.concurrency");
  notKeyword(tokenAt(src,"pipe"));
  inScope(tokenAt(src,"|>"),"keyword.operator.pipeline");
});

test("TARGET keywords and LLVM-only words are not silently reserved",()=>{
  const src="declare sealed singleton final supervisor state suspend borrow;";
  for(const word of ["declare","sealed","singleton","final","supervisor","state","suspend","borrow"])
    notKeyword(tokenAt(src,word));
});

test("callable stop is lexically a keyword until parser-aware tokens exist",()=>{
  const src="worker.stop();";
  inScope(tokenAt(src,"stop"),"keyword.concurrency");
});

test("modern mtd receiver declarations and pure functions have lexical scopes",()=>{
  const src="pure fnc apply(int x): int { return x; }\\ndefine class Counter as\\n  mtd inc(self): int { return 1; }\\nend";
  inScope(tokenAt(src,"pure"),"keyword.effect");
  inScope(tokenAt(src,"fnc"),"keyword.entity");
  inScope(tokenAt(src,"mtd"),"keyword.entity");
  inScope(tokenAt(src,"self"),"variable.language");
});

test("mtd and pure highlighting is whole-word and masked inside literals",()=>{
  const src='mtd mtd_helper _mtd pure pure2 pure_value PURE "#pure mtd" // mtd pure';
  inScope(tokenAt(src,"mtd"),"keyword.entity");
  inScope(tokenAt(src,"pure"),"keyword.effect");
  for(const ident of ["mtd_helper","_mtd","pure2","pure_value","PURE"])
    notKeyword(tokenAt(src,ident));
  inScope(tokenAt(src,"#pure mtd"),"string.quoted.double");
  inScope(tokenAt(src,"mtd",src.indexOf("//")),"comment.line");
  inScope(tokenAt(src,"pure",src.indexOf("//")),"comment.line");
});
