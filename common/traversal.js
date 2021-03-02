// const maxstep = 10000;
const options = {
  sortkey: true,
  keymap: (k) => k,
  cclref: (node) => node, // 循环引用 Circular reference
  ovmap: (obj) => obj, // object value map ,typeof is object
  bvmap: (v) => v, // basis value map , not include value whose typeof is object
  maxdeep: 10,
  maxstep: 10000,
}

function initValue(d) {
  return Array.isArray(d) ? [] : {};
}

function isObject(v) {
  return (typeof v == "object");
}
function find(value, arr, index) {
  return arr.find((v, i) => i <= index && v.data == value) || null;
}


export function walk(obj, opt) {

  if (typeof obj !== "object") return opt.bvmap(obj);
  opt = { ...options, ...(opt || {}) }
  // return {};

  let arr = [];
  obj = opt.ovmap(obj);
  if (!isObject(obj)) {
    return obj;
  }
  let getKeys = (!!opt.sortkey) ? (data) => Object.keys(data || {}).sort() : (data) => Object.keys(data || {});

  let result = initValue(obj);
  arr.push({
    node: result,
    data: obj,
    deep: 1
  });
  // let deep = 0;
  let i = 0;
  let step = 0;
  while (i < arr.length) {
    let { node, data, deep } = arr[i];
    let key = getKeys(data);
    // if ()
    key.forEach(k => {
      step++;
      let value = data[k];
      let k2 = opt.keymap(k);
      if (deep > opt.maxdeep) {
        node[k2] = opt.outdeep || "...";
        return;
      }
      if (step > opt.maxstep) {
        node[k2] = opt.outstep || "...";
        return;
      }

      let flag = isObject(value);
      flag = [flag, flag && find(value, arr, i)];
      if (!flag[0]) { node[k2] = opt.bvmap(value); return; } // 非obj值
      if (flag[0] && flag[1]) { node[k2] = opt.cclref(flag[1].node); return; } // 循环引用
      value = opt.ovmap(value); // obj 对象, 非循环引用
      if (!isObject(value)) { node[k2] = value; return; }// 转换后非obj

      node[k2] = initValue(value);
      arr.push({
        node: node[k2],
        data: value,
        deep: deep + 1
      });
    });
    i++;
  }
  arr = null;
  return result;
}

// let a = {
//   name: "a",
//   func: () => "fff",
//   b: { c: "c", d: { e: "e", f: [1, 2, 3, 4] } }
// };
// a.self = a;
// console.log("aaa");

// var b = walk(a);
// b.name = "b";
// b.g = [a, 2, 3];
// console.log(b);

// var c = walk([1, 2, 3, 4, a, b], {
//   cclref: () => "circular reference", bvmap: (d) => {
//     if (typeof d == 'function') return d.toString();
//     return d;
//   }
// });
// console.log(JSON.stringify(c));