1. canal使用

### cdc使用

步骤：

1. 下载了canal.deployer-1.1.5.tar.gz
2. 解压
3. 配置conf中的canal.properties文件

   1. ```
      server.mode=kafka 
      canal.id=122 # 这里主要是标记唯一id
      ```
   2. ```
      bootstrap.server=kafka01:9092
      ```
   3. 这里在example/ 路径下配置了instance.properties

      ```
      将内容配置了master.address、dbuserName、password等信息
      ```
   4. bin/startup.sh 启动了命令
   5. 查看日志文件，通过日志信息进行相应的处理

   ---
