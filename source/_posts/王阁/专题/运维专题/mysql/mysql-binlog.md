### 1.  介绍

在MySQL中，binlog指的是binary [log](https://so.csdn.net/so/search?q=log&spm=1001.2101.3001.7020)，二进制日志文件。这个文件记录了MySQL所有的DML操作。通过binlog日志，我们可以做数据恢复，做主从复制等等。对于运维或架构人员来说，开启binlog日志功能非常重要。

### 2 开启 binlog

#### 2.1 方法一：在my.cnf主配置文件中添加参数

在 my.cnf 主配置文件中，找到 [mysqld] 模块，然后添加以下三行参数。

```
#第一种方式:
#开启binlog日志
log_bin=ON
#binlog日志的基本文件名
log_bin_basename=/var/lib/mysql/mysql-bin
#binlog文件的索引文件，管理所有binlog文件
log_bin_index=/var/lib/mysql/mysql-bin.index
#配置serverid
server-id=1

#第二种方式:
#此一行等同于上面log_bin三行
log-bin=/var/lib/mysql/mysql-bin
#配置serverid
server-id=1
```

实操的话，是通过第二种方式成功的。

---

