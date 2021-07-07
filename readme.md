# DenoとRustでつくるAPI

## プロジェクト作成

```bash
$ cargo new wasm-deno-rust-api --lib
```

## Rustのコード実装

`cargo.toml`に以下の内容を記述する．

```toml
[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "=0.2.61"
```

`src/lib.rs`に以下を記述する．フィボナッチ数列で指定した項を求める．

```rust
use wasm_bindgen::prelude::*;

fn fib_helper(n: i32, acc1: i64, acc2: i64) -> i64 {
  match n {
    n if n < 1 => acc1,
    _ => fib_helper(n - 1, acc1 + acc2, acc1),
  }
}

#[wasm_bindgen]
pub fn fib(n: i32) -> i64 {
  fib_helper(n, 0, 1)
}

#[cfg(test)]
mod tests {
  use super::*;
  #[test]
  fn it_works() {
    assert_eq!(fib(4), 3);
    assert_eq!(fib(10), 55);
  }
}
```

## ビルド

```bash
$ rustwasmc build --target deno --release
```

## deno-deployの設定

```bash
$ deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -f https://deno.land/x/deploy/deployctl.ts
```

`server.ts`

```ts
addEventListener("fetch", (event) => {
  const response = new Response("Hello Deno Deploy!", {
    headers: { "content-type": "text/plain" },
  });
  event.respondWith(response);
});
```

実行．`http://0.0.0.0:8080`にアクセスしてメッセージが表示されればOK．

```bash
$ deployctl run --allow-net --allow-read --watch ./server.ts
```
