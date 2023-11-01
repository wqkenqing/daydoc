
集成的ElasticSearch-Kinaba

docker pull nshou/elasticsearch-kibana

docker run -d -p 9200:9200 -p 5601:5601 nshou/elasticsearch-kibana


docker run -d --name elasticsearch --net host -e "discovery.type=single-node" elasticsearch:6.7.2
docker run -d --name kibana --net host -e "discovery.type=single-node"  -e ELASTICSEARCH_URL=http://localhost:9200  kibana:6.7.2


elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.3.2/elasticsearch-analysis-ik-6.7.2.zip
