# API Doc

Here's the [Get Started Guide](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md) if you haven't set up Cache Cloud yet.

## Table of Content

1. [Authentication](#authentication)
1. [CORS](#cors)
1. [Operations](#operations)
   1. [Upsert](#1-upsert)
   2. [Bulk Upsert](#2-bulk-upsert)

---

## Authentication

![API Doc Authentication](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/api-doc-authentication.png)

Important: Everytime you update `API_TOKEN`, you need to `wrangler deploy` or `npm run deploy` to Cloudflare.

If you've enabled API token protection for your Cache Cloud host, there are 2 ways you can pass the `API_TOKEN` in the operations

1. `X-API-Token` header

<pre>
curl --location --request PUT '<b>{{YOUR_CACHE_CLOUD_HOST}}</b>/kv/values/key-1' \
--header '<b>X-API-Token: {{YOUR_SECURE_API_TOKEN}}</b>' \
--header 'Content-Type: application/json' \
--data '{
    "value": { "nested": "value" },
    "expirationTtl": 3600
}'
</pre>

2. Or, the `bearer token`

<pre>
curl --location --request PUT '<b>{{YOUR_CACHE_CLOUD_HOST}}</b>/kv/values/key-1' \
--header '<b>Authorization: Bearer {{YOUR_SECURE_API_TOKEN}}</b>' \
--header 'Content-Type: application/json' \
--data '{
    "value": { "nested": "value" },
    "expirationTtl": 3600
}'
</pre>

---

## CORS

![API Doc Authentication](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/api-doc-cors.png)

Important: Everytime you update `CORS_ORIGINS`, you need to `wrangler deploy` or `npm run deploy` to Cloudflare.

By default,

---

## Operations

With Cache Cloud, you can `upsert` values to cache key, `get` value of cache key, `delete` cache key and `list` the existing cache key.

### 1. Upsert

**PUT** `/kv/values/<key>`

#### Request Body

| Field         | Required? | Default Value | Type              | Description                                     |
| ------------- | --------- | ------------- | ----------------- | ----------------------------------------------- |
| value         | ✅        |               | Any except `null` | The value to be writen to the cache key `<key>` |
| expirationTtl |           | infinite      | integer           | seconds from now that the cache will expire     |
| expiration    |           | infinite      | integer           | seconds since epoch that the cache will expire  |

#### Response Body

| Field   | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| success | boolean | Whether the operation is successful          |
| error   | string  | Error message (if operation is unsuccessful) |

#### Example

**PUT** `/kv/values/user%3A1%3Ainfo`

```JSON
{
  "value": {
      "name": "Patrick Chiu",
      "city": "Toronto"
    },
  "expirationTtl": 3600
}
```

<details>
  <summary>Explaination</summary>

- upsert the user info `{ "name": "...", "city": "..." }`
- to the cache key `user:1:info`
  - make sure to encode special character e.g. `encodeURIComponent('user:1:info')`
- which expire after 1 hour (60s \* 60m)

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error } = await fetch("<YOUR_CACHE_CLOUD_HOST>/kv/values/user%3A1%3Ainfo", {
  method: 'PUT',
  
})

```

</details>

```
