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

Cache Cloud leverages the edgy and serverless nature of Cloudflare Workers and KV and is very affordable. See benchmarks in the next section!

- **HTTP first** 🌐 - Cache Cloud lets you access Cloudflare Workers KV all over the world with HTTP calls
- **Frequent Read** 📖, but **Infrequent Write** 📝 - Cache Cloud works best when your application needs to read quickly and frequently, but writes relatively infrequently
- **Serverless** 📈 - Thanks to Cloudflare Worker's infrastructure, Cache Cloud is auto-scaling, has zero cold starts and with no servers to maintain.
- **Affordable** 🤑 - Cache Cloud doesn't impose additional costs. Charging is entirely based on Cloudflare Workers and KV, which offer a generous free quota (100,000 requests daily) with affordable paid plans ($5/10 million requests).

## Benchmarks

Note: There could be deviations if the benchmarking scripts are executed in different locations in the world.

See more details in the [benchmarks doc](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/BENCHMARKS.md)

```
1. Single-key read operation

2. Multiple-keys read operation (5 keys)

3. Multiple-keys read operation (20 keys)

4. Single-key write operation

5. Single-key list operation

6. Single-key delete operation
```
