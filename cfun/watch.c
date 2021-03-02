
#include "quickjs.h"
// watch
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <sys/types.h>
#include <linux/inotify.h>
#define export static

#define EVENT_SIZE (sizeof(struct inotify_event))
#define EVENT_BUF_LEN (1024 * (EVENT_SIZE + 16))

export int init()
{
  int fd = inotify_init();
  /*checking for error*/
  if (fd < 0)
  {
    perror("inotify_init");
    return -1;
  }
  return fd;
}

export int addWatch(int fd, char *path, uint flag)
{
  // printf("addWatch %s\n", path);
  // IN_CREATE | IN_DELETE | IN_ACCESS | IN_MODIFY | IN_ATTRIB | IN_CLOSE_WRITE);
  int wd = inotify_add_watch(fd, path, flag);
  return wd;
}

export int getEvent(JSContext *ctx, int fd, JSValue fun)
{
  int i = 0;

  char buffer[EVENT_BUF_LEN];

  int length = read(fd, buffer, EVENT_BUF_LEN);

  if (length < 0)
  {
    return 0;
  }

  while (i < length)
  {
    struct inotify_event *event = (struct inotify_event *)&buffer[i];
    if (event->len > 0)
    {
      char argument[100] = {0};
      sprintf(&argument, "{\"name\":\"%s\",\"type\":%d}", event->name, event->mask);
      JSValue arg = JS_ParseJSON(ctx, argument, strlen(argument), NULL);
      JS_Call(ctx, fun, JS_NULL, 1, &arg);
      break;
    }
    i += EVENT_SIZE + event->len;
  }

  return 0;
  // return buffer;
}

export int rm_watch(int fd, int wd)
{
  inotify_rm_watch(fd, wd);
  return 0;
}
export int close_watch(int fd)
{
  close(fd);
  return 0;
}
