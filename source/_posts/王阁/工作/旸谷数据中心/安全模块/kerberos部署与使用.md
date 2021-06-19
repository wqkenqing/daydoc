title:  kerberos部署与使用
date:  2021年 6月 4日
tags: [kerberos]
password: 7FKBKZrTTTPG2LnC

---
 <!--more-->

 # kerberos部署与使用

 ## 1. kerberos部署

 ### 1.1 安装

 ```

yum -y install krb5-server krb5-libs krb5-auth-dialog krb5-workstation 

 ```
### 1.2 修改kdc的配置文件
#### 1.2.1 修改krb5.conf的配置文件

vim /etc/krb5.conf

``` 
# Configuration snippets may be placed in this directory as well
includedir /etc/krb5.conf.d/
[logging]
 default = FILE:/var/log/krb5libs.log
 kdc = FILE:/var/log/krb5kdc.log
 admin_server = FILE:/var/log/kadmind.log
[libdefaults]
 dns_lookup_realm = false
 ticket_lifetime = 24h
 renew_lifetime = 7d
 forwardable = true
 rdns = false
 pkinit_anchors = /etc/pki/tls/certs/ca-bundle.crt
 default_realm = SUNRISE.LAN
 #default_ccache_name = KEYRING:persistent:%{uid}
[realms]
 SUNRISE.LAN = {
  kdc = 192.168.10.206
  admin_server = 192.168.10.206
  # 指定默认的域名
  default_domain = SUNRISE.LAN
 }
[domain_realm]
.sunrise.lan = SUNRISE.LAN
sunrise.lan = SUNRISE.LAN

```

#### 1.2.2 修改kdc.conf的配置文件

vim /var/kerberos/krb5kdc/kdc.conf

```
[kdcdefaults]
 # kdc默认端口　
 kdc_ports = 88
 # kdc默认的tcp端口
 kdc_tcp_ports = 88

[realms]
 # 配置每个域的具体信息 (relam 请用大写)
 SUNRISE.LAN = {
  #和 supported_enctypes 默认使用 aes256-cts。由于，JAVA 使用 aes256-cts 验证方式需要安装额外的 jar 包（后面再做说明）。推荐不使用，并且删除 aes256-cts。（建议注释掉）
  #master_key_type = aes256-cts
  #标注admin的用户权限
  acl_file = /var/kerberos/krb5kdc/kadm5.acl
  dict_file = /usr/share/dict/words
  #KDC进行校验的keytab
  admin_keytab = /var/kerberos/krb5kdc/kadm5.keytab
  #支持的校验方式
  supported_enctypes = aes256-cts:normal aes128-cts:normal des3-hmac-sha1:normal arcfour-hmac:normal camellia256-cts:normal camellia128-cts:normal des-hmac-sha1:normal des-cbc-md5:normal des-cbc-crc:normal
 }

```

#### 1.2.3 配置kadm5.acl

vim /var/kerberos/krb5kdc/kadm5.acl
```
# 当前用户admin ，* 表示全部权限。可以新增用户和分配权限
# 配置表示以/admin@WXAMPLE.COM结尾的用户拥有*(all 也就是所有)权限，具体配置可根据项目来是否缩小权限。
*/admin@SUNRISE.LAN     *
```

### 1.3  创建Kerberos数据库

```
kdb5_util create -r SUNRISE.LAN -s

```

密钥存储至个人kee服务

### 1.4 启动Kerberos服务

```
#  启动服务命令
systemctl start krb5kdc
systemctl start kadmin

# 加入开机启动项
systemctl enable krb5kdc
systemctl enable kadmin
```

### 1.5 创建Kerberos管理员principal

```
kadmin.local -q "addprinc root/admin"
# 需要先kinit保证已经有principal缓存。

kinit root/admin
klist 

```

### 1.6 客户端安装kerberos

```
# 在所有服务器上安装kerberos-client

pssh -h host.txt  "yum -y install krb5-devel krb5-workstation"
# 将server中的/etc/krb5.conf 拷贝至所有client上
pscp -h host2.txt /etc/krb5.conf /etc

```

