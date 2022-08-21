title:  CDH基础环境部署
date:  2021年 4月25日
tags: [cdh,cm,数据中心]
password: 7FKBKZrTTTPG2LnC

---
进行CDH基础环境部署

 <!--more-->

 ## 基础准备
#### 时区更改
pssh -h "timedatectl set-timezone Asia/Shanghai"
### 各服务资源的免密钥登录

服务器资源参见 [数据中心服务资源](../数据中心服务资源/数据中心服务资源.md)


#### 修改hostname
done

#### 配置免密钥登录

done

### 切换yum源,这里设置为阿里源

```bash
cd /etc/yum.repos.d/

mv CentOS-Base.repo CentOS-Base.repo.backup

wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

yum clean all

yum makecache

```


```bash
#1.安装vim编辑器 
yum install -y vim

#2.安装lrzsz文件传输工具 
yum -y install lrzsz

#3.安装wget文件下载工具 
yum -y install wget

#4.安装netstat，查看端口监听状况：

yum -y install net-tools

netstat -ntlp | grep 端口号

#5.下载unzip解压工具，解压命令：

yum install -y unzip zip

uzip 压缩包.zip -d 解压目录
```

### 配置pssh 批操作工具

```
wget https://pypi.python.org/packages/60/9a/8035af3a7d3d1617ae2c7c174efa4f154e5bf9c24b36b623413b38be8e4a/pssh-2.3.1.tar.gz

tar xf pssh-2.3.1.tar.gz -C /usr/local/pssh/

cd /usr/local/pssh/pssh-2.3.1/

python setup.py install

```



### 配置tod别名

```
echo "alias tog='cd /data/gitfiles/" >>  ~/.bashrc
echo "alias tod='cd /data/" >>  ~/.bashrc
```

### 安装mysql

```bash
## 创建mysql镜像的存放文件夹

mkdir -p /data/soft_install/mysql_rpm

## wget 获取mysql rpm 文件

wget https://repo.mysql.com//mysql80-community-release-el7-3.noarch.rpm

## 安装mysql源
yum localinstall -y mysql80-community-release-el7-3.noarch.rpm
## 3.检查MySQL源是否安装成功，此时查到的安装包的版本都是mysql5.8版本的 
yum repolist enabled | grep "mysql.*-community.*"

## 4.修改yum源配置文件，获取自己想要安装的mysql5.7版本

##  #5.检查MySQL源是否选择的是5.7版本，此时查到的安装包的版本都是mysql5.7版本的
yum repolist enabled | grep "mysql.*-community.*"

##安装mysql
yum -y install mysql-community-server
## 启动mysql服务

```
![2021-04-25-14-30-38](http://rgr3ifyzo.sabkt.gdipper.com2021-04-25-14-30-38.png)

### 启动mysql服务

``` bash
#1.临时启动mysql服务 
systemctl start mysqld

#2.开机启动mysql服务 
systemctl enable mysqld

#3.查看MySQL的启动状态 
systemctl status mysqld

#4.查看mysql进程是否正常开启 
ps -le | grep mysqld
```
### 修改mysql中root本地登录密码

```bash
grep 'temporary password' /var/log/mysqld.log

# temp password
k2PqXCarz-BS
# 登录
mysql -u root -p
再用temp密码登录

## 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'ER62-fP()hs1OoFW>';

###重启使密码生效
systemctl restart mysqld
```
![2021-04-25-14-35-25](http://rgr3ifyzo.sabkt.gdipper.com2021-04-25-14-35-25.png)

### 允许root用户远程登录

```bash
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION; 
FLUSH PRIVILEGES;


## 指定特定的IP，开启root用户远程连接 
GRANT ALL PRIVILEGES ON *.* TO 'root'@'指定的IP' IDENTIFIED BY 'root用户的密码' WITH GRANT OPTION; 
## 一般为了安全起见，会创建专用的远程访问用户
 GRANT ALL PRIVILEGES ON *.* TO 'dadeity'@'%' IDENTIFIED BY 'daDeity@163.com' WITH GRANT OPTION;

```
### 创建CDH源数据库、用户、服务的数据库

```bash 
CREATE DATABASE scm DEFAULT CHARACTER SET utf8; 
CREATE USER 'scm'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; 
GRANT ALL PRIVILEGES ON scm.* TO 'scm'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; 
GRANT ALL PRIVILEGES ON *.* TO 'scm'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

CREATE DATABASE amon DEFAULT CHARACTER SET utf8; CREATE USER 'amon'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON amon.* TO 'amon'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON *.* TO 'amon'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

CREATE DATABASE hive DEFAULT CHARACTER SET utf8; CREATE USER 'hive'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON hive.* TO 'hive'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON *.* TO 'hive'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

CREATE DATABASE hue DEFAULT CHARACTER SET utf8; CREATE USER 'hue'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON hue.* TO 'hue'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON *.* TO 'hue'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

CREATE DATABASE oozie DEFAULT CHARACTER SET utf8; CREATE USER 'oozie'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON oozie.* TO 'oozie'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON *.* TO 'oozie'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

CREATE DATABASE sentry DEFAULT CHARACTER SET utf8; CREATE USER 'sentry'@'%'IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON sentry.* TO 'sentry'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>'; GRANT ALL PRIVILEGES ON *.* TO 'sentry'@'%' IDENTIFIED BY 'ER62-fP()hs1OoFW>' WITH GRANT OPTION;

## 刷新mysql的权限列表 
FLUSH PRIVILEGES;

## 查看用户
##设置密码等级
#密码强度设为最低等级
set global validate_password_policy=0; 
#密码允许最小长度为2
set global validate_password_length=2; 
set global validate_password_number_count=0; 

#更新授权表，生效
flush privileges;                      

```

### 创建本地YUM仓库

``` bash
##安装createrepo包
yum install -y createrepo

cd /root/cloudera_install/cm6.3.1
createrepo . 
 cd /root/cloudera_install/cdh6.3.2
createrepo . 

## 创建/var/www/html 地址
mkdir -p /var/www/html

## 修改cdh6.3.2中的校验文件
CDH-6.3.2-1.cdh6.3.2.p0.1605554-el6.parcel.sha256 CDH-6.3.2-1.cdh6.3.2.p0.1605554- el6.parcel.sha
##移动文件至/var/www/html
mv cdh6.3.2 /var/www/html
mv cm6.3.1 /var/www/html
#安装httpd服务 
yum install -y httpd 
#启动httpd服务 
systemctl start httpd 
#设置httpd服务开机启动 
systemctl enable httpd 
#查看httpd服务是否启动
 ps -ef | grep httpd

vim /etc/yum.repos.d/os.repo

#以下为文件内容 
[osrepo] name=os_repo 
baseurl=http://hadoop01.baicdt.com/cm6.3.1 
enabled=true 
gpgcheck=false

pscp -h host.txt  /etc/yum.repos.d/os.repo /etc/yum.repos.d/

yum repolist

vim /etc/httpd/conf/httpd.conf 
#在<IfModule mime_module>中修改以下内容 #把第284行的 
AddType application/x-gzip .gz .tgz 
修改为: AddType application/x-gzip .gz .tgz .parcel
#重启httpd服务
systemctl restart httpd

```

### 所有服务器安装jdk

```

pssh -h host.txt " yum install -y oracle-j2sdk1.8-1.8.0+update181-1.x86_64"

```

### 配置jdk的环境变量

```

vim /etc/profile

export JAVA_HOME=/usr/java/jdk1.8.0_181-cloudera 
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar export PATH=:$JAVA_HOME/bin:$PATH

pscp -h host.txt /etc/profile /etc

pssh -h host.txt  "source /etc/profile"

```

### 添加mysql驱动包

```
mkdir -p /usr/share/java 
mv /root/cloudera_install/mysql-connector-java-5.1.46.jar /usr/share/java/ 
cd /usr/share/java/ 
mv mysql-connector-java-5.1.46.jar mysql-connector-java.jar

pssh -h host2.txt "mkdir -p  /usr/share/java "
pscp -h host2.txt /usr/share/java/mysql-connector-java.jar /usr/share/java/

```

## Cloudera Manager部署
### 安装CM server及agent

```
#安装python27，解决安装过程中Hue无法访问数据库问题
pssh -h host.txt  "yum install -y centos-release-scl "
pssh -h host.txt "yum install -y python27 python27-devel"
## server安装
yum install -y cloudera-manager-server cloudera-manager-daemons cloudera-manager-agent
## 安装agent and damons
pssh -h host.txt "yum -y install cloudera-manager-daemons"
pssh -h host.txt "yum -y install cloudera-manager-agent"
pssh -h host2.txt yum -y install cloudera-manager-daemons
pssh -h host2.txt yum -y install cloudera-manager-agent

```

#### 所有节点修改agent配置

```
vim /etc/cloudera-scm-agent/config.ini 
#修改文件中server_host的属性值 
server_host=scm-server


pscp -h host2.txt /etc/cloudera-scm-agent/config.ini /etc/cloudera-scm-agent/

```

#### 初始化scm数据库

```
/opt/cloudera/cm/schema/scm_prepare_database.sh mysql scm scm ER62-fP()hs1OoFW>

添加mysql驱动包
pscp -h host2.txt /usr/share/java/mysql-connector-java.jar  /opt/cloudera/cm/lib

```

#### 启动CM server及agent

```
#hadoop01主节点启动CM  server 
systemctl start cloudera-scm-server

#启动日志目录为
/var/log/cloudera-scm-server/ cd /var/log/cloudera-scm-server/ 
tail cloudera-scm-server.log

#所有节点启动CM agent 

systemctl start cloudera-scm-agent
```

### 重启 scm服务

systemctl restart cloudera-scm-server

pssh -h host.txt  "systemctl restart cloudera-scm-agent  "

Q:这里有出现了agent安装失败的情况
A:分析日志基本可知,是agent和server服务启动时,运行的监听问题.解决思路是对/etc/hosts文件进行处理
![2021-04-26-11-41-22](http://rgr3ifyzo.sabkt.gdipper.com2021-04-26-11-41-22.png)
事实证明确实如此。
后续2:
在运维同事进行处理后,又在/etc/hosts 文件里添加了新的内容。


pssh -h host.txt 'mkdir -p /data/colony/hdfs'

### elasticearch 集中安装
1. 将es的parcel包移动到/var/www/html/elasticearch中
2. 在parcel配置页面添加es镜像的添加地址: http://server/elasticsearch
3. 在parcel页面刷新,直至elasticearch栏加载出来,点击下载,分配.
4. 分配完成后,点击激活,这一步常是要退出分配页面,重新点击.
5. 激活完成后一般就可以安装elasticsearch了.按CDH安装其它主机一样,进行安装
6. 安装时elasticearch的配置内容一般不可能更改,这里要elastiscearch安装完成后再进行配置.
要配置的内容主要有如下图
![2021-04-28-14-36-25](http://rgr3ifyzo.sabkt.gdipper.com2021-04-28-14-36-25.png)
#### es内存设置

```
-Xms8g
-Xmx8g
```
两个参数要设置成一样大,不然会有报错。


elasticearch.yml添加监听配置

```
action.destructive_requires_name: true
action.auto_create_index: .security,.monitoring*,.watches,.triggered_watches,.watcher-history*
xpack.monitoring.enabled: true
xpack.graph.enabled: false
xpack.watcher.enabled: false
xpack.ml.enabled: false
```




### kibana部署

#### docker-compose.yml

```yml
version: '2.4'
services:
  kibana:
   image: kibana:7.9.0
   container_name: kibana
   restart: always
   volumes:
       - ./config:/usr/share/kibana/config
   network_mode: host

```

### sentry 鉴权

### clickhouse集群



#### 部署单机版
1. 先查看支不支持sse4指令集
grep -q sse4_2 /proc/cpuinfo && echo “SSE 4.2 supported” || echo “SSE 4.2 not supported.
![2021-04-28-17-34-28](http://rgr3ifyzo.sabkt.gdipper.com2021-04-28-17-34-28.png)
现有服务器不支持sse4。在此种情况下，先安装一个集群试用


2. 

pssh -h ck.txt "yum install -y yum-utils"
pssh -h ck.txt "rpm --import https://repo.clickhouse.tech/CLICKHOUSE-KEY.GPG"
pssh -h ck.txt "yum-config-manager --add-repo https://repo.clickhouse.tech/rpm/stable/x86_64"
pssh -h ck.txt "yum install -y clickhouse-server clickhouse-client"

3. 
启动server

systemctl start clickhouse-server

pssh -h ck.txt "systemctl start clickhouse-server"

4. 修改config.xml

修改以下几个参数
```
    <path>/var/lib/clickhouse/</path>
    <tmp_path>/var/lib/clickhouse/tmp/</tmp_path>
    <user_files_path>/var/lib/clickhouse/user_files/</user_files_path>

    全局替换
    /var/lib ===> /data/colony/
    /var/log ===> /data/colony/log
    
```

## flink手动安装

复制flink至其它节点
pscp -h host2.txt flink-1.12.4-bin-scala_2.11.tgz ~
解压flink压缩包
pssh -h host2.txt "tar -zxvf ~/flink-1.12.4-bin-scala_2.11.tgz"

安装scala环境
pscp  -r  -h host2.txt scala-2.11.8 ~/


复制 flink包至所有节点

pscp -h hos t.txt  /root/upload/flink-shaded-hadoop-2-uber-3.0.0-cdh6.2.0-7.0.jar   /opt/cloudera/parcels/FLINK/lib

demo 示例

pscp -h hos t.txt  /root/upload/flink-shaded-hadoop-2-uber-3.0.0-cdh6.2.0-7.0.jar   /opt/cloudera/parcels/FLINK/lib
