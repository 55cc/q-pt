import * as os from "os";

export function setInterval(callback, time) {
  let tick = {};
  let fun = (function () {
    tick.id = os.setTimeout(function () {
      if (!tick.end) {
        callback()
        fun();
      } else {
        fun = null;
        callback = null;
      }
    }, time / 1);
  });
  fun();
  return tick;
}
export function setTimeout(callback, time) {
  let tick = {};
  let fun = (function () {
    tick.id = os.setTimeout(function () {
      if (!tick.end) {
        callback();
      } else {
        callback = null;
      }
    }, time / 1);
  });
  fun();
  // fun = null;
  return tick;
}
export function clearInterval(tick) {
  os.clearTimeout(tick.id);
  tick.end = true;
}
export var clearTimeout = clearInterval;
