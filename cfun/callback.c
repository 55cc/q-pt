#include "quickjs.h"
#include <stdio.h>

#define export static

export char *callback(JSContext *ctx, char *s, JSValue fun)
{
  printf("callback %s\n%s\n----\n", s, fun);

  char *argument = "[0, 2, \"somearg\"]";
  JSValue arg = JS_ParseJSON(ctx, argument, strlen(argument), NULL);

  JS_Call(ctx, fun, JS_NULL, 1, &arg);

  argument = "[0, 3, \"somearg\"]";
  arg = JS_ParseJSON(ctx, argument, strlen(argument), NULL);
  JS_Call(ctx, fun, JS_NULL, 1, &arg);
  return "hello2";
}
