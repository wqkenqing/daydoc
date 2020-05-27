## 2020年 1月15日 星期三 10时11分27秒


## 启用防火墙


systemctl status firewalld.service
systemctl stop firewalld.service
systemctl start firewalld.service
systemctl restart firewalld.service

firewall-cmd --list-all

firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="171.212.210.195" port protocol="tcp" port="5601" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="171.212.210.195" port protocol="tcp" port="5601" accept"

firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source address="171.212.210.195" port protocol="tcp" port="5601" accept"

公司ip+防火墙
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="171.221.254.61" port protocol="tcp" port="1-65535" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="182.150.164.108" port protocol="tcp" port="1-65535" accept"
firewall-cmd --permanent --remove-rich-rule="rule family="ipv4" source address="182.150.164.108" port protocol="tcp" port="1-65535" accept"

开通ip,端口不设限
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="182.150.164.108"  accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="116.196.81.123"  accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.10.100.1"  accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.10.100.6"  accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.10.100.0/24"  accept"


firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.142.166" port protocol="tcp" port="5432" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.142.166" port protocol="tcp" port="5432" accept"
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="192.168.142.166" port protocol="tcp" port="5432" accept"

systemctl restart firewalld.service
firewall-cmd --list-all



 10.8.0.0/24

firewall-cmd --add-source=10.10.100.0 --permanent
firewall-cmd --add-source=10.10.100.0 --permanent
firewall-cmd --add-source=10.10.100.0 --permanent

firewall-cmd --query-source=10.10.100.0 --permanent
171.221.254.61
10.10.100.1


加端口

firewall-cmd --add-port=10000/tcp --permanent
firewall-cmd --add-port=9092/tcp --permanent
firewall-cmd --add-port=9093/tcp --permanent
firewall-cmd --reload

## 配置openvpn 防火墙配置

添加服务-OpenVPN          firewall-cmd --add-service=openvpn --permanent

添加端口-1194/tcp和1194/udp（默认vpn端口为1194）   

firewall-cmd --add-port=1194/tcp --permanent

firewall-cmd --add-port=1194/udp --permanent

执行两次分别为tcp和udp

添加源地址-源地址为：你的OpenVPN为VPN客户端所分配的地址段 10.10.100.0 默认openvpn配置文件）

firewall-cmd --add-source=10.10.100.0 --permanent     #添加源IP地址，也就是openvpn要分给客户端的网段

firewall-cmd --query-source=0.10.100.0 --permanent  #将该源IP地址绑定在public和这块网卡上


开启伪装（NAT）-masquerade

firewall-cmd --add-masquerade --permanent
firewall-cmd --query-masquerade --permanent

定要开启转发ip_forward！（/proc/sys/net/ipv4/ip_forward 值为1）

vi /etc/sysctl.conf

添加
net.ipv4.ip_forward = 1

sysctl -p
