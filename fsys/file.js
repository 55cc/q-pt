// import { freedom } from "../common/common.js";
import * as std from 'std';
import * as os from 'os';
import {
  // console,
  TextEncoder, TextDecoder,
  // setTimeout, setInterval, clearInterval
} from "../common/common.js";
import { unobstructed } from "./dir.js";

// default options
const dopt = {
  charset: "utf-8",
}

function toString(buffer, charset) {
  return (new TextDecoder(charset ?? dopt.charset)).decode(buffer);
}
function toBuffer(data, charset) {
  // == "ArrayBuffer"
  if (data instanceof ArrayBuffer) return {
    buffer: data,
    length: data.length
  };
  if (typeof data == "string") {
    let u = (new TextEncoder(charset ?? dopt.charset)).encode(data);
    return u;
  }
  throw new Error("Can't convert [" + (typeof data) + "] to buffer");
}


function seekTo(fd, fun) {
  // if (fd === null) return fun();
  let c = fd.tell();
  // fd.seek(0, std.SEEK_END);
  let r = fun();
  // rewind(fd);
  fd.seek(c, std.SEEK_SET);
  return r;
}
function tellEnd(fd) {
  // let c = fd.tell();
  // fd.seek(0, std.SEEK_END);
  // let len = fd.tell();
  // // rewind(fd);
  // fd.seek(c, std.SEEK_SET);
  // return len;
  return seekTo(fd, () => {
    fd.seek(0, std.SEEK_END);
    return fd.tell();
  });
}
function readBuffer(src, opt) {
  let f = std.open(src, "r");
  let start = opt?.start ?? 0;
  let length = opt?.length ?? (tellEnd(f));
  let b = new ArrayBuffer(length);
  // console.log("read", start, length);
  seekTo(f, () => {
    if (start) { f.seek(start, std.SEEK_SET); }
    f.read(b, 0, length);
  });
  // console.log(charset, "\n" + str);
  f.close();
  let type = opt?.type || "string";
  if (type == 'ArrayBuffer') return b;
  let str = toString(b, opt?.charset ?? dopt.charset)
  if (type == 'string') return str;
  // ( && ) ||
  if (type == 'json') return JSON.parse(str);
  if (typeof type == 'function') return type(b, str)

}
function writeBuffer(src, data, opt) {
  unobstructed(src.split("/").slice(0, -1).join("/"));
  let f = std.open(src, opt?.mode ?? "w");
  data = toBuffer(data, opt?.charset);
  seekTo(f, () => {
    let start = opt?.start ?? 0;
    // console.log("write s l", start, data.length);
    if (start != 0) {
      let s = f.seek(start, std.SEEK_SET);
      console.log("seek", start, s);
    }
    // f.read(b, 0, length);
    f.write(data.buffer, 0, data.length);
  });
  f.close();
}

function stat(src) {
  let stat = os.stat(src) || [null]
  return stat[0];// || null;
  // ftype[
  // ];
}

let fun = (src, options) => {
  let r = {
    // type:
    // [text utf]  ArrayBuffer
    read(opt) {
      // type : "string" | "ArrayBuffer" | "json?"
      //  string json : charset
      //  ArrayBuffer : ?
      return readBuffer(src, opt);
    },

    // [line utf] http?
    // line(i, end, charset) {
    //   // 按行读取
    // },
    char(start, len, opt) {
      // 按byte读取 // 合并到 read
      opt = opt || {};
      opt.start = start;
      opt.length = len;
      return readBuffer(src, opt);
    },

    write(data, opt) {
      // 写入数据
      // type数据类型
      // let type = ((typeof data == "string") && 'string') ?? (a instanceof ArrayBuffer == "ArrayBuffer") && "ArrayBuffer";
      // string :  charset编码 => ArrayBuffer
      // opt  :  charset编码 , mode写入模式 , offset
      return writeBuffer(src, data, opt);
    },
    append(data, charset) {
      // return writeText(src, text, "aw");
      let opt = { charset: charset || null };
      opt.mode = opt?.mode ?? 'a';
      return writeBuffer(src, data, opt);
    },
    rename(name) {
      // std.open()
      let p = src.split("/")
      p.pop();
      p = p.join("/") + "/" + name;
      // console.log("rename", src, name, p);
      let s = os.rename(src, p);
      src = p;
      return s;
    },
    delete() {
      let s = os.remove(src);
      src = null;
      return s;
    },
    move(path) {
      let s = os.rename(src, path);
      src = path;
      return s;
    },
    // chmod() {
    // 
    // }
    stat() {
      return stat(src);
    },
    isDir() {
      let mode = stat(src)?.mode ?? null;
      // console.log("mode", mode, os.S_IFDIR, os.S_IFREG)
      return !!(mode & os.S_IFDIR);
    },
    isFile() {
      let mode = stat(src)?.mode ?? null;
      return !!(mode & os.S_IFREG);
    },
    iff(flag, fun) {
      if (flag(stat(src)?.mode ?? null)) fun(r);
      return r;
    }
  }
  return r;
};

export function file(src, options) {
  return fun(src, options || {});
}

// options : 