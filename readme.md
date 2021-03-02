q-pt
=========================

#### 简介
-------------------------
基于 QuickJS Javascript 引擎,帮助您更简单的使用QuickJS运行js

功能:

  1.简化了c functions的拓展方式

  2.添加文件监控支持

  3.http,https支持

  4.字符编码支持

  5.终端输入输出完善


#### run
-----

1. install quickjs

2. `./run.sh`

example: `./run.sh example.js`


#### c functions 简化
----
对quick js 自带的拓展方式,做了简化,不用再写大量的胶水代码.

简化后的代码:
hello.c:
```
#include <stdio.h>

#define export static
// 使用export标记需要导出的函数
export int hello(char *s)
{
  return printf("hello, %s\n", s);
}

```
在js中使用:

```
// hello world
import { hello } from "./clib/hello.so";
hello("world");
```
更多样例见 cfun 目录 和 example.js