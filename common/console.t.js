import { console } from "./console.js";

console.error("出错");
console.clear();
console.log("title", true, 1, 2, 3);
console.error("title", 1, 2, 3, "4", "i can't", "some says:\"aaaa!\"");
console.log("title", {
  a: "a",
  b: 1,
  c: (new ArrayBuffer(10)),
  fun: (i) => i + 1 + "string\n\\\"\'"
});
console.log("title", new ArrayBuffer(10));
var a = { a: 'a', b: [1, 2, 3, 4], time: new Date() };
a.self = a;
console.log("title", a);
console.info("title", new Uint16Array(10));
console.log("Math", Math.abs);
console.log("now", Date.now());
console.warn("RepExp", /abcd/g);
console.log("RepExp", /abcd{3,4}\//g);
console.log("\\", "4\\\\", "");
console.log(a, a);
let d = {
  a: 'a', deep: 1, b: { a: 'a', deep: 2, c: { a: 'a', deep: 3, b: { a: 'a', deep: 4, c: { a: 'a', deep: 5, b: { a: 'a', deep: 6, b: { a: 'a', deep: 7, c: { a: 'a', deep: 8, b: { a: 'a', deep: 9, c: { a: 'a', deep: 10, c: { a: 'a', deep: 11 } } } } } } } } } }
}
console.log("deep 10", d);
console.log("enter", "abc\nefg");