<p align="center">
  <img src="https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/cash-cow-200px.png?raw=true" alt="Cache Cloud | Generated with Stable Diffusion">
  <h6 align="center">
    Icon generated with <a href="https://stablediffusionweb.com/">Stable Diffusion</a>
  </h6>
</p>

Cache Cloud quickly turns your [**Cloud**flare Workers](https://workers.cloudflare.com/) and [KV](https://medium.com/r?url=https%3A%2F%2Fwww.cloudflare.com%2Fproducts%2Fworkers-kv%2F) into a **fast serverless cache store with HTTP endpoints**, built on top of [Hono](https://github.com/honojs/hono).

## Quick example

`npx cache-cloud-cli` to setup everything in 5 mins

<img width="367" alt="Screenshot 2023-09-09 at 4 06 32 PM" src="https://github.com/patrick-kw-chiu/cache-cloud/assets/42149082/76782db9-a494-4a5f-962b-27dce5f9641a">

and...

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

## Quick links

[Get Started Guide](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md) | [API Doc](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/API-DOC.md) | [Detailed Benchmarks](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/benchmarks/BENCHMARKS.md)

## Features

Cache Cloud leverages the edgy and serverless nature of Cloudflare Workers and KV and is very affordable.

- **HTTP first** 🌐 - Cache Cloud lets you access Cloudflare Workers KV all over the world by making HTTP calls
- **Frequent Read** 📖, but **Infrequent Write** 📝 - Cache Cloud works best when your application needs to read quickly and frequently, but writes relatively infrequently
- **Serverless** 📈 - Thanks to Cloudflare Worker's infrastructure, Cache Cloud is auto-scaling, has zero cold starts with no servers to maintain.
- **Affordable** 🤑 - Cache Cloud doesn't impose additional costs. Charging is entirely based on Cloudflare Workers and KV, which offer a generous free quota (100,000 requests daily) with affordable paid plans ($5/10 million requests).

## Benchmarks

Note: There could be deviations if the benchmarking scripts are executed in different locations in the world.

See detailed results in the [benchmarks doc](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/benchmarks/BENCHMARKS.md)

### Operation latency (ms)

|                      | Read 1 key | Read 5 keys | Read 20 keys | Write 1 key | Delete 1 key | List 100 keys |
| -------------------- | ---------- | ----------- | ------------ | ----------- | ------------ | ------------- |
| Mean                 | 30         | 40          | 85           | 134         | 131          | 31            |
| Min                  | 20         | 25          | 62           | 101         | 86           | 22            |
| Lower quartile (25%) | 25         | 31          | 75           | 128         | 113          | 25            |
| Median (50%)         | 27         | 34          | 80           | 134         | 132          | 28            |
| Upper quartile (75%) | 31         | 38          | 87           | 139         | 138          | 31            |
| Max                  | 244        | 373         | 733          | 313         | 341          | 158           |

## Blogs

- [Need some quick cache? Try Cache Cloud!](https://medium.com/@patrick-kw-chiu/need-some-quick-cache-try-cache-cloud-35269aa703eb)
- [Turn your Cloudflare Workers and KV into a fast serverless cache store with HTTP endpoints](https://dev.to/patrickkwchiu/turn-your-cloudflare-workers-and-kv-into-a-fast-serverless-cache-store-with-http-endpoints-102g)
