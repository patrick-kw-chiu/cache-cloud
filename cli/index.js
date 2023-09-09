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
import { TOML, PATH, COMMAND, REGEX, CONTENT, STEP } from './constants.js';

// Utilities
import { handleError } from './utilities.js';
console.ccLog = (message) => console.log(chalk.green(`💵🐮 ${message}`));
console.yellowLog = (message) => console.log(chalk.yellow(message));
const exec = util.promisify(child_process.exec);

// 1
const checkHasCreatedCFAccount = async () => {
  console.yellowLog(STEP['1'].title);
  console.log('');
  const hasCreatedCFAccount = await confirm({
    message: STEP['1'].confirmHasAccount.message,
    default: STEP['1'].confirmHasAccount.default,
  });

  if (!hasCreatedCFAccount) {
    console.log(STEP['1'].noAccountMessage);
  }

  console.log('');

  return hasCreatedCFAccount;
};

const loginToCF = async () => {
  console.yellowLog(STEP['1'].hasAccoutMessage);

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
  console.yellowLog(STEP['2'].title);

  try {
    console.ccLog(COMMAND.gitClone);
    const { stdout, stderr } = await exec(`${COMMAND.gitClone}`);

    //
    await npmInstall();

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
  console.yellowLog(STEP['3'].title);
  console.yellowLog(STEP['3'].howToName);

  let workerName = await askForName();
  workerName = workerName.toLowerCase();

  console.yellowLog(
    STEP['3'].yourWorkerUrl.replaceAll('{{workerName}}', workerName)
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
    message: STEP['3'].askForName.message,
    default: STEP['3'].askForName.default,
  });
  if (!REGEX.validateKvName.test(workerName)) {
    console.yellowLog(STEP['3'].invalidName);
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
      STEP['3'].initializeYourWorkerAs.replaceAll('{{workerName}}', workerName)
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
  console.yellowLog(STEP['4'].title);

  const uuids = new Array(4).fill(0).map(() => uuidv4());

  let apiKeyAnswer = await select({
    message: STEP['4'].apiKeyAnswer.message,
    choices: [
      ...uuids.map((uuid) => ({
        name: uuid,
        value: uuid,
      })),
      ...STEP['4'].apiKeyAnswer.choices,
    ],
  });

  if (apiKeyAnswer === 'custom-api-key') {
    apiKeyAnswer = await input({
      message: STEP['4'].customApiKey,
    });
  }

  let corsAnswer = await select({
    message: STEP['4'].corsAnswer.message,
    choices: STEP['4'].corsAnswer.choices,
  });

  if (corsAnswer === 'custom-hosts') {
    corsAnswer = await input({
      message: STEP['4'].customCorsHosts,
    });
  }

  let varsSection = TOML.varsSection;
  if (apiKeyAnswer === 'no') {
    console.ccLog(STEP['4'].notAddingApiKey);
  } else {
    varsSection = varsSection + '\n' + `API_KEY = "${apiKeyAnswer}"`;
  }

  if (corsAnswer === 'disallow-all-origins') {
    console.ccLog(STEP['4'].notAddingCors);
  } else if (corsAnswer === '"*"') {
    varsSection = varsSection + '\n' + `CORS_ORIGINS = ${corsAnswer}`;
  } else {
    varsSection =
      varsSection +
      '\n' +
      `CORS_ORIGINS = ${JSON.stringify(corsAnswer.split(','))}`;
  }

  if (apiKeyAnswer === 'no' && corsAnswer === 'disallow-all-origins') {
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
