const wranglerVersion = '3.5.1';

export const NOW_TS = new Date().getTime();

export const TOML = {
  rawWrangler: `name = "cache-cloud"
main = "src/index.ts"
compatibility_date = "2023-07-17"

`,
  kvSection: `[[kv_namespaces]]
binding = "KV"
id = "{{kvId}}"
preview_id = "{{kvId}}"

`,
  varsSection: `[vars]`,
};

export const PATH = {
  wranglerToml: `./cache-cloud-${NOW_TS}/app/wrangler.toml`,
  cacheCloudApp: `./cache-cloud-${NOW_TS}/app`,
};

export const COMMAND = {
  wranglerLogin: `npx wrangler@${wranglerVersion} login`,
  wranglerDeploy: `npx wrangler@${wranglerVersion} deploy`,
  wranglerInitKV: `npx wrangler@${wranglerVersion} kv:namespace create kv`,
  wranglerWhoAmI: `npx wrangler@${wranglerVersion} whoami`,
  cdToApp: `cd ${PATH.cacheCloudApp}`,
  npmInstall: `npm install`,
  gitClone: `git clone https://github.com/patrick-kw-chiu/cache-cloud.git cache-cloud-${NOW_TS}`,
};

export const REGEX = {
  validateKvName: /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/,
  extractKvId: /^\{ binding = "kv", id = ".+" \}$/,
};

export const CONTENT = {
  intro: `
 ----- ----- ----- ----- ----- ----- -----
|     Welcome to Cache Cloud CLI 💵🐮     |
|                                         |
| We will help you setup your Cache Cloud |
| to your Cloudflare Workers and KV,      |
| by asking you a few questions.          |
| You can also read the Get Started guide |
| for reference on the steps!             |
 ----- ----- ----- ----- ----- ----- -----

Get started guide: https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md
`,
  addToToml: `Adding the following to "wrangler.toml"`,
};
