import { console, setTimeout, setInterval, clearInterval } from "./common/common.js";
console.log("index.js", "hello world");

let i = 1;
let c = setInterval(function () {
  console.log("setInterval", i++);
}, 200)
setTimeout(function () {
  clearInterval(c);
  console.info("note", "More examples are in example.js");
}, 1000);
