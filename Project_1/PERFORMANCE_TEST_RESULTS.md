# k6 Performance results

All test are using production build of the application.

## With 2 grader api instances

### Getting page

http_reqs: 20663
http_req_duration - median: 3.65ms
http_req_duration - 99th percentile: 11.4ms

## Posting assignments

http_reqs: 24
http_req_duration - median: 3.04ms
http_req_duration - 99th percentile: 32.22ms
ws_session_duration - median: 20.12s
ws_session_duration - 99th percentile: 20.57s

## With 4 grader api instances

### Getting page

http_reqs: 20831
http_req_duration - median: 3.48ms
http_req_duration - 99th percentile: 11.2ms

## Posting assignments

http_reqs: 34
http_req_duration - median: 5.41ms
http_req_duration - 99th percentile: 438.67ms
ws_session_duration - median: 10.61s
ws_session_duration - 99th percentile: 13.84s

# Reflection

As we can see from the performance statistic. Increasing the amount of grader api instances does not have a significant effect on the https request times. However, it does have a significant effect on the websocket request times, since the websocket requests are directly correlated to the amount of grader api instances processing the submissions queue. The scaling achieved
here by doubling the amount of grader api instances is a very good improvement, since the websocket request times are halved while also processing more requests.
