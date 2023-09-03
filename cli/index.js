#!/usr/bin/env node

import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';

import { exec } from 'child_process';

const handleError = (error, stderr) => {
  if (error) {
    console.error(`${error.message}`);
    process.exit();
  }

  if (stderr) {
    console.error(`${stderr}`);
    process.exit();
  }
};

const intro = () => {
  console.log(chalk.yellow(' ----- ----- ----- ----- ----- ----- -----'));
  console.log(chalk.yellow('|       Welcome to Cache Cloud 💵🐮       |'));
  console.log(chalk.yellow('|                                         |'));
  console.log(chalk.yellow('| We will help you setup your Cache Cloud |'));
  console.log(chalk.yellow('| to your Cloudflare Workers and KV,      |'));
  console.log(chalk.yellow('| by asking you a few questions.          |'));
  console.log(chalk.yellow('| You can also read the Get Started guide |'));
  console.log(chalk.yellow('| for reference on the steps!             |'));
  console.log(chalk.yellow(' ----- ----- ----- ----- ----- ----- -----'));
  console.log('');
  console.log(
    'Get started guide: https://github.com/patrick-kw-chiu/cache-cloud/blob/main/doc/GET-STARTED.md'
  );
  console.log('');
};

const checkHasCreatedCFAccount = async () => {
  console.log(chalk.yellow('(1/4) Create Cloudflare Account'));
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
  console.log(
    chalk.yellow(
      'Great! Please login by "Allowing Wrangler to make changes to your Cloudflare account".'
    )
  );
  console.log(
    chalk.yellow(
      'This is for configuring the Cloudflare Workers and KV in the next step.'
    )
  );
  console.log('');

  return new Promise((resolve) => {
    exec('npx wrangler login', (error, stdout, stderr) => {
      handleError(error, stderr);
      console.log(`\n${stdout}\n`);
      resolve({ error, stdout, stderr });
    });
  });
};

const configureWorker = async () => {
  console.log(chalk.yellow('(2/4) Configure Worker and KV'));
  console.log(
    chalk.yellow(
      "How do you want to name your Cache Cloud? The name will appear in your Cache Cloud's url e.g."
    )
  );
  console.log(
    chalk.yellow(
      'https://<your-cache-cloud-name>.<your-cloudflare-subdomain>.workers.dev\n'
    )
  );
  console.log(chalk.yellow('Name must match the following criteria:'));
  console.log(chalk.yellow('- Consists of integers, letters, or hyphens only'));
  console.log(chalk.yellow('- Starts and ends with an integer or letter\n'));

  const askForName = async () => {
    const workerName = await input({
      message: 'Cache Cloud name',
      default: 'cache-cloud',
    });
    const regex = /^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/;
    if (!regex.test(workerName)) {
      console.log(chalk.yellow('Name does not match the criteria :('));
      return await askForName();
    }
    return workerName;
  };
  let workerName = await askForName();
  workerName = workerName.toLowerCase();

  console.log(
    chalk.yellow(`\nCache Cloud Git repo will be cloned as ${workerName}`)
  );
  console.log(
    chalk.yellow(
      `Your Cache Cloud url will be https://${workerName}.<your-cloudflare-subdomain>.workers.dev\n`
    )
  );

  // return new Promise((resolve) => {
  //   exec(
  //     `git clone https://github.com/patrick-kw-chiu/cache-cloud.git ${workerName}`,
  //     (error, stdout, stderr) => {
  //       handleError(error, stderr);
  //       exec('cd ./cache-cloud/app', () => {
  //         console.log(`\n${stdout}\n`);
  //         resolve({ error, stdout, stderr });
  //       });
  //     }
  //   );
  // });
};

const run = async () => {
  // 0. intro
  intro();

  // 1. Create a Cloudflare account
  const hasCreatedCFAccount = await checkHasCreatedCFAccount();
  if (!hasCreatedCFAccount) {
    return;
  }
  const loginResult = await loginToCF();

  // 2. Configure Cloudflare Workers and KV
  await configureWorker();
};

run();
