// An object that can be called arbitrarily until bankrupt is called
// The entire calling process can be obtained in bankrupt.
// 执行结果与调用过程有关,而非调用函数
// let bankrupt = "bankrupt";
// export 
const freedom = (money) => {
  // let index = 0;
  let queue = [];
  let bankrupt = money.bankrupt;
  let check = money?.check || ((queue) => {
    let t = money?.process;
    let len = queue.length;
    if (len > t.length) {
      throw new Error("调用超过次数");
    }
    len = len - 1;
    let type = (typeof queue[len] === "string") ? 'get' : 'apply';
    // if (len == t.length) {
    // if ()

    if (t[len] != type) {
      throw new Error("调用类型出错");
    }
    if (len == t.length - 1) return true;
    return false;
  });
  // queue.push(Array.from(arg));
  let sayProxy = new Proxy(() => { }, {
    get(_, k) {

      // if (k !== bankrupt) {
      queue.push(k);
      if (check(queue, "get")) {
        // 强制取消后续的代理
        // sayProxy = function (fun) {
        let result = bankrupt(queue);
        queue = [];
        return result;
        // null;
        // fun = null;
        // };
      };
      return sayProxy;
    },
    apply(_1, _2, arg2) {
      // if (!check(queue)) {
      queue.push(Array.from(arg2));
      // } else {
      if (check(queue, "apply")) {
        let result = bankrupt(queue);
        queue = [];
        return result;
      }
      return sayProxy;
    }
  });
  return sayProxy;
}

/* example //*/
// /*
let flag = false;
// random string
let random = (s) => s + ("" + Math.random()).slice(2, 6);
let someone = freedom({
  check: () => flag,
  bankrupt: process => {
    console.log("process", JSON.stringify(process));
    return (s) => console.log("last", s)
  }
}).call("aaa");
let i = 0;
while (Math.random() > i) {
  i += 0.2;
  someone = someone[random("key_")];
  if (Math.random() > 0.5)
    someone = someone(random("arg_"));
}
flag = true;
someone.bankrupt("啊啊");
// ;

//*/
console.log("**************************************")
let last = "last";
let someone2 = freedom({
  process: ["get", "apply"],
  // check: () => flag,
  bankrupt: process => {
    console.log("process", JSON.stringify(process));
    return (s) => console.log(last, s)
  }
});//.call("aaa");
let aaa = someone2.aaa("aaa");
let a = someone2.aaa("bbb");
someone2.ccc("ccc");
let b = someone2.aaa("ddd");
a("啊");
b("bbb");