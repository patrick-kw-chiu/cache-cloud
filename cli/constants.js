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

export const STEP = {
  1: {
    title: '(1/4) Have You Created a Cloudflare Account?',
    confirmHasAccount: {
      message: 'Have you created a Cloudflare account?',
      default: 'y',
    },
    noAccountMessage: `Please create a Cloudflare account here - https://dash.cloudflare.com/sign-up
Then, re-run this CLI utility again!
`,
    hasAccoutMessage: `Great! Please login by "Allowing Wrangler to make changes to your Cloudflare account".
This is for configuring the Cloudflare Workers and KV in the next step.
`,
  },
  2: {
    title: '(2/4) Clone and Setup Cache Cloud',
  },
  3: {
    title: '(3/4) Configure Worker and KV',
    howToName: `How do you want to name your Cache Cloud? The name will appear in your Cache Cloud's url e.g.
https://<your-cache-cloud-name>.<your-cloudflare-subdomain>.workers.dev

Name must match the following criteria:
- Consists of integers, letters, or hyphens only
- Starts and ends with an integer or letter
`,
    yourWorkerUrl: `Your Cache Cloud url will be https://{{workerName}}.<your-cloudflare-subdomain>.workers.dev`,
    askForName: {
      message: 'Cache Cloud name',
      default: 'cache-cloud',
    },
    invalidName: 'Name does not match the criteria :(',
    initializeYourWorkerAs:
      'Initialize "wrangler.toml" and set up the Worker\'s name as "{{workerName}}"',
  },
  4: {
    title: '(4/4) Optional settigs for API key and CORS',
    apiKeyAnswer: {
      message:
        "(Optional) Would you like to protect your Cache Cloud with an API key? Here're some freshly generated UUIDs!",
      choices: [
        {
          name: 'Input custom API key',
          value: 'custom-api-key',
        },
        {
          name: 'Nope',
          value: 'no',
        },
      ],
    },
    customApiKey: 'Your custom API key',
    notAddingApiKey: 'Not adding API key to your Cache Cloud',
    corsAnswer: {
      message:
        '(Optional) Would you like to add CORS origins to your Cache Cloud?',
      choices: [
        {
          name: 'Allow all origins',
          value: '"*"',
          description:
            '"*" - Allow all origins (from browser side) to access Cache Cloud',
        },
        {
          name: 'Disallow all origins',
          value: 'disallow-all-origins',
          description:
            'Disallow all origins (from browser side) to access Cache Cloud',
        },
        {
          name: 'Input custom hosts',
          value: 'custom-hosts',
        },
        ,
      ],
    },
    customCorsHosts:
      'Your custom hosts. Use comma to separate the hosts e.g. http://localhost:3000,http://example.com',
    notAddingCors: 'Not adding CORS to your Cache Cloud',
  },
};

export const CONTENT = {
  intro: `
 ----- ----- ----- ----- ----- ----- -----
|     Welcome to Cache Cloud CLI 💵🐮     |
|                                         |
| This is Cache Cloud's CLI toolkit to    |
| help you setup Cache Cloud on your      |
| Cloudflare Workers and KV!              |
 ----- ----- ----- ----- ----- ----- -----

`,
  _temp:
    'Get started guide: https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md',
  addToToml: `Adding the following to "wrangler.toml"`,
  closing: `
Congratulations! You have successfully setup Cache Cloud!
Next, feel free to have a look on the API doc to see what you can do with Cache Cloud

API Doc: https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/API-DOC.md
`,
};
