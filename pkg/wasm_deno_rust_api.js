let imports = {};
let wasm;

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
  if (
    cachegetInt32Memory0 === null ||
    cachegetInt32Memory0.buffer !== wasm.memory.buffer
  ) {
    cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachegetInt32Memory0;
}

const u32CvtShim = new Uint32Array(2);

const int64CvtShim = new BigInt64Array(u32CvtShim.buffer);
/**
* @param {number} n
* @returns {BigInt}
*/
const fib = function (n) {
  wasm.fib(8, n);
  var r0 = getInt32Memory0()[8 / 4 + 0];
  var r1 = getInt32Memory0()[8 / 4 + 1];
  u32CvtShim[0] = r0;
  u32CvtShim[1] = r1;
  const n0 = int64CvtShim[0];
  return n0;
};
export { fib };

import * as path from "https://deno.land/std/path/mod.ts";
import WASI from "https://deno.land/std/wasi/snapshot_preview1.ts";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const wasi = new WASI({
  args: Deno.args,
  env: Deno.env.toObject(),
  preopens: {
    "/": __dirname,
  },
});
imports = { wasi_snapshot_preview1: wasi.exports };

const p = path.join(__dirname, "wasm_deno_rust_api_bg.wasm");
const bytes = Deno.readFileSync(p);
const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;

wasi.memory = wasmInstance.exports.memory;
