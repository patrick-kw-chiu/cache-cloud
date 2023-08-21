# API Doc

Here's the [Get Started Guide](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md) if you haven't set up Cache Cloud yet.

## Table of Content

1. [Authentication](#authentication)
1. [CORS](#cors)
1. [Operations](#operations)
   1. Upsert
      1. [Upsert a cache key](#1-upsert-a-cache-key)
      2. [Bulk Upsert cache keys](#2-bulk-upsert-cache-keys)
   2. Get
      1. [Get value of a cache key](#3-get-value-of-a-cache-key)
      2. [Bulk Get values of cache keys](#4-bulk-get-values-of-cache-keys)
   3. Delete
      1. [Delete a cache key](#5-delete-a-cache-key)
      2. [Bulk Delete cache keys](#6-bulk-delete-cache-keys)
   4. List
      1. [List cache keys](#7-list-cache-keys)

---

## Authentication

![API Doc Authentication](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/api-doc-authentication.png)

> Important: Everytime you update `API_TOKEN`, you need to `wrangler deploy` or `npm run deploy` to Cloudflare.

In `wrangler.toml`...

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

If the API token is invalid, the error response will be

HTTP Status: **401 Unauthorized**

```JSON
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## CORS

![API Doc Authentication](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/api-doc-cors.png)

> Important: Everytime you update `CORS_ORIGINS`, you need to `wrangler deploy` or `npm run deploy` to Cloudflare.

In `wrangler.toml`...

- If you haven't enabled CORS, no domains are allowed to access your Cache Cloud host via the browser
- To cors-enabled all domains, update the line to be `CORS_ORIGINS = "*"`
- To cors-enabled only a few domains, update the line to be `CORS_ORIGINS = ["{{host-you-allowed}}", "https://example.com"]`

---

## Operations

Cache Cloud let you `upsert` values to cache key, `get` value of cache key, `delete` cache key and `list` the existing cache key.

### 1. Upsert a cache key

**PUT** `/kv/values/{{key}}`

#### Path Parameter

| Field | Required? | Default Value | Type   | Description                   |
| ----- | --------- | ------------- | ------ | ----------------------------- |
| key   | ✅        |               | string | The cache key to upsert value |

#### Request Body

| Field         | Required? | Default Value | Type              | Description                                       |
| ------------- | --------- | ------------- | ----------------- | ------------------------------------------------- |
| value         | ✅        |               | Any except `null` | The value to be writen to the cache key `{{key}}` |
| expirationTtl |           | infinite      | integer           | seconds from now that the cache will expire       |
| expiration    |           | infinite      | integer           | seconds since epoch that the cache will expire    |

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

<br>

In the example, we...

- upsert the user info `{ "name": "...", "city": "..." }`
- to the cache key `user:1:info`
  - make sure to encode special character e.g. `encodeURIComponent('user:1:info')`
- which expire after 1 hour (60s \* 60m)

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values/user%3A1%3Ainfo",
  {
    method: 'PUT',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      value: {
        name: "Patrick Chiu",
        city: "Toronto"
      },
      expirationTtl: 3600
    })
  }
)
```
</details>

---

### 2. Bulk Upsert cache keys

**POST** `/kv/values`

#### Request Body

Array of object(s) with the following fields

| Field         | Required? | Default Value | Type              | Description                                       |
| ------------- | --------- | ------------- | ----------------- | ------------------------------------------------- |
| key           | ✅        |               | string            | The cache key to upsert value                     |
| value         | ✅        |               | Any except `null` | The value to be writen to the cache key `{{key}}` |
| expirationTtl |           | infinite      | integer           | seconds from now that the cache will expire       |
| expiration    |           | infinite      | integer           | seconds since epoch that the cache will expire    |

#### Response Body

| Field   | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| success | boolean | Whether the operation is successful          |
| error   | string  | Error message (if operation is unsuccessful) |

#### Example

**POST** `/kv/values`

```JSON
[
  {
    "key": "latest-blog-post-previews",
    "value": [
      {
        "title": "Migrating a Node.js App to Cloudflare Workers",
        "subtitle": "Redesigning a Node.js/MongoDB app for Cloudflare Workers and the design considerations"
      },
      { ... },
      { ... }
    ],
    "expiration": 1690761600
  },
  {
    "key": "pinned-blog-post-previews",
    "value": [
      { ... },
      { ... },
      { ... }
    ],
    "expiration": 1690761600
  }
]
```

<details>
  <summary>Explaination</summary>
  <br>

Imagine you want to speed-up your blog platform which needs to have quick access to

- the latest blog posts
- the pinned blog posts

You can upsert all the info with 1 `Bulk Upsert` operation by providing an array of object. Take the 1st element as example,

- the cache key is `latest-blog-post-previews`
- the value upsert to the key is an array of objects with 2 fields `title` and `subtitle`
- which expire at 2023-07-31 (1690761600 seconds since epoch)
  - `new Date('2023-07-31').getTime() / 1000 => 1690761600000`

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values",
  {
    method: 'POST',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
      "Content-Type": "application/json"
    },
    body: JSON.stringify([
      {
        "key": "latest-blog-post-previews",
        "value": [
          { ... },
          { ... }
        ],
        "expiration": 1690761600
      },
      {
        "key": "pinned-blog-post-previews",
        "value": [
          { ... },
          { ... }
        ],
        "expiration": 1690761600
      }
    ])
  }
)
```
</details>

---

### 3. Get value of a cache key

**GET** `/kv/values/{{key}}`

#### Path Parameter

| Field | Required? | Default Value | Type   | Description                     |
| ----- | --------- | ------------- | ------ | ------------------------------- |
| key   | ✅        |               | string | The cache key to get value from |

#### Response Body

| Field   | Type          | Description                                                                                         |
| ------- | ------------- | --------------------------------------------------------------------------------------------------- |
| success | boolean       | Whether the operation is successful                                                                 |
| result  | any or `null` | If there is value in the cache key, well, it will be the value<br>If there isn't, it will be `null` |
| error   | string        | Error message (if operation is unsuccessful)                                                        |

#### Example

**GET** `/kv/values/user%3A1%3Ainfo`

<details>
  <summary>Explaination</summary>

<br>

In the example, we...

- access the value of the cache key `user:1:info`
- make sure to encode special character e.g. `encodeURIComponent('user:1:info')`

In the [Upsert a cache key](#1-upsert-a-cache-key) section, we upsert the user info `{ "name": "...", "city": "..." }`. If the cache hasn't expired, the result will be

```JSON
{
  "success": true,
  "result": {
    "name": "Patrick Chiu",
    "city": "Toronto"
  }
}
```

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error, result } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values/user%3A1%3Ainfo",
  {
    method: 'GET',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
    }
  }
)
```
</details>

---

### 4. Bulk Get values of cache keys

**GET** `/kv/keys?key={{key-1}}&key={{key-2}}...`

#### Query Paramater

| Field | Required? | Default Value | Type   | Description                        |
| ----- | --------- | ------------- | ------ | ---------------------------------- |
| key   | ✅        |               | string | The cache key(s) to get value from |

#### Response Body

| Field   | Type                                       | Description                                                                                         |
| ------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| success | boolean                                    | Whether the operation is successful                                                                 |
| results | array of object of field `key` and `value` | If there is value in the cache key, well, it will be the value<br>If there isn't, it will be `null` |
| error   | string                                     | Error message (if operation is unsuccessful)                                                        |

#### Example

**GET** `/kv/values?key=hot-products&key=recommended-products-for-cluster-6`

<details>
  <summary>Explaination</summary>

<br>

Imagine you power an E-commerce app. In the home screen, you want to quickly show the `hot products`. You also know that the user is in the user cluster #6 and want to quickly show the `recommended products` for the cluster.

In this example, we...

- access the value of the cache key `hot-products`
- access the value of the cache key `recommended-products-for-cluster-6`

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error, results } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values?key=hot-products&key=recommended-products-for-cluster-6",
  {
    method: 'GET',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
    }
  }
)
```
</details>

---

### 5. Delete a cache key

**DELETE** `/kv/values/{{key}}`

#### Path Parameter

| Field | Required? | Default Value | Type   | Description             |
| ----- | --------- | ------------- | ------ | ----------------------- |
| key   | ✅        |               | string | The cache key to delete |

#### Response Body

| Field   | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| success | boolean | Whether the operation is successful          |
| error   | string  | Error message (if operation is unsuccessful) |

#### Example

**DELETE** `/kv/values/event-1-pinned-messages`

<details>
  <summary>Explaination</summary>

<br>

In the example, we delete the cache key `event-1-pinned-messages`

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values/event-1-pinned-messages",
  {
    method: 'DELETE',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
    }
  }
)
```
</details>

---

### 6. Bulk Delete cache keys

placeholder

**DELETE** `/kv/values`

#### Request Body

Array of strings which represent the `cache keys`.

#### Response Body

| Field   | Type    | Description                                  |
| ------- | ------- | -------------------------------------------- |
| success | boolean | Whether the operation is successful          |
| error   | string  | Error message (if operation is unsuccessful) |

#### Example

**DELETE** `/kv/values`

```JSON
[
  "event-1-pinned-messages",
  "event-2-pinned-messages",
  "event-3-pinned-messages"
]
```

<details>
  <summary>Explaination</summary>

<br>

In the example, we delete the cache key `event-1-pinned-messages`, `event-2-pinned-messages`, `event-3-pinned-messages`.

</details>

<details>
  <summary>JavaScript - Fetch</summary>

```javascript
const { success, error } = await fetch('{{YOUR_CACHE_CLOUD_HOST}}/kv/values', {
  method: 'DELETE',
  headers: {
    'X-API-Token': '{{YOUR_SECURE_API_TOKEN}}',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify([
    'event-1-pinned-messages',
    'event-2-pinned-messages',
    'event-3-pinned-messages',
  ]),
});
```

</details>

---

### 7. List cache keys

placeholder

**GET** `/kv/values?prefix={{prefix}}&limit={{limit}}&cursor={{cursor}}`

#### Query Paramater

| Field  | Required? | Default Value | Type    | Description                                                                                                                                                                   |
| ------ | --------- | ------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| prefix |           |               | string  | Represents a prefix you can use to filter all keys                                                                                                                            |
| limit  |           |               | integer | The maximum number of keys returned. The default is 1,000, which is the maximum. It is unlikely that you will want to change this default but it is included for completeness |
| cursor |           |               | string  | Used for paginating responses. `cursor` will be returned if there are more cache keys than the `limit`.                                                                       |

#### Response Body

| Field        | Type            | Description                                                                                                                               |
| ------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| success      | boolean         | Whether the operation is successful                                                                                                       |
| keys         | array of string | The available cache keys                                                                                                                  |
| listComplete | boolean         | If there are more cache keys to be listed than the specified `limit`, `listComplete` will be `false` and vice versa                       |
| cursor       | string          | Used for paginating responses. `cursor` will be returned if `listComplete` is false (there are more cache keys to list than the `limit`). |
| error        | string          | Error message (if operation is unsuccessful)                                                                                              |

#### Example

**GET** `/kv/values?prefix=user%3A1%3A&limit=10`

<details>
  <summary>Explaination</summary>

<br>

In the example, we list all the `cache keys` related to the user 1, which is prefixed with `user:1:`. We also set the `limit` to 10. Therefore max only 10 `cache keys` starting with `user:1:` will be returned.

</details>

<details>
  <summary>JavaScript - Fetch</summary>
  
```javascript
const { success, error, keys, listComplete, cursor } = await fetch(
  "{{YOUR_CACHE_CLOUD_HOST}}/kv/values?prefix=user%3A1%3A&limit=10",
  {
    method: 'GET',
    headers: {
      "X-API-Token": "{{YOUR_SECURE_API_TOKEN}}",
    }
  }
)
```
</details>

---
