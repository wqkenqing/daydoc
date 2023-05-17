##  文件操作

### 操作函数

**打开文件**

1. FILE * fopen ( const char * filename, const char * mode );

```c
//首先定义文件指针：fp
FILE *fp;
//用fopen()函数卡开文件， r——>以只读方式打开
fp = fopen("test.txt", "r"); //没有指定文件路径，则默认为当前工作目录。

```

**fclose函数**

```
//fp 为文件指针，关闭文件代码如下：
fclose(fp);
```

![在这里插入图片描述](http://img.wqkenqing.ren/typora_img/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5pyo5ZSQ5p6d,size_20,color_FFFFFF,t_70,g_se,x_16.png)



| 功能           | 函数名  |
| -------------- | ------- |
| 字符输入函数   | fgetc   |
| 字符输出函数   | fputc   |
| 文本行输入函数 | gets    |
| 文本行输出函数 | fputs   |
| 格式化输入函数 | fscanf  |
| 格式化输出函数 | fprintf |
| 二进制输入     | fread   |
| 二进制输出     | fwrite  |

```c
#include <stdio.h>
int main()
{
    FILE* fp;
    fp = fopen("D:\\codeFile\\test1.txt", "r");
    if (fp != NULL)
    {
        //feof(file stream )文件指针到达文件末尾
        while (!feof(fp)) //读文件
            printf("%c", fgetc(fp));
    }
    else
        printf("fail to open! \n");
    fclose(fp);
    return 0;
}
```

**c语言中gets ，getschar 和fgets 的用法及三者之间的差别，还有scanf**

gets——从标准输入接收一串字符，遇到'\n'时结束，但不接收'\n'，把 '\n'留存输入缓冲区；把接收的一串字符存储在形式参数指针指向的空间，并在最后自动添加一个'\0'。
getchar——从标准输入接收一个字符返回，多余的字符全部留在输入缓冲区。
fgets——从文件或标准输入接收一串字符，遇到'\n'时结束，把'\n'也作为一个字符接收；把接收的一串字符存储在形式参数指针指向的空间，并在'\n'后再自动添加一个'\0'。

简单说，gets是接收一个不以'\n'结尾的字符串，getchar是接收任何一个字符(包括'\n')，fgets是接收一个以'\n'结尾的字符串。

scanf( )函数和gets( )函数都可用于输入字符串，但在功能上有区别。

gets可以接收空格。

scanf遇到空格、回车和Tab键都会认为输入结束，所有它不能接收空格







