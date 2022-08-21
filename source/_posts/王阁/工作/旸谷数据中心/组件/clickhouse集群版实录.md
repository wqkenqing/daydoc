title:  clickhosue集群版实录
date:  2021年 07月 12日
tags: [clickhouse、数仓]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

# clickhouse集群版实录
因为一些原因之前的clickhouse环境缺失，这里要恢复一下clickhouse。目前三个节点已有clickhosue的环境，这里主要是恢复一下集群版，之前应该是搭建过一次集群版，但目前无法找到相关详细记录，所以这次要详尽记录一下操作流程



## 操作实录

1. 修改config文件，打开listen_host的注释

vim /etc/clickhouse-server/config.xml

![2021-07-12-10-50-47](http://rgr3ifyzo.sabkt.gdipper.com2021-07-12-10-50-47.png)

2. 创建/etc/metrika.xml
并添加相应的配置内容

3. 替换config.xml中data path 的路径

%s!/var/lib/clickhouse/!/data/colony/clickhouse/!g

4 重启clickhosue-server
service clickhouse-server restart
5. 设置账号密码

```
<users>
    <yanggu>                      <!--用户登录名-->
        <password>yg123456</password>    <!--用户登录密码-->
        <networks>
           <ip>::/0</ip>
        </networks>   <!--允许登录的网络地址-->
        <profile>default</profile>  <!--用户使用的profile配置-->
        <quota>default</quota>      <!--用户能够使用的资源限额/熔断机制-->
    </yanggu>
<users>


```