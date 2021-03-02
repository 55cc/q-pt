#include "stdio.h"
#include <unistd.h>
#include <stdlib.h>

static int sys(char *s)
{
	return system(s);
}

// console.log("ls:\n" + open("ls"))
static char *open(char *s)
{
	FILE *fp;
	char buffer[20] = {0}; // malloc(100);
	// memset(buffer, 0, 100);
	fp = popen(s, "r");
	// fseek(fp,0L,SEEK_END);
	int size = 100; //ftell(fp) + 5;
	int over = 0;
	// fseek(fp, 0L, SEEK_SET);
	char *str = malloc(size);
	memset(str, 0, size);
	while (fgets(buffer, sizeof(buffer), fp) != NULL)
	{
		while (strlen(str) + strlen(buffer) >= size)
		{
			size += 100;
			over = 1;
		}
		if (over)
		{
			str = realloc(str, size);
			over = 0;
		}
		strcat(str, buffer);
	}
	// printf("pf %d\n%s\n", size, str);
	pclose(fp);
	return str;
}