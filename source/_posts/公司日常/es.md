PUT /reptile
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 1,
    "analysis": {
      "analyzer": {
        "ik_custom": {
          "filter": [
            "len"
          ],
          "tokenizer": "ik_smart"
        }
      },
      "filter": {
        "len": {
          "type": "length",
          "min": "2"
        }
      }
    }
  }
}
