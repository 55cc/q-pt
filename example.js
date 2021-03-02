import * as std from "std";
import * as os from "os";

// hello world
import { hello } from "./clib/hello.so";
hello("world");

// add
import { add } from "./clib/hello.so";
let sum = add(1, 5);
console.log("sum", sum);

// readLine
import { console as csl } from "./common/common.js"
// let str = csl.readLine("input str:");
// csl.log("result", "the input string is", str);

// file io
import { file } from "./fsys/file.js";
let txt = file("./temp/a.txt");
txt.write("abcd ");
txt.append("1234 ");
csl.log("file", txt.read());
// charset
txt.write("utf-8:中文字符 ", { charset: "utf-8" });
txt.append("gbk:中文字符 ", "gbk");
csl.log("utf-8", txt.read());
csl.log("gbk", txt.read({ charset: "gbk" }));

// file event watch
import { watch } from "./fsys/watch/watch.js";

// watch()
let handle = watch({ src: "./temp/", flag: ["IN_CREATE", "IN_MOVE", "IN_DELETE", "IN_MODIFY"] }, function (e) {
  csl.info("watch", e);
});
os.setTimeout(function () {
  // edit file
  file("./temp/a.txt").write("abcd");
}, 1000)

os.setTimeout(function () {
  handle.close(); // end watch
}, 2000)