title: hbase api升级 
date:  2021年 6月18日
tags: [hbase,api升级]
password: 7FKBKZrTTTPG2LnC

---

 <!--more-->

 ## hbase 0.9X api升级为1.x
 hbase 现在版本是2.0.3

这次api升级感知到的api的调整主要有
引入了
org.apache.hadoop.hbase.client.Connection 类
即现在与hbase的交互都先拿到Connection这个实例，然后再进行后续操作，如获取Admin,Table。等
附一些代码片段进行示例说明

### 获取table

``` java
 public static Table getTable(String tableName) {
        table = null;
        Connection connection = null;

        try {
            connection = ConnectionFactory.createConnection(getConf());
            table = connection.getTable(TableName.valueOf(tableName.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            log.error("htable获取失败");
        }
        return table;
    }
```

### 展示所有表

``` java
public void listAllTables() {
        Connection connection = null;
        try {
            connection = ConnectionFactory.createConnection(conf);
            Admin hAdmin = connection.getAdmin();
            log.info("以下是所有的表...");
            Arrays.asList(hAdmin.listTableNames()).forEach(t -> {
                System.out.println(t.toString());
            });
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
```