#!/usr/bin/env node

// Standard libraries
import util from 'util';
import child_process from 'child_process';
import fs from 'fs';

// Libraries
import { input, confirm, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

// Contants
import { TOML, PATH, COMMAND, REGEX, CONTENT } from './constants.js';

// Utilities
import { handleError } from './utilities.js';
console.ccLog = (message) => console.log(chalk.green(`💵🐮 ${message}`));
console.yellowLog = (message) => console.log(chalk.yellow(message));
const exec = util.promisify(child_process.exec);

// 1
const checkHasCreatedCFAccount = async () => {
  console.yellowLog('(1/4) Have Created a Cloudflare Account');
  const hasCreatedCFAccount = await confirm({
    message: 'Have you created a Cloudflare account?',
    default: 'y',
  });

  if (!hasCreatedCFAccount) {
    console.log(
      'Please create a Cloudflare account here - https://dash.cloudflare.com/sign-up'
    );
    console.log('Then, re-run this CLI utility again!');
  }

  console.log('');

  return hasCreatedCFAccount;
};

const loginToCF = async () => {
  console.yellowLog(
    'Great! Please login by "Allowing Wrangler to make changes to your Cloudflare account".'
  );
  console.yellowLog(
    'This is for configuring the Cloudflare Workers and KV in the next step.'
  );
  console.log('');

  console.ccLog(COMMAND.wranglerLogin);
  try {
    const { stdout, stderr } = await exec(COMMAND.wranglerLogin);
    handleError(stderr);
    return { stdout, stderr };
  } catch (e) {
    const { stderr } = e;
    handleError(stderr);
  }
};

// 2
const gitClone = async () => {
  console.log('');
  console.yellowLog('(2/4) Clone and Setup Cache Cloud');

  try {
    console.ccLog(COMMAND.gitClone);
    const { stdout, stderr } = await exec(`${COMMAND.gitClone}`);

    //
    const npmInstallResult = await npmInstall();

    return { stdout, stderr };
  } catch (e) {
    console.log(e);
    const { stderr } = e;
    handleError(stderr);
  }
};

const npmInstall = async () => {
  console.ccLog(COMMAND.cdToApp);
  console.ccLog(COMMAND.npmInstall);

  try {
    const { stdout, stderr } = await exec(`${COMMAND.cdToApp}
      ${COMMAND.npmInstall}`);

    return { stdout, stderr };
  } catch (e) {
    const { stderr } = e;
    handleError(stderr);
  }
};

const configureWorkerAndKv = async () => {
  console.log('');
  console.yellowLog('(3/4) Configure Worker and KV');
  console.yellowLog(
    "How do you want to name your Cache Cloud? The name will appear in your Cache Cloud's url e.g."
  );

  console.yellowLog(
    'https://<your-cache-cloud-name>.<your-cloudflare-subdomain>.workers.dev\n'
  );
  console.yellowLog('Name must match the following criteria:');
  console.yellowLog('- Consists of integers, letters, or hyphens only');
  console.yellowLog('- Starts and ends with an integer or letter\n');

  let workerName = await askForName();
  workerName = workerName.toLowerCase();

  console.yellowLog(
    `Your Cache Cloud url will be https://${workerName}.<your-cloudflare-subdomain>.workers.dev\n`
  );

  //
  initWranglerToml(workerName);

  //
  await deployWorker();

  //
  const { kvId } = await initCFKV();
  await bindKvToWorker(kvId);
};

const askForName = async () => {
  const workerName = await input({
    message: 'Cache Cloud name',
    default: 'cache-cloud',
  });
  if (!REGEX.validateKvName.test(workerName)) {
    console.yellowLog('Name does not match the criteria :(');
    return await askForName();
  }
  return workerName;
};

const prepandWranglerTomlWithAccountId = (accountId) => {
  try {
    console.ccLog(CONTENT.addToToml);
    const accountIdSection = 'account_id = "' + accountId + '"' + '\n';
    console.yellowLog(accountIdSection);

    const data = fs.readFileSync(PATH.wranglerToml, 'utf8');
    const result = accountIdSection + data;
    fs.writeFileSync(PATH.wranglerToml, result, 'utf8');
  } catch (err) {
    console.error(err);
  }
};

const initWranglerToml = (workerName) => {
  try {
    console.log('');
    console.ccLog(
      `Initialize "wrangler.toml" and set up the Worker's name as "${workerName}"`
    );

    const result = TOML.rawWrangler.replace(
      'name = "cache-cloud"',
      `name = "${workerName}"`
    );

    fs.writeFileSync(PATH.wranglerToml, result, 'utf8');
  } catch (err) {
    console.error(err);
  }
};

const deployWorker = async () => {
  console.ccLog(COMMAND.wranglerDeploy);

  try {
    const { stdout, stderr } = await exec(`${COMMAND.cdToApp}
    ${COMMAND.wranglerDeploy}`);

    console.log(stdout);

    return { stdout, stderr };
  } catch (e) {
    const { stderr } = e;
    if (
      stderr.includes(
        'More than one account available but unable to select one in non-interactive mode.'
      )
    ) {
      console.yellowLog(
        'More than one account available. Please input the account ID you want to deploy Cache Cloud to.'
      );
      const { stdout } = await exec(`${COMMAND.wranglerWhoAmI}`);
      console.log(
        stdout.split(
          '🔓 Token Permissions: If scopes are missing, you may need to logout and re-login.'
        )[0]
      );

      const accountId = await input({
        message: 'Account ID',
      });

      prepandWranglerTomlWithAccountId(accountId);

      return deployWorker();
    } else {
      handleError(stderr);
    }
  }
};

const initCFKV = async () => {
  console.ccLog(COMMAND.wranglerInitKV);

  try {
    const { stdout, stderr } = await exec(`${COMMAND.cdToApp}
    ${COMMAND.wranglerInitKV}`);

    let kvId = '';
    stdout.split('\n').forEach((line) => {
      if (REGEX.extractKvId.test(line)) {
        kvId = line.replace('{ binding = "kv", id = "', '').replace('" }', '');
      }
    });

    return { kvId };
  } catch (e) {
    const { stderr } = e;
    handleError(stderr);
  }
};

const bindKvToWorker = (kvId) => {
  try {
    console.log('');
    console.ccLog(CONTENT.addToToml);
    const kvSection = TOML.kvSection.replaceAll('{{kvId}}', kvId);
    console.yellowLog(kvSection);

    const data = fs.readFileSync(PATH.wranglerToml, 'utf8');
    const result = data + '\n\n' + kvSection;
    fs.writeFileSync(PATH.wranglerToml, result, 'utf8');
  } catch (err) {
    handleError(err);
  }
};

// 4.
const setupOptionalSettings = async () => {
  console.log('');
  console.yellowLog('(4/4) Optional settigs for API token and CORS');

  const uuids = new Array(4).fill(0).map(() => uuidv4());

  let apiTokenAnswer = await select({
    message:
      "(Optional) Would you like to protect your Cache Cloud with an API token? Here's some freshly generated UUIDs!",
    choices: [
      {
        name: 'Nope',
        value: 'no',
      },
      ...uuids.map((uuid) => ({
        name: uuid,
        value: uuid,
      })),
      {
        name: 'Input custom API token',
        value: 'custom-api-token',
      },
    ],
  });

  if (apiTokenAnswer === 'custom-api-token') {
    apiTokenAnswer = await input({
      message: 'Your custom API token',
    });
  }

  let corsAnswer = await select({
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
  });

  if (corsAnswer === 'custom-hosts') {
    corsAnswer = await input({
      message:
        'Your custom hosts. Use comma to separate the hosts e.g. http://localhost:3000,http://example.com',
    });
  }

  let varsSection = TOML.varsSection;
  if (apiTokenAnswer === 'no') {
    console.ccLog(`Not adding API token to your Cache Cloud`);
  } else {
    varsSection = varsSection + '\n' + `API_TOKEN = "${apiTokenAnswer}"`;
  }

  if (corsAnswer === 'disallow-all-origins') {
    console.ccLog(`Not adding CORS to your Cache Cloud`);
  } else if (corsAnswer === '"*"') {
    varsSection = varsSection + '\n' + `CORS_ORIGINS = ${corsAnswer}`;
  } else {
    varsSection =
      varsSection +
      '\n' +
      `CORS_ORIGINS = ${JSON.stringify(corsAnswer.split(','))}`;
  }

  if (apiTokenAnswer === 'no' && corsAnswer === 'disallow-all-origins') {
    return;
  }

  try {
    console.log('');
    console.ccLog(CONTENT.addToToml);
    varsSection = varsSection + '\n';
    console.yellowLog(varsSection);

    const data = fs.readFileSync(PATH.wranglerToml, 'utf8');

    const result = data + '\n\n' + varsSection;

    fs.writeFileSync(PATH.wranglerToml, result, 'utf8');
  } catch (err) {
    handleError(err);
  }
};

const run = async () => {
  // 0. intro
  console.yellowLog(CONTENT.intro);

  // 1. Create a Cloudflare account
  const hasCreatedCFAccount = await checkHasCreatedCFAccount();
  if (!hasCreatedCFAccount) {
    return;
  }
  await loginToCF();

  // 2. Clone and Setup Cache Cloud Git Repo
  await gitClone();

  // 3. Configure Cloudflare Workers and KV
  await configureWorkerAndKv();

  // 4. Optional Settings
  await setupOptionalSettings();
  await deployWorker();
};

run();
