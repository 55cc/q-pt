#include "quickjs.h"
#include <stdio.h>

#define export static

export int hello(char *s)
{
  return printf("hello, %s\n", s);
}

int count = 0;

export int echo()
{
  printf("echo %d\n", ++count);
  return 0;
}

export int add(int a, int b)
{
  return a + b;
}