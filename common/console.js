// import { sys, open } from "../clib/shell.so";
import { readLine as RL } from "../clib/readLine.so"; // 编译顺序
import * as std from "std";
import * as os from "os";
import { walk } from "./traversal.js";
function minTitle(title) {
  title = " " + title + " "; //.replaceAll('"', '\\"') 
  // let len = title.length;
  // let c = Math.ceil(len / 5);
  // if (c <= 3) { title = title + " ".repeat(5 * c - len); }
  return title;
}

export const console = {
  raw(...arg) { // 自定义
    std.printf(arg.join(" ") + "\n");
  },
  log(title, ...arg) {
    echo(color(minTitle(title), "black", "white"), ...arg)
  },
  error(title, ...arg) {
    echo(color(minTitle(title), "white", "red"), ...arg)
  },
  success(title, ...arg) { // 自定义
    echo(color(minTitle(title), "white", "green"), ...arg)
  },
  info(title, ...arg) {
    echo(color(minTitle(title), "white", "skyblue"), ...arg)
  },
  warn(title, ...arg) {
    echo(color(minTitle(title), "black", "yellow"), ...arg)
  },
  clear(title) {
    os.exec(["echo", "-e", "\\ec"]);
    if (title) {
      echo("----clear:" + (title || "") + " -----")
    }
  },
  readLine(title) { // 自定义 读取一行
    return RL(title || "");
  }
}

var clMap = { // color map
  "black": "0", "0": "0", // "black" or "0" map to "0"
  "red": "1", "1": "1",
  "green": "2", "2": "2",
  "yellow": "3", "3": "3",
  "blue": "4", "4": "4",
  "purple": "5", "5": "5",
  "skyblue": "6", "6": "6",
  "white": "7", "7": "7",
  "": ""
}
let quote = color('@_q', "yellow");//'@_c[35m@_q@_c[0m'; // 引号

function color(t, fc, bg) {
  // fc 字体颜色  bg 背景颜色
  // 0 黑  // 1 红  // 2 绿  // 3 黄  // 4 蓝  // 5 紫  // 6 天蓝  // 7 白
  fc = (fc ?? "") + "";
  fc = clMap[fc] || fc;
  fc && (fc = "3" + fc + "");

  bg = (bg ?? "") + "";
  bg = clMap[bg] || bg;
  bg && (bg = "4" + bg + ";");

  t = (t ?? "") + "";
  let a = "@_c"; // 直接用27,字符拼接替换时会被转译成\u001b从而失效
  return `${a}[${bg}${fc || 0}m` + t + `${a}[0m`;
}

function toColorStr(data) {
  let empty = { null: "purple", undefined: "purple", NaN: "purple", Infinity: "purple" };
  let c = empty[data] || null;
  if (c) return color(data, c);

  // let r = null;
  switch (typeof data) {
    case "boolean":
      return color(data, "blue");
    case "string": {
      let len = data.length;
      let lendes = "";
      if (len > 5) {
        lendes = color("/*" + len + "*/", "green")
      }
      let str = data.replaceAll('"', "@_q");
      return quote + color(str, "white") + quote + lendes;
    }
    case "number":
      return color(data, "skyblue");
    case "symbol":
      return color(data.toString().replaceAll('"', "@_q"), "purple")
    case "function": {
      let code;
      try { code = data.toString().replaceAll('"', "@_q"); } catch (e) {
        code = data.name || "function /*Cannot display code*/"
      }
      return color(code, "skyblue")
    }
  }
}
function objToColorStr(data) {
  if (typeof data != "object") return null;
  if (Array.isArray(data)) return null;
  let name = data?.constructor?.name ?? null;
  switch (name) {
    case "":
    case "Object":
      return null;
    case "Date": return color(name, "green") + color("(" + data.toISOString() + ")", "white");
    case "ArrayBuffer": return color(name, "green") + color("{byteLength:" + data.byteLength + "}", "white");
    case "RegExp": {
      let arr = data.toString().replaceAll('"', "@_q").split("/");

      let str = color(arr.pop(), "blue");
      str = color(arr.join("/") + "/", "red") + str;
      return str;
    }
    default: {
      let key = Object.keys(data).join(", ");
      return color(name, "green") + color("{" + key + "}", "white");
    }
  }

}
const opt = {
  sortkey: true, // 显示内容会根据 key 排序
  keymap: (k) => k, // key 的名称映射
  cclref: () => color("circular reference", "red"), // 循环引用 Circular reference
  ovmap: (obj) => (objToColorStr(obj) || obj), // 对象值显示转换,object value map ,typeof is object
  bvmap: (v) => toColorStr(v), // 非对象值显示转换, basis value map , not include value whose typeof is object
  maxdeep: 10, // 允许显示的最大深度
  outdeep: color("...", "red"), // 超出显示
  maxstep: 1000, // 允许显示的最大 k-v对 数
  outstep: color("...", "red"), // 超出显示
}
function echo(title, ...arg) {

  let str = arg.map(a => JSON.stringify(walk(a, opt))
    // .replace
    .replaceAll("\\t", "\t")
    .replaceAll("\\r", "\r")
    .replaceAll("\\n", "\n")
    .replaceAll("\\\\", "\\")
  )
    .join(" ").replaceAll("\"", "").replaceAll("@_q", '"');
  try {
    std.printf((title + str + "\n").replaceAll("@_c", String.fromCharCode(27)));
  } catch (e) {
    console.error("输出失败", e);
    // console.error("特殊字符", "无法输出,建议使用 std.printf('%s',str) ")
  }
}
