title:  Flink集成安装至CDH
date:  2021年 5月24日
tags: [flink、CDH]
<!-- password: 7FKBKZrTTTPG2LnC -->
---

 <!--more-->

> 集成flink至CDH中

# CDH集中flink

## 准备工作

需要准备的相关内容有：
1. java （已有）
2. maven （已有）
3. flink 安装包
4. 制作parcel

flink相关下载

```
注：可不需要提前下载

flink下载地址：https://archive.apache.org/dist/flink/flink-1.12.0/flink-1.12.0-bin-scala_2.12.tgz

parcel制作工具下载地址：https://github.com/pkeropen/flink-parcel.git（github提供的工具包）

```


## flink镜像制作

```
cd /root/flink-parcel
## 修改flink-parcel.properties
vim flink-parcel.properties
## 再按图修改CDH支持版本

## 制镜像
./build.sh parcel
## 生成文件夹 FLINK-1.12.4-BIN-SCALA_2.11_build
## 制作yarn形式的csd文件
./build.sh csd_on_yarn
## 生成FLINK_ON_YARN-1.12.4.jar包
## 将FLINK_ON_YARN-1.12.4.jar 挪动至scm-server的 /opt/cloudera/csd 路径下
mv FLINK_ON_YARN-1.12.4.jar  /opt/cloudera/csd/
## FLINK-1.12.4-BIN-SCALA_2.11_build 挪到至之前的/var/www/html/路径下，作为局域网安装源

mv FLINK-1.12.4-BIN-SCALA_2.11_build /var/www/html/flink

cd  /var/www/html/flink
## 创建成repo仓库
createrepo .



```
![2021-05-27-14-28-35](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-28-35.png)


### cloudera manager中添加flink

![2021-05-27-14-38-15](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-38-15.png)
![2021-05-27-14-39-13](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-39-13.png)
![2021-05-27-14-39-49](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-39-49.png)
![2021-05-27-14-40-44](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-40-44.png)

出现flink parcel ，点击下载，分配、激活
![2021-05-27-14-41-04](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-14-41-04.png)

### 添加对应服务
 
这里在上面步骤中生成了 FLINK_ON_YARN-1.12.4.jar后添加到路径后，若在添加服务中看不到内容，则在这里要


```
## 重启cloudera-server
systemctl restart cloudera-scm-server
## 重启agent
systemctl restart cloudera-scm-agent
## 查看日志

tail -f /var/log/cloudera-scm-server/cloudera-scm-server.log

```

经过上述操作后，一般即可在添加服务中找到flink-yarn的添加选项
Tips:
```

这里其实有一些暗坑，就是前面的选择cdh区间的操作中，要注意，即如图示进行配置，我这里是6.3.2，则要配置成如上图才行。不然可能会出现cdh版本适配区间不一致的问题

```

接下来，像正常安装cdh组件一样安装flink-yarn服务

![2021-05-27-15-23-31](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-15-23-31.png)

但要真的让flink服务成功添加还要进行一些参数配置和修改

1. 修改 Kerberos
因为集群中暂时还未集成Kerberos所以这里的配置内容要删除，不然，会出现启动问题。

2. 添加hadoop环境变量

![2021-05-27-15-26-53](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-15-26-53.png)

因为flink1.10后开始应该就不用再集中hadoop的包，而是直接配置hadoop环境变量或从1.11分支上拉项目，自己打包。

大致这里两个参数设置后，服务应该就能正常添加了。

添加成功后的效果
![2021-05-27-15-28-45](http://rgr3ifyzo.sabkt.gdipper.com2021-05-27-15-28-45.png)



















