## es迁移

1. 安装 elasticdump


pbu:monitorypoint-camera_traffic_event

elasticdump --input=http://namenode2:9200/pbu:monitorypoint-camera_traffic_event  --output=http://data1:9200/pbu:monitorypoint-camera_traffic_event --type=mapping

elasticdumpy主要参数说明

```
--input: 源地址，可为ES集群URL、文件或stdin,可指定索引，格式为：{protocol}://{host}:{port}/{index}
 --input-index: 源ES集群中的索引
 --output: 目标地址，可为ES集群地址URL、文件或stdout，可指定索引，格式为：{protocol}://{host}:{port}/{index}
 --output-index: 目标ES集群的索引
 --type: 迁移类型，默认为data,表明只迁移数据，可选settings, analyzer, data, mapping, alias

```



elasticdump --input=http://namenode2:9200/pbu:monitorypoint-camera_traffic_event  --output=http://jd:9200/pbu:monitorypoint-camera_traffic_event --type=mapping

elasticdump --input=http://namenode2:9200/county_industry_consumption  --output=http://jd:9200/county_industry_consumption  --type=mapping

elasticdump --input=http://namenode2:9200/county_industry_consumption  --output=http://jd:9200/county_industry_consumption  --type=data

curl -XGET http:://namenode2:9200/_cat/indices?v


## est迁移

定时同步

LYDSJ_GATHER_CALL_COUNT
LYDSJ_GATHER_CALL_ERROR
LYDSJ_GATHER_LOG_STORE


LYDSJ_GATHER_CALL_ERROR_TOTAL
LYDSJ_GATHER_CALL_COUNT_TOTAL
LYDSJ_GATHER_LOG_STORE_AFTERDAY
LYDSJ_GATHER_LOG_STORE_TOTAL
LYJTGL_RESOURCE_SECTION
LYJTGL_ROAD_SECTION_CURRENT
LYXXFB_YDP_STATUS


一次同步

LYJTGL_MONITOR_BASE_INFO
LYJTGL_SECTION_BASE_INFO
LYXXFB_YDP_NAME


## hbase 迁移

hbase org.apache.hadoop.hbase.mapreduce.CopyTable --peer.adr=data1:2181,data2:2181,data3:2181:/hbase 'pba:travel_trade-trade_base_info'
