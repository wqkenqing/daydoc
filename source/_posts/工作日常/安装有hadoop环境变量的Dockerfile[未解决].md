# hadoop环境的Dockerfile

FROM ubuntu

RUN "mkdir /root/upload"

COPY jdk-8u181-linux-x64.tar.gz /root/upload
COPY  hadoop-2.7.2 /root/
COPY  hadoop_run.sh /root/hadoop_run.sh

RUN tar -zxvf /root/upload/jdk-8u181-linux-x64.tar.gz /root/upload \
    mv /root/upload/jdk1.8.0_181 /root/upload/jdk1.8 \
    mv /root/upload/jdk1.8 ../ \

ENV PATH /root/jdk1.8:/bin:/root/hadoop2.7.2/bin:$PATH    

ENTRYPOINT [ "hadoop_run.sh" ]
