# Node Clustering vs Container Load Balancing

Tests to compare performance and throughput of a Node service running in different load balancing scenarios.

## Test Setup

* Docker compose, with `nginx` load balancer and simple Node http server
* Using Docker compose CPU limits and scaling to control tests
* `npx autocannon http://localhost:3000`

## Results

These results were created on:

```
OS: Ubuntu 20.04.1 LTS on Windows 10 x86_64
CPU: AMD Ryzen 5 3600 (12) @ 3.600GHz
Memory Allowance: 7958MiB
Docker: Docker version 20.10.2, build 2291f61
```

### Benchmark: Single Worker, Single Instance

This is a single instance of the service, running a single worker thread, proxied through nginx.

```
scale: 1
cpus: 0.1
mem_limit: 128m

CLUSTERING_ENABLED=false
```

```
Running 10s test @ http://localhost:3000
10 connections

┌─────────┬──────┬──────┬────────┬────────┬──────────┬──────────┬────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5%  │ 99%    │ Avg      │ Stdev    │ Max    │
├─────────┼──────┼──────┼────────┼────────┼──────────┼──────────┼────────┤
│ Latency │ 1 ms │ 4 ms │ 103 ms │ 185 ms │ 40.75 ms │ 49.79 ms │ 200 ms │
└─────────┴──────┴──────┴────────┴────────┴──────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 187     │ 187     │ 227     │ 301     │ 240.5   │ 36.97   │ 187     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 28.4 kB │ 28.4 kB │ 34.5 kB │ 45.8 kB │ 36.5 kB │ 5.61 kB │ 28.4 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

2k requests in 10.02s, 365 kB read
```

### Single Worker, Four Instances

This is four instances of the service, each running a single worker thread, load balanced through nginx.

```
scale: 4
cpus: 0.1
mem_limit: 128m

CLUSTERING_ENABLED=false
```

```
Running 10s test @ http://localhost:3000
10 connections

┌─────────┬──────┬──────┬───────┬───────┬─────────┬──────────┬────────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max    │
├─────────┼──────┼──────┼───────┼───────┼─────────┼──────────┼────────┤
│ Latency │ 1 ms │ 2 ms │ 90 ms │ 94 ms │ 13.4 ms │ 28.89 ms │ 175 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴──────────┴────────┘
┌───────────┬─────────┬─────────┬────────┬────────┬────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%    │ 97.5%  │ Avg    │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Req/Sec   │ 528     │ 528     │ 715    │ 812    │ 716.3  │ 79.65   │ 528     │
├───────────┼─────────┼─────────┼────────┼────────┼────────┼─────────┼─────────┤
│ Bytes/Sec │ 80.3 kB │ 80.3 kB │ 109 kB │ 123 kB │ 109 kB │ 12.1 kB │ 80.2 kB │
└───────────┴─────────┴─────────┴────────┴────────┴────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

7k requests in 10.01s, 1.09 MB read
```

### Four Workers, Single Instance

This is a single instance of the service, running four worker threads, proxied through nginx.

```
scale: 1
cpus: 0.4
mem_limit: 128m

CLUSTERING_ENABLED=true
```

```
Running 10s test @ http://localhost:3000
10 connections

┌─────────┬──────┬──────┬───────┬───────┬─────────┬──────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max   │
├─────────┼──────┼──────┼───────┼───────┼─────────┼──────────┼───────┤
│ Latency │ 1 ms │ 2 ms │ 93 ms │ 94 ms │ 18.7 ms │ 34.66 ms │ 99 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴──────────┴───────┘
┌───────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat      │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg     │ Stdev   │ Min     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec   │ 397     │ 397     │ 532     │ 567     │ 515.71  │ 60.21   │ 397     │
├───────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 60.4 kB │ 60.4 kB │ 80.9 kB │ 86.2 kB │ 78.4 kB │ 9.14 kB │ 60.3 kB │
└───────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

5k requests in 10.02s, 784 kB read
```

### Bonus Test: Single Worker, Single Oversized Instance

This is a single instance of the service, running a single thread, proxied through nginx. However, the instance is has four times the CPU allowance.

```
scale: 1
cpus: 0.4
mem_limit: 128m

CLUSTERING_ENABLED=false
```

```
Running 10s test @ http://localhost:3000
10 connections

┌─────────┬──────┬──────┬───────┬───────┬─────────┬──────────┬───────┐
│ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev    │ Max   │
├─────────┼──────┼──────┼───────┼───────┼─────────┼──────────┼───────┤
│ Latency │ 1 ms │ 2 ms │ 64 ms │ 68 ms │ 6.18 ms │ 15.18 ms │ 77 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴──────────┴───────┘
┌───────────┬────────┬────────┬────────┬────────┬─────────┬─────────┬────────┐
│ Stat      │ 1%     │ 2.5%   │ 50%    │ 97.5%  │ Avg     │ Stdev   │ Min    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Req/Sec   │ 942    │ 942    │ 1690   │ 1739   │ 1492.91 │ 287.09  │ 942    │
├───────────┼────────┼────────┼────────┼────────┼─────────┼─────────┼────────┤
│ Bytes/Sec │ 143 kB │ 143 kB │ 257 kB │ 264 kB │ 227 kB  │ 43.6 kB │ 143 kB │
└───────────┴────────┴────────┴────────┴────────┴─────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

16k requests in 11.01s, 2.5 MB read
```

## References

* https://amagiacademy.com/blog/posts/2020-02-26/node-container-cpu
* https://www.npmjs.com/package/autocannon
* https://nodejs.org/api/cluster.html
