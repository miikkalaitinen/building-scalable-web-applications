TODO: There are at least five (meaningful) performance tests written with k6, included in the k6 folder. Performance test results are included in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.

## DEV ENVIROMENT

### Get course

http_reqs: 14369
http_req_duration - median: 6.02ms
http_req_duration - 99th percentile: 13.25ms

### Get courses

http_reqs: 17472
http_req_duration - median: 4.09ms
http_req_duration - 99th percentile: 12.45ms

### Get question

http_reqs: 13560
http_req_duration - median: 6.76ms
http_req_duration - 99th percentile: 13.55ms

### Post answer (30s)

http_reqs: 15920
http_req_duration - median: 10.87ms
http_req_duration - 99th percentile: 27.95ms

### Post upvote (30s)

http_reqs: 16776
http_req_duration - median: 9.7ms
http_req_duration - 99th percentile: 25.69ms

## PROD ENVIROMENT

### Get course

http_reqs: 13692
http_req_duration - median: 6.04ms
http_req_duration - 99th percentile: 18.87ms

### Get courses

http_reqs: 28358
http_req_duration - median: 3.14ms
http_req_duration - 99th percentile: 10.18ms

### Get question

http_reqs: 13473
http_req_duration - median: 6.49ms
http_req_duration - 99th percentile: 17.21ms

### Post answer (30s)

http_reqs: 17840
http_req_duration - median: 9.11ms
http_req_duration - 99th percentile: 26.37ms
ws_connecting - median: 4.54ms
ws_connecting - 99th percentile: 17.77ms

### Post upvote (30s)

http_reqs: 35245
http_req_duration - median: 7.22ms
http_req_duration - 99th percentile: 19.51ms

## KUBERNETES DEPLOYMENT

### Get course

http_reqs: 4081
http_req_duration - median: 6.29ms
http_req_duration - 99th percentile: 97.76ms

### Get courses

http_reqs: 18328
http_req_duration - median: 3.19ms
http_req_duration - 99th percentile: 56.09ms

### Get question

http_reqs: 4718
http_req_duration - median: 7.06ms
http_req_duration - 99th percentile: 98.56ms

### Post answer (30s)

http_reqs: 6792
http_req_duration - median: 11.83ms
http_req_duration - 99th percentile: 170.29ms
ws_connecting - median: 4.02ms
ws_connecting - 99th percentile: 94.92ms

### Post upvote (30s)

http_reqs: 21953
http_req_duration - median: 7.53ms
http_req_duration - 99th percentile: 76.79ms

Based on the perfomance results we can see a few interesting things. Most notably, the kubernetes deployment performance numbers are significantly worse than the dev and prod environments. This is likely due to the fact that I have no real experience configuring kubernetes, and I have therefore given too little resources to the api pods. There might also be some room to improve with the networking side of things, but I am not quite sure.

The dev and prod environments also show interesting results. The prod environment runs 2 replicas of api, ui and llm, while the dev environment only runs 1 replica of each. This is likely the reason why the prod environment performs better in get courses, post upvote and post answer. However, the environments perform similarly in get course and get question. This is likely due to the fact that the api is in both cases bottlenecked by the database queries, since both environment are running a single replica of the database.
This could be improved by running a database cluster, and/or adding some queries to like, upvotes to use a redis cache.
