#include <stdio.h>


int Add(int a ,int b ){
	return a+b;
}

int main()
{
    /* 我的第一个 C 程序 */
    printf("please enter your number!");
    int x, y=0;
    scanf("%d%d",&x,&y);
    int c=Add(x,y);
    printf("this reason is  %d",c);
    return 0;
}