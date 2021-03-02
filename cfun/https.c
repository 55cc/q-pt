// #include <fcntl.h>
// #include <netdb.h>
// #include <stdio.h>
// #include <errno.h>
// #include <stdlib.h>
// #include <string.h>
// #include <unistd.h>
// #include <sys/types.h>
// #include <sys/socket.h>
// #include <openssl/err.h>
// #include <openssl/ssl.h>
// #include <openssl/rand.h>
// #include <openssl/crypto.h>
#define export static
#define compile "-lssl -lcrypto"

// #define maxLen 512 // Headers 的最大长度

// /*
//  * @Name 			- 创建TCP连接, 并建立到连接
//  * @Parame *server 	- 字符串, 要连接的服务器地址, 可以为域名, 也可以为IP地址
//  * @Parame 	port 	- 端口
//  *
//  * @return 			- 返回对应sock操作句柄, 用于控制后续通信
//  */
// static int client_connect_tcp(char *server, int port)
// {
//   int sockfd;
//   struct hostent *host;
//   struct sockaddr_in cliaddr;

//   sockfd = socket(AF_INET, SOCK_STREAM, 0);
//   if (sockfd < 0)
//   {
//     perror("create socket error");
//     return -1;
//   }

//   if (!(host = gethostbyname(server)))
//   {
//     printf("gethostbyname(%s) error!\n", server);
//     return -2;
//   }

//   bzero(&cliaddr, sizeof(struct sockaddr));
//   cliaddr.sin_family = AF_INET;
//   cliaddr.sin_port = htons(port);
//   cliaddr.sin_addr = *((struct in_addr *)host->h_addr);

//   if (connect(sockfd, (struct sockaddr *)&cliaddr, sizeof(struct sockaddr)) < 0)
//   {
//     perror("[-] error");
//     return -3;
//   }

//   return (sockfd);
// }

// /*
//  * @Name 			- 封装post数据包括headers
//  * @parame *host 	- 主机地址, 域名
//  * @parame  port 	- 端口号
//  * @parame 	page 	- url相对路径
//  * @parame 	len 	- 数据内容的长度
//  * @parame 	content - 数据内容
//  * @parame 	data 	- 得到封装的数据结果
//  *
//  * @return 	int 	- 返回封装得到的数据长度
//  */
// static int post_pack(const char *host, int port, const char *page, int len, const char *content, char *data)
// {
//   /*
//  * Headers 按需更改
//  */
//   char *HttpsPostHeaders = "User-Agent: Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)\r\n"
//                            "Cache-Control: no-cache\r\n"
//                            "Accept: */*\r\n"
//                            "Content-type: application/json\r\n";

//   int re_len = strlen(page) + strlen(host) + strlen(HttpsPostHeaders) + len + maxLen;

//   char *post = NULL;
//   post = malloc(re_len);
//   if (post == NULL)
//   {
//     return -1;
//   }

//   sprintf(post, "POST %s HTTP/1.0\r\n", page);
//   sprintf(post, "%sHost: %s:%d\r\n", post, host, port);
//   sprintf(post, "%s%s", post, HttpsPostHeaders);
//   sprintf(post, "%sContent-Length: %d\r\n\r\n", post, len);
//   sprintf(post, "%s%s", post, content); // 此处需要修改, 当业务需要上传非字符串数据的时候, 会造成数据传输丢失或失败

//   re_len = strlen(post);
//   memset(data, 0, re_len + 1);
//   memcpy(data, post, re_len);

//   free(post);
//   return re_len;
// }

// /*
//  * @Name 		- 	初始化SSL, 并且绑定sockfd到SSL
//  * 					此作用主要目的是通过SSL来操作sock
//  *
//  * @return 		- 	返回已完成初始化并绑定对应sockfd的SSL指针
//  */
// static int ssl_init(int sockfd, SSL *ssl)
// {
//   int re = 0;
//   // SSL *ssl2;
//   SSL_CTX *ctx;
// #if OPENSSL_VERSION_NUMBER < 0x10100000L
//   SSL_library_init();
// #else
//   OPENSSL_init_ssl(0, NULL);
// #endif
//   SSL_load_error_strings();
//   ctx = SSL_CTX_new(SSLv23_client_method());
//   // return NULL;
//   if (ctx == NULL)
//   {
//     return NULL;
//   }

//   ssl = SSL_new(ctx);
//   if (ssl == NULL)
//   {
//     return NULL;
//   }

//   /* 把socket和SSL关联 */
//   re = SSL_set_fd(ssl, sockfd);
//   if (re == 0)
//   {
//     SSL_free(ssl);
//     return NULL;
//   }

//   /*
//      * 经查阅, WIN32的系统下, 不能很有效的产生随机数, 此处增加随机数种子
//      */
//   RAND_poll();
//   while (RAND_status() == 0)
//   {
//     unsigned short rand_ret = rand() % 65536;
//     RAND_seed(&rand_ret, sizeof(rand_ret));
//   }

//   /*
//      * ctx使用完成, 进行释放
//      */
//   SSL_CTX_free(ctx);

//   return NULL;
// }

// /*
//  * @Name 			- 通过SSL建立连接并发送数据
//  * @Parame 	*ssl 	- SSL指针, 已经完成初始化并绑定了对应sock句柄的SSL指针
//  * @Parame 	*data 	- 准备发送数据的指针地址
//  * @Parame 	 size 	- 准备发送的数据长度
//  *
//  * @return 			- 返回发送完成的数据长度, 如果发送失败, 返回 -1
//  */
// static int ssl_send(SSL *ssl, const char *data, int size)
// {
//   int re = 0;
//   int count = 0;

//   re = SSL_connect(ssl);

//   if (re != 1)
//   {
//     return -1;
//   }

//   while (count < size)
//   {
//     re = SSL_write(ssl, data + count, size - count);
//     if (re == -1)
//     {
//       return -2;
//     }
//     count += re;
//   }

//   return count;
// }

// /*
//  * @Name 			- SSL接收数据, 需要已经建立连接
//  * @Parame 	*ssl 	- SSL指针, 已经完成初始化并绑定了对应sock句柄的SSL指针
//  * @Parame  *buff 	- 接收数据的缓冲区, 非空指针
//  * @Parame 	 size 	- 准备接收的数据长度
//  *
//  * @return 			- 返回接收到的数据长度, 如果接收失败, 返回值 <0
//  */
// static int ssl_recv(SSL *ssl, char *buff, int size)
// {
//   int i = 0; // 读取数据取换行数量, 即判断headers是否结束
//   int re;
//   int len = 0;
//   char headers[maxLen];

//   if (ssl == NULL)
//   {
//     return -1;
//   }

//   // Headers以换行结束, 此处判断头是否传输完成
//   while ((len = SSL_read(ssl, headers, 1)) == 1)
//   {
//     if (i < 4)
//     {
//       if (headers[0] == '\r' || headers[0] == '\n')
//       {
//         i++;
//         if (i >= 4)
//         {
//           break;
//         }
//       }
//       else
//       {
//         i = 0;
//       }
//     }
//     //printf("%c", headers[0]);		// 打印Headers
//   }

//   len = SSL_read(ssl, buff, size);
//   return len;
// }

// static int https_post(char *host, int port, char *url, const char *data, int dsize, char *buff, int bsize)
// {
//   SSL *ssl;
//   int re = 0;
//   int sockfd;
//   int data_len = 0;
//   int ssize = dsize + maxLen; // 欲发送的数据包大小

//   char *sdata = malloc(ssize);
//   if (sdata == NULL)
//   {
//     return -1;
//   }

//   // 1、建立TCP连接
//   sockfd = client_connect_tcp(host, port);
//   if (sockfd < 0)
//   {
//     free(sdata);
//     return -2;
//   }

//   // 2、SSL初始化, 关联Socket到SSL
//   // ssl =
//   ssl_init(sockfd, ssl);
//   if (ssl == NULL)
//   {
//     free(sdata);
//     close(sockfd);
//     return -3;
//   }

//   // 3、组合POST数据
//   data_len = post_pack(host, port, url, dsize, data, sdata);

//   // 4、通过SSL发送数据
//   re = ssl_send(ssl, sdata, data_len);
//   if (re < 0)
//   {
//     free(sdata);
//     close(sockfd);
//     SSL_shutdown(ssl);
//     return -4;
//   }

//   // 5、取回数据
//   int r_len = 0;
//   r_len = ssl_recv(ssl, buff, bsize);
//   if (r_len < 0)
//   {
//     free(sdata);
//     close(sockfd);
//     SSL_shutdown(ssl);
//     return -5;
//   }

//   // 6、关闭会话, 释放内存
//   free(sdata);
//   close(sockfd);
//   SSL_shutdown(ssl);
//   ERR_free_strings();

//   return r_len;
// }

// static int request(int i)
// {

//   int Port = 443;
//   char *Host = "www.wangsansan.com";
//   char *Page = "/test/HttpsPostTest.php";
//   char *Data = "{\"A\":\"111\", \"B\":\"222\"}"; // 对应字符串 - {"A":"111", "B":"222"}

//   int read_len = 0;
//   char buff[512] = {0};

//   read_len = https_post(Host, Port, Page, Data, strlen(Data), buff, 512);
//   if (read_len < 0)
//   {
//     printf("Err = %d \n", read_len);
//     return read_len;
//   }

//   printf("==================== Recv [%d] ==================== \n", read_len);
//   printf("%s\n", buff);

//   return i;
// }

#include <stdio.h>
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <openssl/bio.h>

// #define APIKEY "YOUR_API_KEY"
#define HOST "getman.cn"
#define PORT "443"

export int request()
{

  //
  //  Initialize the variables
  //
  BIO *bio;
  SSL *ssl;
  SSL_CTX *ctx;

  //
  //   Registers the SSL/TLS ciphers and digests.
  //
  //   Basically start the security layer.
  //
  SSL_library_init();

  //
  //  Creates a new SSL_CTX object as a framework to establish TLS/SSL
  //  or DTLS enabled connections
  //
  ctx = SSL_CTX_new(SSLv23_client_method());

  //
  //  -> Error check
  //
  if (ctx == NULL)
  {
    printf("Ctx is null\n");
  }

  //
  //   Creates a new BIO chain consisting of an SSL BIO
  //
  bio = BIO_new_ssl_connect(ctx);

  //
  //  Use the variable from the beginning of the file to create a
  //  string that contains the URL to the site that you want to connect
  //  to while also specifying the port.
  //
  BIO_set_conn_hostname(bio, HOST ":" PORT);

  //
  //   Attempts to connect the supplied BIO
  //
  if (BIO_do_connect(bio) <= 0)
  {
    printf("Failed connection\n");
    return 1;
  }
  else
  {
    printf("Connected\n");
  }

  //
  //  The bare minimum to make a HTTP request.
  //
  // https://getman.cn/mock/abc?
  char *write_buf = "GET /mock/abc HTTP/1.1\r\n"
                    "Host: " HOST "\r\n"
                    // "Authorization: Basic " APIKEY "\r\n"
                    "Connection: close\r\n"
                    "\r\n";

  //
  //   Attempts to write len bytes from buf to BIO
  //
  if (BIO_write(bio, write_buf, strlen(write_buf)) <= 0)
  {
    //
    //  Handle failed writes here
    //
    if (!BIO_should_retry(bio))
    {
      // Not worth implementing, but worth knowing.
    }

    //
    //  -> Let us know about the failed writes
    //
    printf("Failed write\n");
  }

  //
  //  Variables used to read the response from the server
  //
  int size;
  char buf[1024];

  //
  //  Read the response message
  //
  for (int i = 0;; i++)
  {
    //
    //  Get chunks of the response 1023 at the time.
    //
    size = BIO_read(bio, buf, 1023);

    //
    //  If no more data, then exit the loop
    //
    if (size <= 0)
    {
      break;
    }

    //
    //  Terminate the string with a 0, to let know C when the string
    //  ends.
    //
    buf[size] = 0;

    //
    //  ->  Print out the response
    //
    printf("\33[31mresponse\33[0m\n");
    printf("%s", buf);
    printf("\33[31m%d\33[0m", i);
  }

  //
  //  Clean after ourselves
  //
  BIO_free_all(bio);
  SSL_CTX_free(ctx);

  return 0;
}