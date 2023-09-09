# Benchmarks

### 1. Read 1 key

#### Script

```shell
ab -k -c 10 -n 3000\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/read-1-key-10-concurrency-3000-requests.csv"\
  "https://<your-cache-cloud-host>/kv/values/key-1"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/values/key-1
Document Length:        30 bytes

Concurrency Level:      10
Time taken for tests:   9.096 seconds
Complete requests:      3000
Failed requests:        0
Keep-Alive requests:    3000
Total transferred:      2045496 bytes
HTML transferred:       90000 bytes
Requests per second:    329.81 [#/sec] (mean)
Time per request:       30.320 [ms] (mean)
Time per request:       3.032 [ms] (mean, across all concurrent requests)
Transfer rate:          219.60 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   4.6      0      95
Processing:    20   30  16.5     27     244
Waiting:       19   30  16.5     27     244
Total:         20   30  18.0     27     244

Percentage of the requests served within a certain time (ms)
  50%     27
  66%     29
  75%     31
  80%     32
  90%     36
  95%     40
  98%     49
  99%     78
 100%    244 (longest request)
```

### 2. Read 5 keys

#### Script

```shell
ab -k -c 10 -n 3000\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/read-5-keys-10-concurrency-3000-requests.csv"\
  "https://<your-cache-cloud-host>/kv/values?key=a%3D%3F%26b=%2F&key=1e6e1ddc-913b-4178-a9ec-57f649c5bcdf&key=key-3&key=key-4&key=key-5"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/values?key=a%3D%3F%26b=%2F&key=1e6e1ddc-913b-4178-a9ec-57f649c5bcdf&key=key-3&key=key-4&key=key-5
Document Length:        283 bytes

Concurrency Level:      10
Time taken for tests:   11.339 seconds
Complete requests:      3000
Failed requests:        0
Keep-Alive requests:    3000
Total transferred:      2807898 bytes
HTML transferred:       849000 bytes
Requests per second:    264.57 [#/sec] (mean)
Time per request:       37.797 [ms] (mean)
Time per request:       3.780 [ms] (mean, across all concurrent requests)
Transfer rate:          241.83 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   4.7      0     102
Processing:    25   37  16.9     34     373
Waiting:       25   37  16.9     34     373
Total:         25   37  17.8     34     373

Percentage of the requests served within a certain time (ms)
  50%     34
  66%     36
  75%     38
  80%     39
  90%     44
  95%     49
  98%     61
  99%     91
 100%    373 (longest request)
```

### 3. Read 20 keys

#### Script

```shell
ab -k -c 10 -n 3000\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/read-20-keys-10-concurrency-3000-requests.csv"\
  "https://<your-cache-cloud-host>/kv/values?key=a%3D%3F%26b=%2F&key=1e6e1ddc-913b-4178-a9ec-57f649c5bcdf&key=key-3&key=key-4&key=key-5&key=key-6&key=key-7&key=key-8&key=key-9&key=key-10&key=key-11&key=key-12&key=key-13&key=key-14&key=key-15&key=key-16&key=key-17&key=key-18&key=key-19&key=key-20"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/values?key=a%3D%3F%26b=%2F&key=1e6e1ddc-913b-4178-a9ec-57f649c5bcdf&key=key-3&key=key-4&key=key-5&key=key-6&key=key-7&key=key-8&key=key-9&key=key-10&key=key-11&key=key-12&key=key-13&key=key-14&key=key-15&key=key-16&key=key-17&key=key-18&key=key-19&key=key-20
Document Length:        927 bytes

Concurrency Level:      10
Time taken for tests:   25.900 seconds
Complete requests:      3000
Failed requests:        0
Keep-Alive requests:    3000
Total transferred:      4739290 bytes
HTML transferred:       2781000 bytes
Requests per second:    115.83 [#/sec] (mean)
Time per request:       86.334 [ms] (mean)
Time per request:       8.633 [ms] (mean, across all concurrent requests)
Transfer rate:          178.69 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   5.6      0     116
Processing:    62   85  28.5     80     733
Waiting:       62   84  28.5     80     733
Total:         62   85  31.3     80     733

Percentage of the requests served within a certain time (ms)
  50%     80
  66%     84
  75%     87
  80%     90
  90%     97
  95%    105
  98%    120
  99%    161
 100%    733 (longest request)
```

### 4. Write 1 key

#### Script

```shell
ab -k -c 5 -n 500\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/write-1-key-5-concurrency-500-requests.csv"\
  -u "./doc/benchmarks/write-1-key-request-body.json"\
  "https://<your-cache-cloud-host>/kv/values/key-1"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/values/key-1
Document Length:        16 bytes

Concurrency Level:      5
Time taken for tests:   13.729 seconds
Complete requests:      500
Failed requests:        0
Keep-Alive requests:    500
Total transferred:      333944 bytes
Total body sent:        149500
HTML transferred:       8000 bytes
Requests per second:    36.42 [#/sec] (mean)
Time per request:       137.290 [ms] (mean)
Time per request:       27.458 [ms] (mean, across all concurrent requests)
Transfer rate:          23.75 [Kbytes/sec] received
                        10.63 kb/s sent
                        34.39 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   5.2      0      65
Processing:   101  134  15.5    134     313
Waiting:      101  134  15.5    134     313
Total:        101  134  17.1    134     313

Percentage of the requests served within a certain time (ms)
  50%    134
  66%    137
  75%    139
  80%    141
  90%    145
  95%    154
  98%    173
  99%    196
 100%    313 (longest request)
```

### 5. Delete 1 key

#### Script

```shell
ab -k -c 5 -n 500\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/delete-1-key-5-concurrency-500-requests.csv"\
  -m "DELETE"\
  "https://<your-cache-cloud-host>/kv/values/key-1"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/values/key-1
Document Length:        16 bytes

Concurrency Level:      5
Time taken for tests:   13.262 seconds
Complete requests:      500
Failed requests:        0
Keep-Alive requests:    500
Total transferred:      333762 bytes
HTML transferred:       8000 bytes
Requests per second:    37.70 [#/sec] (mean)
Time per request:       132.619 [ms] (mean)
Time per request:       26.524 [ms] (mean, across all concurrent requests)
Transfer rate:          24.58 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    1   5.7      0      63
Processing:    86  130  27.9    132     339
Waiting:       86  130  27.9    132     339
Total:         86  131  29.0    132     341

Percentage of the requests served within a certain time (ms)
  50%    132
  66%    135
  75%    138
  80%    140
  90%    147
  95%    158
  98%    209
  99%    307
 100%    341 (longest request)
```

### 6. List 100 keys

#### Script

```shell
ab -k -c 5 -n 200\
  -H "X-API-Key:<api-key>"\
  -e "./doc/benchmarks/list-1-key-5-concurrency-200-requests.csv"\
  "https://<your-cache-cloud-host>/kv/keys?limit=100"
```

#### Results

```
Server Software:        cloudflare
Server Hostname:        <your-cache-cloud-host>
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-ECDSA-CHACHA20-POLY1305,256,256
Server Temp Key:        ECDH X25519 253 bits
TLS Server Name:        <your-cache-cloud-host>

Document Path:          /kv/keys?limit=100
Document Length:        2586 bytes

Concurrency Level:      5
Time taken for tests:   1.359 seconds
Complete requests:      200
Failed requests:        0
Keep-Alive requests:    200
Total transferred:      647866 bytes
HTML transferred:       517200 bytes
Requests per second:    147.12 [#/sec] (mean)
Time per request:       33.986 [ms] (mean)
Time per request:       6.797 [ms] (mean, across all concurrent requests)
Transfer rate:          465.39 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    2   9.7      0      72
Processing:    22   29   8.5     28      96
Waiting:       21   29   8.5     28      96
Total:         22   31  15.7     28     158

Percentage of the requests served within a certain time (ms)
  50%     28
  66%     29
  75%     31
  80%     32
  90%     36
  95%     41
  98%     95
  99%    145
 100%    158 (longest request)
```
