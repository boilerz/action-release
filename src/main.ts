import * as core from '@actions/core';
import * as exec from '@actions/exec';

import * as gitHelper from './git-helper';
import * as packageHelper from './package-helper';
import { Registry } from './package-helper';

export default async function run(): Promise<void> {
  try {
    if (core.getInput('version') !== 'true') {
      core.warning('Skipping version (flag false), release and publish');
      return;
    }

    const baseBranch = core.getInput('baseBranch');
    const currentBranch = gitHelper.getCurrentBranch();
    if (currentBranch !== baseBranch) {
      core.warning(
        `Current branch: ${currentBranch}, releasing only from ${baseBranch}`,
      );
      return;
    }

    core.info('Detecting bump type given branch/commit');
    const bumpType = gitHelper.detectBumpType();

    core.info(`Versioning a ${bumpType}`);
    await gitHelper.version(bumpType);

    if (core.getInput('release') === 'true') {
      core.info('Releasing');
      await gitHelper.release();
    }

    if (core.getInput('publish') === 'true') {
      if (core.getInput('buildStep') === 'true') {
        core.info('Extra build step');
        await exec.exec('yarn', ['build']);
      }

      core.info('Setting npm rc for publish');
      await packageHelper.setupNpmRcForPublish();

      const publishDirectory = core.getInput('publishDirectory');
      core.info(`Trying to publish from ${publishDirectory}`);
      await packageHelper.publish(Registry.GITHUB, publishDirectory);
      await packageHelper.publish(Registry.NPM, publishDirectory);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

/* istanbul ignore if */
if (!module.parent) {
  run();
}
