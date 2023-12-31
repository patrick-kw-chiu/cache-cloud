# Quick Setup Guide

Already set up Cache Cloud? Visit the [API Doc](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/API-DOC.md) for the actual usage.

## Use Setup Wizard

`npx cache-cloud-cli` to setup everything ~ 5 mins

<img width="367" alt="Screenshot 2023-09-09 at 4 06 32 PM" src="https://github.com/patrick-kw-chiu/cache-cloud/assets/42149082/af411a16-cdbe-4f11-ae81-21a3ed76a705">


## ...Or Manually Setup

1. [Create a Cloudflare account](#1-create-a-cloudflare-account)
2. [Configure Cloudflare Workers KV](#2-configure-cloudflare-workersand-kv)
3. [Clone and setup Cache Cloud](#3-clone-and-setup-cache-cloud)
4. [Deploy to Cloudflare Workers!](#4-deploy-to-cloudflare-workers)

---

### 1. Create a Cloudflare account

[Create a Cloudflare account via the dashboard](https://dash.cloudflare.com/sign-up)

### 2. Configure Cloudflare Workers and KV

#### 2.1. Configure Cloudflare Workers

1. Click **"Overview"** > Click **"Create Worker"**

![step 1](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-cloudflare-workers-1.png)

2. Name your Worker's subdomain as **"cache-cloud"** > Click **"Deploy"**

![step 2](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-cloudflare-workers-2.png)

3. Congratulations! Your Worker is deployed to Region: **"Earth"**.

Yes, Earth! It is available in Cloudflare's global edge network.

The base subdomain is preset by Cloudflare, but you can update it as you wish to. In my case, the base subdomain is **cache-cloud-demo**.

![step 3](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-cloudflare-workers-3.png)

#### 2.2. Configure KV

1. Click **"KV"** > Click **"Create a namespace"** > Name your KV namespace as **"cache-cloud"** > **"Add"**

![step 1](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-kv-1.png)

2. Congratulations! Your KV is added.

Notice the ID here - it will be used in Step 3.

![step 2](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-kv-2.png)

### 3. Clone and setup Cache Cloud

1. Clone the Cache Cloud repo

```shell
git clone git@github.com:patrick-kw-chiu/cache-cloud.git
cd ./cache-cloud/app
```

2. Install package - Cloudflare expect the deployed workers script to have all the relevant package

_Note: my current Node.js version is v18.12.1_

```shell
npm install
```

3. Configure `wrangler.toml` with the sample file

Click `wrangler.sample.toml` > Save as `wrangler.toml`

![step 1](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-wrangler-toml-1.png)

Replace the `id` and `preview_id` with the KV id you get in **"Step 2 - Configure KV"**

![step 2](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/configure-wrangler-toml-2.png)

(Optional) Safe guard your KV with an **ultra-super-secure** `API_KEY`

(Optional) Add `CORS_ORIGINS` if it is meant to be accessed via the browser

### 4. Deploy to Cloudflare Workers!

Login in the terminal > **"Allow"** Wrangler to make changes

```shell
npx wrangler login
```

![step 1](https://github.com/patrick-kw-chiu/cache-cloud/blob/main/assets/deploy-to-cloudflare-workers-1.png)

```shell
npx wrangler deploy
```
