import * as std from 'std';
import * as os from 'os';
import { file as _file } from "./file.js";
export function unobstructed(src) {
  src = src.split("/").filter(v => v);
  let p = src.join("/");
  let dir = [];
  if (!p) return;
  while (!os.stat(p)[0]) {
    // src = src.split("/");
    dir.unshift(p);
    // p = p.
    src.pop();
    p = src.join("/");
  }
  dir.forEach(v => os.mkdir(v));
}
let fun = (src, opt) => {
  let that = {
    mkdir(name) {
      unobstructed(src);
      mkdir(src + "/" + name);
    },
    list(filter) {
      let _filter = filter ? filter : (() => true);
      let r = (os.readdir(src)[0] || []).filter(v => (v != "." && v != ".." && _filter(v)));

      return r;
    },
    file(name, data, options) {
      unobstructed(src);
      return _file(src + "/" + name).write(data, options);
    },
    empty(filter) { // 删除子文件
      that.list(filter).forEach(v => {
        os.remove(src + "/" + v);
      });
    },
    delete() { // 删除自身 及 子文件
      os.remove(src);
    },
    // copyTo(src2, filter) {

    // },
    chmod(str) {
      return os.exec(["chmod", src, str]);
    },
    back(p) { // 上一级,上n级
      if (!p || typeof p == "number") { //上一级,上p级
        let a = src.split("/");
        let len = a.length - (p || 1);
        src = a.slice(0, len).join("/");
        return that;
      }
      // 字符匹配 上n级
      let len = src.lastIndexOf(p);
      if (len < 0) { src = "/"; return that; }

      len = len + p.length + 1;
      src = src.slice(0, len);
      return that;
    },
    next(s) {
      src = src + "/" + s;
      return that;
    },
    rename(name) {
      let p = src.split("/")
      p.pop();
      p = p.join("/") + "/" + name;
      // console.log("rename", src, name, p);
      let s = os.rename(src, p);
      src = p;
      return s;
    },
    move(path) {

      let name = src.split("/").pop();
      path = path + "/" + name;
      // console.log("rename", src, name, p);
      // let s = 
      os.rename(src, path);
      src = path;
      return that;
    }
  };
  return that;
};

// function f(src) {

// }
// f.prototype.text = function (str) {
//   text(src,str)
// }
export function dir(src, opt) {
  return fun(src, opt);
}