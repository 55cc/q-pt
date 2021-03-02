import * as std from 'std';
import * as os from 'os';
import { console } from "../../common/common.js";


// var worker;

// let max = 20;
// for (let i = 0; i <= max; i++) {
//   os.setTimeout(function () {
//     console.log("setTimeout", i);
//     if (i == max) {
//       // worker.terminate();
//       next("close");
//       console.log("setTimeout", "end1");
//       os.setTimeout(function () { console.log("setTimeout", "end2"); }, 100);
//     }
//   }, i * 1000);
// }
export function watch(who, callback) {
  let worker = new os.Worker('./event.js');

  function next(run, data) {
    worker.postMessage({ run: run, arg: data || null });
  }
  let ready = () => {
    if (!Array.isArray(who)) who = [who];
    // console.log("who", who);
    who.forEach(w => {
      // console.log("next fun", next);
      next("watch", { src: w.src, flag: w.flag });
    })
  };
  const mess = {
    noop: function () { },
    echo: function (...s) { console.log("echo", ...s) },
    ready: ready, // worker after init
    done: function (...s) {
      // let log = ("echo");
      callback && callback(...s);
    },
    close: () => {
      next("close");
      worker = null;
    }
  }
  function getFun(key) {
    let fun = mess[key];
    if (fun) return fun;
    console.error(key + " not found in worker!");
    return mess.noop;
  }

  worker.onmessage = function (e) {
    let key = e.data.run;
    let fun = getFun(key);
    fun.call(mess, e.data.arg);
  };

  return {
    terminate() {
      mess.close();
    },
    close() {
      mess.close();
    }
  };
}