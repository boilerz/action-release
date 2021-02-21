import process from 'process';

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import * as gitHelper from './git-helper';
import { SimpleCommit } from './git-helper';
import * as packageHelper from './package-helper';
import { Registry } from './package-helper';

interface RunOptions {
  githubRef?: string;
  githubToken?: string;
  githubEmail: string;
  githubUser: string;
}

export const defaultRunOptions: RunOptions = {
  githubRef: process.env.GITHUB_REF,
  githubToken: process.env.GITHUB_TOKEN,
  githubEmail:
    process.env.GITHUB_EMAIL || '77937117+boilerz-bot@users.noreply.github.com',
  githubUser: process.env.GITHUB_USER || 'boilerz-bot',
};

export default async function run(
  options: RunOptions = defaultRunOptions,
): Promise<void> {
  try {
    if (!options.githubToken) {
      core.setFailed(`⛔️ Missing GITHUB_TOKEN`);
      return;
    }

    const contextCommits = github.context.payload.commits as SimpleCommit[];
    const [commit] = contextCommits || [];
    const botActor = process.env.GITHUB_USER || 'boilerz-bot';
    if (
      commit &&
      contextCommits.length === 1 &&
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
    const currentBranch = gitHelper.getCurrentBranch(options.githubRef);
    if (currentBranch !== baseBranch) {
      core.warning(
        `🚫 Current branch: ${currentBranch}, releasing only from ${baseBranch}`,
      );
      return;
    }

    if (await gitHelper.hasPendingDependencyPRsOpen(options.githubToken)) {
      core.warning('🚧 Skipping, dependencies PRs found open');
      return;
    }

    core.info('✏️ Retrieving commits since last release');
    const { commits, files } = await gitHelper.retrieveChangesSinceLastRelease(
      options.githubToken,
    );

    if (commits.length === 0) {
      core.info('⏩ No commit found since last release');
      return;
    }

    core.info('✏️ Checking if changes worth a release');
    if (!(await gitHelper.areDiffWorthRelease({ commits, files }))) {
      core.info('⏩ Skipping the release');
      return;
    }

    core.info('⬆️ Detecting bump type given branch/commit');
    const bumpType = gitHelper.detectBumpType(commits);

    core.info(`🔖 Versioning a ${bumpType}`);
    if (
      !(await gitHelper.version(
        bumpType,
        options.githubEmail,
        options.githubUser,
      ))
    ) {
      core.info('⏩ Skipping this release, branch behind master');
      return;
    }

    if (core.getInput('release') === 'true') {
      core.info('📝 Releasing');
      await gitHelper.release(commits, options.githubToken);
    }

    const publishToNpm = core.getInput('publishToNpm') === 'true';
    const publishToGithub = core.getInput('publishToGithub') === 'true';
    const publish = core.getInput('publish') === 'true';

    if (!publish || (!publishToNpm && !publishToGithub)) {
      core.info('⏩ Skip publish');
      return;
    }

    if (core.getInput('buildStep') === 'true') {
      core.info('🛠 Extra build step');
      await exec.exec('yarn', ['build']);
    }

    core.info('📒 Setting npmrc for publish');
    await packageHelper.setupNpmRcForPublish();

    const publishDirectory = core.getInput('publishDirectory');
    const packagesPaths = await packageHelper.listPackagePaths(
      publishDirectory,
    );

    await Promise.all(
      packagesPaths.map(async (packagePath) => {
        core.info(`📦 Trying to publish from ${packagePath}`);

        if (publishToNpm) {
          await packageHelper.publish(Registry.NPM, packagePath);
        }

        if (publishToGithub) {
          await packageHelper.publish(Registry.GITHUB, packagePath);
        }
      }),
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}

/* istanbul ignore if */
if (!module.parent) {
  run();
}
