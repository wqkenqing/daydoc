# Dockerfile基础

```
Dockerfile用于指定docker build 指令时执行时的动作与资源划分等,如指定分配内存大小,cpu个数等.从而构成相应的镜像

```

## 详细指令

![docker详细指令](http://img.wqkenqing.ren/5aaf3a25b3434c7b1ec0cd5b41b2be1a.png)

如上图即docker主要的指令与作用


Dockerfile由多条指令组成,每条指令在编译镜像时执行相应的程序完成某些功能,指令+参数组成，以逗号分隔，#作为注释起始符，虽说指令不区分大小写，但是一般指令使用大些，参数使用小写.



### 指令：FROM

功能描述：设置基础镜像
语法：FROM < image>[:< tag> | @< digest>]
提示：镜像都是从一个基础镜像（操作系统或其他镜像）生成，可以在一个Dockerfile中添加多条FROM指令，一次生成多个镜像
注意：如果忽略tag选项，会使用latest镜像

### 指令：MAINTAINER

功能描述：设置镜像作者
语法：MAINTAINER < name>


### 指令：RUN

功能描述：
语法：RUN < command>
          RUN [“executable”,”param1”,”param2”]
提示：RUN指令会生成容器，在容器中执行脚本，容器使用当前镜像，脚本指令完成后，Docker Daemon会将该容器提交为一个中间镜像，供后面的指令使用
补充：RUN指令第一种方式为shell方式，使用/bin/sh -c < command>运行脚本，可以在其中使用\将脚本分为多行
          RUN指令第二种方式为exec方式，镜像中没有/bin/sh或者要使用其他shell时使用该方式，其不会调用shell命令
例子：RUN source $HOME/.bashrc;\
          echo $HOME

          RUN [“/bin/bash”,”-c”,”echo hello”]

          RUN [“sh”,”-c”,”echo”,”$HOME”] 使用第二种方式调用shell读取环境变量

### 指令：CMD

功能描述：设置容器的启动命令
语法：CMD [“executable”,”param1”,”param2”]
          CMD [“param1”,”param2”]
          CMD < command>
提示：CMD第一种、第三种方式和RUN类似，第二种方式为ENTRYPOINT参数方式，为entrypoint提供参数列表
注意：**Dockerfile中只能有一条CMD命令，如果写了多条则最后一条生效**

### 指令：LABEL
功能描述：设置镜像的标签
延伸：镜像标签可以通过docker inspect查看
格式：LABEL < key>=< value> < key>=< value> …
提示：不同标签之间通过空格隔开
注意：每条指令都会生成一个镜像层，Docker中镜像最多只能有127层，如果超出Docker Daemon就会报错，如LABEL ..=.. <假装这里有个换行> LABEL ..=..合在一起用空格分隔就可以减少镜像层数量，同样，可以使用连接符\将脚本分为多行镜像会继承基础镜像中的标签，如果存在同名标签则会覆盖

### 指令：EXPOSE
功能描述：设置镜像暴露端口，记录容器启动时监听哪些端口
语法：EXPOSE < port> < port> …
延伸：镜像暴露端口可以通过docker inspect查看
提示：容器启动时，Docker Daemon会扫描镜像中暴露的端口，如果加入-P参数，Docker Daemon会把镜像中所有暴露端口导出，并为每个暴露端口分配一个随机的主机端口（暴露端口是容器监听端口，主机端口为外部访问容器的端口）
注意：EXPOSE只设置暴露端口并不导出端口，只有启动容器时使用-P/-p才导出端口，这个时候才能通过外部访问容器提供的服务

### 指令：ENV
功能描述：设置镜像中的环境变量
语法：ENV < key>=< value>…|< key> < value>
注意：环境变量在整个编译周期都有效，第一种方式可设置多个环境变量，第二种方式只设置一个环境变量
提示：通过${变量名}或者 $变量名使用变量，使用方式${变量名}时可以用${变量名:-default} ${变量名:+cover}设定默认值或者覆盖值 ENV设置的变量值在整个编译过程中总是保持不变的

### 指令：ADD
功能描述：复制文件到镜像中
语法：ADD < src>… < dest>|[“< src>”,… “< dest>”]
注意：当路径中有空格时，需要使用第二种方式
          当src为文件或目录时，Docker Daemon会从编译目录寻找这些文件或目录，而dest为镜像中的绝对路径或者相对于WORKDIR的路径
提示：src为目录时，复制目录中所有内容，包括文件系统的元数据，但不包括目录本身
          src为压缩文件，并且压缩方式为gzip,bzip2或xz时，指令会将其解压为目录
          如果src为文件，则复制文件和元数据
          如果dest不存在，指令会自动创建dest和缺失的上级目录

### 指令：COPY
功能描述：复制文件到镜像中
语法：COPY < src>… < dest>|[“< src>”,… “< dest>”]
提示：指令逻辑和ADD十分相似，同样Docker Daemon会从编译目录寻找文件或目录，dest为镜像中的绝对路径或者相对于WORKDIR的路径

### 指令：ENTRYPOINT
功能描述：设置容器的入口程序
语法：ENTRYPOINT [“executable”,”param1”,”param2”]
          ENTRYPOINT command param1 param2（shell方式）
提示：入口程序是容器启动时执行的程序，docker run中最后的命令将作为参数传递给入口程序
          入口程序有两种格式：exec、shell，其中shell使用/bin/sh -c运行入口程序，此时入口程序不能接收信号量
          当Dockerfile有多条ENTRYPOINT时只有最后的ENTRYPOINT指令生效
          如果使用脚本作为入口程序，需要保证脚本的最后一个程序能够接收信号量，可以在脚本最后使用exec或gosu启动传入脚本的命令
注意：通过shell方式启动入口程序时，会忽略CMD指令和docker run中的参数
          为了保证容器能够接受docker stop发送的信号量，需要通过exec启动程序；如果没有加入exec命令，则在启动容器时容器会出现两个进程，并且使用docker stop命令容器无法正常退出（无法接受SIGTERM信号），超时后docker stop发送SIGKILL，强制停止容器
例子：FROM ubuntu <换行> ENTRYPOINT exec top -b

### 指令：VOLUME
功能描述：设置容器的挂载点
语法：VOLUME [“/data”]
          VOLUME /data1 /data2
提示：启动容器时，Docker Daemon会新建挂载点，并用镜像中的数据初始化挂载点，可以将主机目录或数据卷容器挂载到这些挂载点

### 指令：USER

功能描述：设置RUN CMD ENTRYPOINT的用户名或UID
语法：USER < name>

### 指令：WORKDIR

功能描述：设置RUN CMD ENTRYPOINT ADD COPY指令的工作目录
语法：WORKDIR < Path>
提示：如果工作目录不存在，则Docker Daemon会自动创建
          Dockerfile中多个地方都可以调用WORKDIR，如果后面跟的是相对位置，则会跟在上条WORKDIR指定路径后（如WORKDIR /A   WORKDIR B   WORKDIR C，最终路径为/A/B/C

### 指令：ARG

功能描述：设置编译变量
语法：ARG < name>[=< defaultValue>]
注意：ARG从定义它的地方开始生效而不是调用的地方，在ARG之前调用编译变量总为空，在编译镜像时，可以通过docker build –build-arg < var>=< value>设置变量，如果var没有通过ARG定义则Daemon会报错
          可以使用ENV或ARG设置RUN使用的变量，如果同名则ENV定义的值会覆盖ARG定义的值，与ENV不同，ARG的变量值在编译过程中是可变的，会对比使用编译缓存造成影响（ARG值不同则编译过程也不同）
例子：ARG CONT_IMAG_VER <换行> RUN echo $CONT_IMG_VER
          ARG CONT_IMAG_VER <换行> RUN echo hello
          当编译时给ARG变量赋值hello，则两个Dockerfile可以使用相同的中间镜像，如果不为hello，则不能使用同一个中间镜像



### CMD ENTRYPOINT和RUN的区别
RUN指令是设置编译镜像时执行的脚本和程序，镜像编译完成后，RUN指令的生命周期结束  
容器启动时，可以通过CMD和ENTRYPOINT设置启动项，其中CMD叫做容器默认启动命令，如果在docker run命令末尾添加command，则会替换镜像中CMD设置的启动程序；ENRTYPOINT叫做入口程序，不能被docker run命令末尾的command替换，而是将command当作字符串，传递给ENTRYPOINT作为参数
