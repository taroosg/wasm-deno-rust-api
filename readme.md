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
$ wasm-pack build --target web
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

## 動作確認（ローカル）

```bash
$ deployctl run --allow-net --allow-read --watch ./server.ts
```

`http://0.0.0.0:8080`にアクセスしてメッセージが表示されればOK．

## ルーティング設定

```ts
import init, { fib } from "./pkg/wasm_deno_rust_api.js";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

if (Deno.env.get("ENVIRONMENT") === "production") {
  const res = await fetch(
    "https://raw.githubusercontent.com/taroosg/wasm-deno-rust-api/main/pkg/wasm_deno_rust_api_bg.wasm"
  );
  await init(await res.arrayBuffer());
} else {
  await init(Deno.readFile("./pkg/wasm_deno_rust_api_bg.wasm"));
}

const router = new Router();
router
  .get("/", (context) => {
    context.response.body = "Chat server!";
  })
  .get("/:number", (context) => {
    console.log(context.params);
    const res = { result: fib(Number(context.params.number)).toString() };
    context.response.body = JSON.stringify(res);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());

```

## 動作確認（ローカル）

```bash
$ deployctl run --allow-net --allow-read --unstable --no-check --watch ./server.ts
```

`http://0.0.0.0:8080/10`にアクセスして`{result:55}`が表示されればOK．

Rustに適当な関数を追加してビルド -> TSでインポートして動作確認する．


## deno deployでデプロイ

まず作成したコードをGitHubにpushしておく．

deno deployのページからpushしたコードの`server.ts`を指定してプロジェクトを作成すると自動でデプロイされる．

環境変数`ENVIRONMENT`で`production`を設定しておく．設定したら再度デプロイしないと反映されない模様．

URLが発行されるので，`http://hogehoge/100`のように数値をつけて確認する．

`{"result": 3736710778780434371"}`が表示されればOK！
