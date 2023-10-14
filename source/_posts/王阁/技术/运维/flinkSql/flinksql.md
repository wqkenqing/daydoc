





```
CREATE TABLE mqtt_cmd (
  `value` INT,
  `uuid` STRING,
  `username` STRING,
  `uid` STRING,
  `topic` STRING,
  `timestamp` BIGINT,
  `priority_2` INT,
  `priority_1` INT,
  `name` STRING,
  `dataType` STRING
) WITH (
  'connector' = 'kafka',
  'topic' = 'mqtt_cmd',
  'properties.bootstrap.servers' = 'kafka01:9092,kafka02:9092,kafka03:9092',
  'properties.group.id' = 'cmd01',
  'format' = 'json',
  'json.fail-on-missing-field' = 'false',
  'scan.startup.mode' = 'earliest-offset',
  'json.ignore-parse-errors' = 'true'
);

```

```
CREATE TABLE mqtt_resp (
  uuid STRING,
  username STRING,
  uid STRING,
  topic_req STRING,
  error INT
) WITH (
  'connector' = 'kafka',
  'topic' = 'mqtt_resp',
  'properties.bootstrap.servers' = 'kafka01:9092,kafka02:9092,kafka03:9092',
  'properties.group.id' = 'cmd01',
  'format' = 'json',
  'json.fail-on-missing-field' = 'false',
  'scan.startup.mode' = 'earliest-offset',
  'json.ignore-parse-errors' = 'true'
);
```

