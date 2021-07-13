import init, { fib } from "./pkg/wasm_deno_rust_api.js";

// addEventListener("fetch", (event) => {
//   console.log(event);
//   const res = { result: fib(10).toString() };
//   const response = new Response(JSON.stringify(res), {
//     headers: { "content-type": "application/json" },
//   });
//   event.respondWith(response);
// });

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
    // const res = { result: Number(context.params.number).toString() };
    // const res = { result: 42 };
    context.response.body = JSON.stringify(res);
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

addEventListener("fetch", app.fetchEventHandler());
