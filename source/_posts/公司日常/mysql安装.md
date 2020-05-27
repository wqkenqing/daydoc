# docker方式安装mysql

docker pull mysql 拉取镜像

mkdir -p /docker/mysql/conf.d
mkdir -p /docker/mysql/data



docker run -di -p 3307:3306 -v /docker/mysql/conf.d:/etc/mysql/conf.d -v /docker/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=test123 --name mysql mysql


ALTER USER 'root'@'localhost' IDENTIFIED BY 'test123' PASSWORD EXPIRE NEVER;

ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'test123';


flush privileges; 


![sd](https://juejin.im/post/5d64a89d518825168d37c45b)
