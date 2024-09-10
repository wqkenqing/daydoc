```
curl -H 'Content-Type: application/json' -XPOST "http://localhost:9200/hy_traffic_baidu_five_minute_new/_search" -d'
{
"query": { "match_all": {} }
}' 
```

```
curl -H 'Content-Type: application/json' -XPOST "http://localhost:9200/hy_traffic_baidu_five_minute/_search" -d'  
{  
  "query": { "match_all": {} },  
  "sort": [  
    {  
      "rangeTime": {  
        "order": "desc"  
      }  
    }  
  ]  
}  
'
```



```
```



```
"sort": { "balance": { "order": "desc" },
"from": 10,
"size": 10
```

