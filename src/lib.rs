// use num_integer::lcm;
// use rand::Rng;
// use serde::{Deserialize, Serialize};
// use sha3::{Digest, Keccak256, Sha3_256};
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
