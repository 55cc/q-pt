
#include "stdio.h"
#include <unistd.h>
#include <stdlib.h>
#define export static

export char *readLine(char *s, int n)
{
	if (!n)
	{
		n = 120;
	}
	char c[2] = {0};
	char *str = malloc(n + 8);
	memset(str, 0, n + 8);
	printf("%s", s);
	scanf("%[^\n]%c", str, c);
	return str;
}