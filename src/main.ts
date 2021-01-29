import process from 'process';

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import * as gitHelper from './git-helper';
import { Commit } from './git-helper';
import * as packageHelper from './package-helper';
import { Registry } from './package-helper';

export default async function run(): Promise<void> {
  try {
    const commits = github.context.payload.commits as Commit[];
    const [commit] = commits || [];
    const botActor = process.env.GITHUB_USER || 'boilerz-bot';
    if (
      commit &&
      commits.length === 1 &&
      commit.message.startsWith(':bookmark:') &&
      github.context.actor === botActor
    ) {
      core.info(`🤖 Skipping, version commit pushed by ${botActor}`);
      return;
    }

    if (core.getInput('version') !== 'true') {
      core.warning('🚩 Skipping version (flag false), release and publish');
      return;
    }

    const baseBranch = core.getInput('baseBranch');
    const currentBranch = gitHelper.getCurrentBranch();
    if (currentBranch !== baseBranch) {
      core.warning(
        `🚫 Current branch: ${currentBranch}, releasing only from ${baseBranch}`,
      );
      return;
    }

    if (await gitHelper.hasPendingDependencyPRsOpen()) {
      core.warning('🚧 Skipping, found dependencies PRs open');
      return;
    }

    core.info('⬆️ Detecting bump type given branch/commit');
    const bumpType = gitHelper.detectBumpType();

    core.info(`🔖 Versioning a ${bumpType}`);
    if (!(await gitHelper.version(bumpType))) {
      core.info('Skipping this release, branch behind master');
      return;
    }

    if (core.getInput('release') === 'true') {
      core.info('📝 Releasing');
      await gitHelper.release();
    }

    if (core.getInput('publish') === 'true') {
      if (core.getInput('buildStep') === 'true') {
        core.info('🛠 Extra build step');
        await exec.exec('yarn', ['build']);
      }

      core.info('📒 Setting npmrc for publish');
      await packageHelper.setupNpmRcForPublish();

      const publishDirectory = core.getInput('publishDirectory');
      core.info(`📦 Trying to publish from ${publishDirectory}`);
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
