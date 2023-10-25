# .bashrc

# User specific aliases and functions

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# Source global definitions
if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi
export HISTFILESIZE=10000
export HISTTIMEFORMAT="%Y-%m-%d %H:%M:%S "

export JAVA_HOME=/root/jdk1.8
export HADOOP_HOME=/root/hadoop2.7.7
export HBASE_HOME=/root/hbase2.0.3
export ZK_HOME=/root/zookeeper3.4.5
export PATH=$PATH:$JAVA_HOME/bin:$HADOOP_HOME/bin:$HADOOP_HOME/sbin:$HBASE_HOME/bin:$ZK_HOME/bin
