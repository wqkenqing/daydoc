//
// Created by 王奎清 on 2022/11/4.
//

#include <stdio.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/types.h>
#include <sys/stat.h>

int main(void) {

    char buf[1024];
int fh,len;
 fh= open("/Users/kuiqwang/Desktop/c_study/demo.txt",O_RDONLY);
    printf("res is %d", fh);
while (len=read(fh,buf,sizeof(buf))>0)
{
	printf("%d",len);
}

    return 0;
}