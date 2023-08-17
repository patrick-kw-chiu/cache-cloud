<p align="center">
  <img src="https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/cash-cow-200px.png?raw=true" alt="Cache Cloud | Generated with Stable Diffusion">
  <h6 align="center">
    Icon generated with <a href="https://stablediffusionweb.com/">Stable Diffusion</a>
  </h6>
</p>

Cache Cloud quickly turns your [**Cloud**flare Workers](https://workers.cloudflare.com/) and [KV](https://medium.com/r?url=https%3A%2F%2Fwww.cloudflare.com%2Fproducts%2Fworkers-kv%2F) into a **fast serverless cache store with HTTP endpoints**, built on top of [Hono](https://github.com/honojs/hono).

## Quick example

```javascript
// You can define your own `cacheKey`, save and get values from it
// e.g. user%3A1%3A <= encodeURIComponent('user:1:')
const cacheKey = 'latest-blog-posts';
const response = await fetch(`${YOUR_CACHE_CLOUD_HOST}/kv/values/${cacheKey}`);

const { success, result: latestBlogPosts } = await response.json();
if (!success || !latestBlogPosts) {
  // Cache not found :(
  // Fetch and cache it here!
}

// Cache found, return it instantly!
return res.json(latestBlogPosts);
```

## Features

Cache Cloud leverages the edgy and serverless nature of Cloudflare Workers and KV and is very affordable.

- **HTTP first** 🌐 - Cache Cloud lets you access Cloudflare Workers KV all over the world by making HTTP calls
- **Frequent Read** 📖, but **Infrequent Write** 📝 - Cache Cloud works best when your application needs to read quickly and frequently, but writes relatively infrequently
- **Serverless** 📈 - Thanks to Cloudflare Worker's infrastructure, Cache Cloud is auto-scaling, has zero cold starts and with no servers to maintain.
- **Affordable** 🤑 - Cache Cloud doesn't impose additional costs. Charging is entirely based on Cloudflare Workers and KV, which offer a generous free quota (100,000 requests daily) with affordable paid plans ($5/10 million requests).

## Benchmarks

Note: There could be deviations if the benchmarking scripts are executed in different locations in the world.

See detailed results in the [benchmarks doc](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/benchmarks/BENCHMARKS.md)

### 1. Single-key read operation

|                      | ms  |
| -------------------- | --- |
| Mean                 | 30  |
| Min                  | 20  |
| Lower quartile (25%) | 25  |
| Median (50%)         | 27  |
| Upper quartile (75%) | 31  |
| Max                  | 244 |

### 2. Multiple-keys read operation (5 keys)

|                      | ms  |
| -------------------- | --- |
| Mean                 | 40  |
| Min                  | 25  |
| Lower quartile (25%) | 31  |
| Median (50%)         | 34  |
| Upper quartile (75%) | 38  |
| Max                  | 373 |

### 3. Multiple-keys read operation (20 keys)

|                      | ms  |
| -------------------- | --- |
| Mean                 | 85  |
| Min                  | 62  |
| Lower quartile (25%) | 75  |
| Median (50%)         | 80  |
| Upper quartile (75%) | 87  |
| Max                  | 733 |

### 4. Single-key write operation

|                      | ms  |
| -------------------- | --- |
| Mean                 | 134 |
| Min                  | 101 |
| Lower quartile (25%) | 128 |
| Median (50%)         | 134 |
| Upper quartile (75%) | 139 |
| Max                  | 313 |

### 5. Single-key delete operation

|                      | ms  |
| -------------------- | --- |
| Mean                 | 131 |
| Min                  | 86  |
| Lower quartile (25%) | 113 |
| Median (50%)         | 132 |
| Upper quartile (75%) | 138 |
| Max                  | 341 |

### 6. Single-key list operation

|                      | ms  |
| -------------------- | --- |
| Mean                 | 31  |
| Min                  | 22  |
| Lower quartile (25%) | 25  |
| Median (50%)         | 28  |
| Upper quartile (75%) | 31  |
| Max                  | 158 |
