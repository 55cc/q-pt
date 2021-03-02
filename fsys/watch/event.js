import * as std from 'std';
import * as os from 'os';
import { console, setTimeout, setInterval, clearInterval } from "../../common/common.js";
import { wt } from "./wt.js";
import { init, addWatch, getEvent, rm_watch, close_watch } from "../../clib/watch.so";

// worker.js
let self = os.Worker.parent;
function next(run, data) {
  self.postMessage({ run: run, arg: data || null });
}

let fd;
let wd;
let tick;
let mess = {
  noop: () => { },
  echo: (...s) => console.log(...s),
  watch: (d) => {
    console.log("watch start", d)
    let fun = (s) => {
      s.src = d.src;
      next("done", s);
    };
    fd = init();
    let flag = (d.flag || ["IN_MODIFY"]).map(f => wt[f]).reduce((p, c) => (p | c), 0);

    wd = addWatch(fd, d.src, flag);
    tick = setInterval(function () {
      // console.log("tick");
      // if (fd == -1) { return clearInterval(tick); }
      getEvent(fd, fun);
    }, 100);
    // let max = 2000000;
    // for (let i = 0; i <= max; i++) {
    // os.setTimeout(function () {
    // if (i % 100000 == 0)
    // next("echo", d + " " + i);
    // if (i == max) mess.close();
    // }, i * 100);
    // }
    // console.success("watch start", d);
    // handle = watch(d.src, ["IN_CREATE", "IN_DELETE", "IN_ACCESS", "IN_MODIFY"], function (e) {
    //   console.success("watch", e);
    //   next("echo", e);
    // });

  },
  close: () => {
    // (self.close || 
    // handle && handle.close();
    clearInterval(tick);
    rm_watch(fd, wd);
    close_watch(fd);
    fd = -1;
    self = null;
    // std.kill();
  }
}
function getFun(key) {
  let fun = mess[key];
  if (fun) return fun;
  console.error(key + " not found in worker!");
  return mess.noop;
}
self.onmessage = function (e) {
  // console.error("onmessage", e)
  let key = e.data.run;
  let fun = getFun(key);
  fun(e.data.arg);
};

next("ready");