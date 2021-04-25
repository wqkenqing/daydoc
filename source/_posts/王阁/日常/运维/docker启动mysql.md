title:  docker启动mysql
date:   2020-06-04
tags: [mysql,docker,运维]
---
docker 的方式快速安装mysql

 <!--more-->
```docker
  
  docker run --net host -p 3306:3306 --name jd_user -e MYSQL_ROOT_PASSWORD=jd123456 -d mysql

 ```