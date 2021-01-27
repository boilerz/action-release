import * as os from 'os';
import process from 'process';

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import * as packageHelper from './package-helper';

export interface User {
  email: string;
  name: string;
  username: string;
}

enum CommitType {
  DEPENDENCY_UPDATE = ':arrow_up:',
  FEATURE = ':sparkles:',
  BUG = ':bug:',
  MERGE = ':twisted_rightwards_arrows:',
  OTHER = ':card_file_box:',
}

export interface Commit {
  author: User;
  committer: User;
  distinct: boolean;
  id: string;
  message: string;
  timestamp: string;
  tree_id: string;
  url: string;
  type: CommitType;
}

export type BumpType = 'patch' | 'minor' | 'major';

export function getCurrentBranch(
  githubRef: string | undefined = process.env.GITHUB_REF,
): string {
  if (!githubRef) throw new Error('Failed to detect branch');

  const currentBranch = /refs\/[a-zA-Z]+\/(.*)/.exec(githubRef);
  if (!currentBranch || currentBranch?.length < 2) {
    core.error(`Malformed branch ${currentBranch}`);
    throw new Error('Cannot retrieve branch name from GITHUB_REF');
  }

  return currentBranch[1];
}

export function detectBumpType(
  commits: Commit[] = github.context.payload.commits,
): BumpType {
  if (!Array.isArray(commits) || commits.length === 0) {
    throw new Error('Failed to access commits');
  }
  const lastCommit = commits[commits.length - 1];

  let bumpType: BumpType = 'patch';
  const [lastCommitMessage] = lastCommit.message.split(os.EOL);
  if (
    lastCommitMessage.includes('minor') ||
    lastCommitMessage.includes('feat')
  ) {
    bumpType = 'minor';
  }
  return bumpType;
}

export async function version(
  bumpType: BumpType,
  githubEmail: string | undefined = process.env.GITHUB_EMAIL,
  githubUser: string | undefined = process.env.GITHUB_USER,
): Promise<void> {
  core.info('Setting git config');
  await exec.exec('git', [
    'config',
    'user.name',
    `"${githubUser || 'boilerz-bot'}"`,
  ]);
  await exec.exec('git', [
    'config',
    'user.email',
    `"${githubEmail || '77937117+boilerz-bot@users.noreply.github.com'}"`,
  ]);

  core.info('Version patch');
  await exec.exec('yarn', ['version', `--${bumpType}`]);

  core.info('Pushing release commit message and tag');
  // remote_repo="https://${GITHUB_ACTOR}:${INPUT_GITHUB_TOKEN}@github.com/${REPOSITORY}.git"
  //
  // git push "${remote_repo}" HEAD:${INPUT_BRANCH} --follow-tags $_FORCE_OPTION $_TAGS;
  const remote = `https://${githubUser || 'boilerz-bot'}:${
    process.env.GITHUB_TOKEN
  }@github.com/${github.context.repo.owner}/${github.context.repo.repo}.git`;
  core.info(`Remote ${remote}`);
  await exec.exec('git', ['push', remote, 'HEAD:master', '--force']);
  await exec.exec('git', ['push', remote, '--tags']);
}

function formatCommitLine(commit: Commit): string {
  const [message, ...details] = commit.message.split(os.EOL);
  return [
    `- ${message} ([${commit.id.substr(0, 8)}](${commit.url}))`,
    ...details.map((detail) => `  > ${detail}`),
  ].join(os.EOL);
}

function completeCommitWithType(commit: Commit): Commit {
  let type: CommitType;
  switch (true) {
    case commit.message.startsWith(CommitType.DEPENDENCY_UPDATE):
      type = CommitType.DEPENDENCY_UPDATE;
      break;
    case commit.message.startsWith(CommitType.FEATURE):
      type = CommitType.FEATURE;
      break;
    case commit.message.startsWith(CommitType.BUG):
      type = CommitType.BUG;
      break;
    case /[Mm]erge.*/.test(commit.message):
      type = CommitType.MERGE;
      break;
    default:
      type = CommitType.OTHER;
      break;
  }

  return {
    ...commit,
    type,
    message: commit.message.replace(`${type} `, ''),
  };
}

function commitsBlock(
  commits: Commit[],
  type: CommitType,
  title: string,
  isLastBlock = false,
): string {
  const blockTitle = `### ${type} ${title}`;
  const blockCommits = commits
    .filter((commit) => commit.type === type)
    .map(formatCommitLine);

  if (blockCommits.length === 0) return '';

  return (
    [blockTitle, ...blockCommits].join(os.EOL) +
    os.EOL +
    (!isLastBlock ? os.EOL : '')
  );
}

export function createReleaseBody(commits: Commit[]): string {
  const completedCommits = commits.map(completeCommitWithType);

  // 📦 Dependencies
  const dependenciesUpdateLines = commitsBlock(
    completedCommits,
    CommitType.DEPENDENCY_UPDATE,
    'Dependencies update',
  );

  // ✨ Features
  const featureLines = commitsBlock(
    completedCommits,
    CommitType.FEATURE,
    'Features',
  );

  // 🐛 Bug fixes
  const bugLines = commitsBlock(completedCommits, CommitType.BUG, 'Bug fixes');

  // 🗃 Other changes
  const otherUpdatesLines = commitsBlock(
    completedCommits,
    CommitType.OTHER,
    'Other changes',
    true,
  );

  return dependenciesUpdateLines + featureLines + bugLines + otherUpdatesLines;
}

export async function release(
  githubToken = process.env.GITHUB_TOKEN,
  commits: Commit[] = github.context.payload.commits,
): Promise<void> {
  if (!githubToken) {
    throw new Error('Cannot release without GITHUB_TOKEN');
  }

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const lastVersion = await packageHelper.getCurrentVersion();
  const {
    data: { id: releaseId },
  } = await github.getOctokit(githubToken).repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    tag_name: `v${lastVersion}`,
    name: `${lastVersion} (${today})`,
    body: createReleaseBody(commits),
    draft: false,
    prerelease: false,
  });

  core.info(`Release done: ${releaseId}`);
}
