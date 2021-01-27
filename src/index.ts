import * as core from '@actions/core';

import wait from './wait';

// @credit https://github.com/actions/typescript-action
export default async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds');
    // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
    core.debug(`Waiting ${ms} milliseconds ...`);

    core.debug(new Date().toISOString());
    await wait(parseInt(ms, 10));
    core.debug(new Date().toISOString());

    core.setOutput('time', new Date().toISOString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

/* istanbul ignore if */
if (!module.parent) {
  run();
}
