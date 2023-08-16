# Performance test results

Brief description of the used server (choose one): HTTP/1.1

Brief description of your computer: Macbook Pro 14" M2 Pro

## No Redis Cache

### Retrieving todos

http_reqs: 26125
http_req_duration - median: 3.36ms
http_req_duration - 99th percentile: 9.14ms

## Redis Cache

### Retrieving todos

http_reqs: 31091
http_req_duration - median: 2.97ms
http_req_duration - 99th percentile: 7.09ms

## Reflection

Brief reflection on the results of the tests -- why do you think you saw the results you saw:

The Cache version is slighlty faster than the non-cache version, since it can retrieve the data directly from memory. The difference is small though, since the amount of data is small.
