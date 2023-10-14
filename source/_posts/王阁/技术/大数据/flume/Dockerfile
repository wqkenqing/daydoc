FROM registry.lisong.pub:5000/sunrise/flume:1.8.0

RUN rm -f /opt/flume/lib/kafka-*.jar 
COPY *.jar /opt/flume/lib/
-flume
RUN mkdir -p /opt/flume \
  && tar -xzf /tmp/flume.tar.gz -C /opt/flume --strip-components=1 \
  && chmod +x /opt/flume/bin/start-flume \
  && rm -f /tmp/flume.tar.gz

ENV PATH /opt/flume/bin:$PATH
ENTRYPOINT [ "start-flume" ]
