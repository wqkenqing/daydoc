通过curl 访问elastic search

curl -XGET http://jd_cloud:9200/_cat/indices?v
curl -XGET http://jd_cloud:9200/tourist_source_prov/_mapping?pretty
curl -XGET http://jd_cloud:9200/tourist_source_prov/_settings?pretty
curl -XGET http://jd_cloud:9200/company/_mapping?pretty

http://jd_cloud:9200

curl -XPUT -H "Content-Type: application/json" http://jd_cloud:9200/company1/ -d  '{
"mappings":{
  "stuff":{
    "dynamic":"strict"
    "properties":{
      "name":{
        "type":"text"
      },
      "sex":{
        "type":"text"
        },
        "age":{
          "type":"integer"
        },
        "post":{
          "type":"text"
        },
        "memo":{
          "type":"text"
        },
        "joinTime":{
          "type":"date",
           "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"  
        }
    }
  }
}
}'



curl -XPOST http://jd_cloud:9200/company/_settings -d
'{
  "number of number_of_shards":3,
  "number of number_of_replicas":3
  }'

  curl -XPUT http://jd_cloud:9200/company/_mapping -d
  '{
    stuff":{
      "dynamic":"strict"
      "properties":{
        "name":{
          "type":"text"
        },
        "sex":{
          "type":"text"
          },
          "age":{
            "type":"integer"
          },
          "post":{
            "type":"text"
          }
          "memo":{
            "type":"text"
          }
          "joinTime":{
            "type":"date",
             "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"  
          }
      }
    }
    }'


http PUT "http://localhost:9200/company/_mapping" ' {"stuff":{
    "dynamic":"strict"
    "properties":{
      "name":{
        "type":"text"
      },
      "sex":{
        "type":"text"
        },
        "age":{
          "type":"integer"
        },
        "post":{
          "type":"text"
        }
        "memo":{
          "type":"text"
        }
        "joinTime":{
          "type":"date",
           "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"  
        }
    }

}
}'

http PUT "http://jd_cloud:9200/company/"
'{
"mappings":{
  "stuff":{
    "dynamic":"strict"
    "properties":{
      "name":{
        "type":"text"
      },
      "sex":{
        "type":"text"
        },
        "age":{
          "type":"integer"
        },
        "post":{
          "type":"text"
        },
        "memo":{
          "type":"text"
        },
        "joinTime":{
          "type":"date",
           "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis"  
        }
    }
  }
}
}']]\



{"id":"瓦屋山_2020-03-04 17:40:30","scenicName":"瓦屋山","realTimeTouristNum":0,"todayTouristCount":0,"lastTodayTouristCount":193,"beforeLastTodayTouristCount":0,"compareLastTouristCount":null,"compareBeforeLastTouristCount":null,"compareLastExtendType":3,"compareBeforeLastExtendType":3,"onlineTicketCount":0,"offlineTicketCount":0,"cablewayPercent":null,"sightseeingCarPercent":null,"ticketPercent":null,"responseTime":"2020-03-04 17:40:30"}





industry_real-weather_data  	 8951 - 8924


yidong-tourist_minuteLocal  1105452 - 1105425
