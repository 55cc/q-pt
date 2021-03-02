#include <stdio.h>
#include <stdlib.h>
#include <string.h> //strlen
#include <sys/socket.h>
#include <arpa/inet.h> //inet_addr
#include <netdb.h>
#include <errno.h>
#define export static

export int http(char *hostname, int port, char *message)
{
  int bufferlen = 1024;
  int socket_desc;
  struct sockaddr_in server;
  // char *message;

  //Create socket
  socket_desc = socket(AF_INET, SOCK_STREAM, 0);
  if (socket_desc == -1)
  {
    printf("Could not create socket");
  }

  char ip[20] = {0};
  // char *hostname = "www.cnblogs.com";
  struct hostent *hp;
  if ((hp = gethostbyname(hostname)) == NULL)
  {
    return 1;
  }

  strcpy(ip, inet_ntoa(*(struct in_addr *)hp->h_addr_list[0]));

  server.sin_addr.s_addr = inet_addr(ip);
  server.sin_family = AF_INET;
  server.sin_port = htons(port);

  //Connect to remote server
  if (connect(socket_desc, (struct sockaddr *)&server, sizeof(server)) < 0)
  {
    printf("connect error： %s", errno);
    return 1;
  }

  puts("Connected\n");

  //Send some data
  //http 协议
  // message = "GET / HTTP/1.1\r\nHost: " + hostname + "\r\n\r\n"; //"GET / HTTP/1.1\r\nHost: www.cnblogs.com\r\n\r\n";

  //向服务器发送数据
  if (send(socket_desc, message, strlen(message), 0) < 0)
  {
    puts("Send failed");
    return 1;
  }
  puts("Data Send\n");

  struct timeval timeout = {3, 0};
  setsockopt(socket_desc, SOL_SOCKET, SO_RCVTIMEO, (char *)&timeout, sizeof(struct timeval));

  //Receive a reply from the server
  //loop
  int size_recv, total_size = 0;
  char chunk[bufferlen];
  int flag = 1;
  while (flag)
  {

    memset(chunk, 0, bufferlen); //clear the variable
    //获取数据
    size_recv = recv(socket_desc, chunk, bufferlen, 0);
    // printf("\33[31mrecv size %d %d\33[0m\n", size_recv, flag);
    // flag--;
    if (size_recv == -1)
    {
      if (errno == EWOULDBLOCK || errno == EAGAIN)
      {
        printf("recv timeout ...\n");
        break;
      }
      else if (errno == EINTR)
      {
        printf("interrupt by signal...\n");
        continue;
      }
      else if (errno == ENOENT)
      {
        printf("recv RST segement...\n");
        break;
      }
      else
      {
        printf("unknown error: %d\n", errno);
        exit(1);
      }
    }
    else if (size_recv == 0)
    {
      printf("peer closed ...\n");
      break;
    }
    else
    {

      total_size += size_recv;
      printf("\33[31mrecv size %d times:%d\33[0m", size_recv, flag);
      printf("%s", chunk);
      // Content-Length
      // \r\n0\r\n
      // if (size_recv < 512)
      // {
      // flag = 0;
      // }
    }
    flag++;
  }

  printf("Reply received, total_size : %d bytes , times:%d\n", total_size, flag);
  return 0;
}

/****

GET /path?query_string HTTP/1.0\r\n
\r\n

POST: What would normally be in the query string is in the body of the message instead.
 Because of this the header needs to include the Content-Type: and Content-Length: attributes as well as the POST command. A sample message could be:

POST /path HTTP/1.0\r\n
Content-Type: text/plain\r\n
Content-Length: 12\r\n
\r\n
query_string
 
*/