```
## 文件的输入输出
import random
import string
import os
import sys


def demo1():
    f = open("d.txt", "w")
    f.write("demo")
    f.flush()
    f.close()
    f2 = open("d.txt", "r")
    str = f2.readline()
    f2.close()
    print(str, end="")


def str_generate():
    str = ""
    for i in range(100):
        value = ''.join(random.sample(string.ascii_letters + string.digits, 8))
        str += value + "\n"
    return str


def formatTime(atime):
    import time
    return time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(atime))

def demo2():
    ##分块函数
    fout = open("d2.txt", "wt")

    str = str_generate()
    size = len(str)
    offset = 0
    chunk = 100

    while True:
        if offset > size:
            break
        fout.write(str[offset: offset + chunk])
        offset += chunk
    fout.flush()
    fout.close()
    # file_size = os.path.getsize("./d2.txt")
    fileinfo=os.stat("d2.txt")
    file_size=fileinfo.st_size
    f_mtime=fileinfo.st_mtime
    print(file_size)
    print(formatTime(f_mtime))


if __name__ == '__main__':
    demo2()

```

