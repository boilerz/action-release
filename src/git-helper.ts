import * as os from 'os';

import * as core from '@actions/core';
import * as github from '@actions/github';
import type { components } from '@octokit/openapi-types';

import * as packageHelper from './package-helper';

export type Commit = components['schemas']['commit'];

export type File = components['schemas']['diff-entry'];

export type BumpType = 'patch' | 'minor' | 'major';

export type Comparison = Pick<
  components['schemas']['commit-comparison'],
  'commits' | 'files'
>;

enum CommitType {
  DEPENDENCY_UPDATE = ':arrow_up:',
  FEATURE = ':sparkles:',
  BUG = ':bug:',
  MERGE = ':twisted_rightwards_arrows:',
  OTHER = ':card_file_box:',
}

enum PullRequestLabel {
  DEPENDENCIES = 'dependencies',
}

export interface EnhancedCommit extends Commit {
  type: CommitType;
}

const MERGE_MESSAGE_REGEX = /.*[Mm]erge.*/;

function completeCommitWithType(commit: Commit): EnhancedCommit {
  let type: CommitType;
  switch (true) {
    case commit.commit.message.startsWith(CommitType.DEPENDENCY_UPDATE):
      type = CommitType.DEPENDENCY_UPDATE;
      break;
    case commit.commit.message.startsWith(CommitType.FEATURE):
      type = CommitType.FEATURE;
      break;
    case commit.commit.message.startsWith(CommitType.BUG):
      type = CommitType.BUG;
      break;
    case MERGE_MESSAGE_REGEX.test(commit.commit.message):
      type = CommitType.MERGE;
      break;
    default:
      type = CommitType.OTHER;
      break;
  }

  return {
    ...commit,
    commit: {
      ...commit.commit,
      message: commit.commit.message.replace(`${type} `, ''),
    },
    type,
  };
}

export async function retrieveChangesSinceLastRelease(
  githubToken: string,
): Promise<Comparison> {
  const { repo, owner } = github.context.repo;
  const octokit = github.getOctokit(githubToken);
  const { data: tags } = await octokit.rest.repos.listTags({
    repo,
    owner,
    per_page: 2,
  });

  const { data: lastCommits } = await octokit.rest.repos.listCommits({
    repo,
    owner,
  });

  const [, { sha: head }] = lastCommits;
  let { sha: base } = lastCommits[lastCommits.length - 1]; // good enough approximation
  core.info(`🏷 Tags found ${tags?.map((t) => t.name).join(',')}`);
  if (tags?.length > 1) [, { name: base }] = tags;

  core.info(`🏷 Retrieving commits since ${base}`);
  const {
    data: { commits, diff_url, files },
  } = await octokit.rest.repos.compareCommits({ owner, repo, base, head });
  core.info(`🔗 Diff url : ${diff_url}`);
  return { commits, files };
}

export async function hasPendingDependencyPRsOpen(
  githubToken: string,
): Promise<boolean> {
  const { repo, owner } = github.context.repo;
  const { data: openPRs } = await github
    .getOctokit(githubToken)
    .rest.pulls.list({ repo, owner, state: 'open' });

  return openPRs.some((pr) =>
    pr.labels.some((label) => label.name === PullRequestLabel.DEPENDENCIES),
  );
}

function formatCommitLine(commit: EnhancedCommit): string {
  const [message, ...details] = commit.commit.message.split(os.EOL);
  return [
    `- ${message} ([${commit.sha.substr(0, 8)}](${commit.html_url}))`,
    ...details.map((detail) => `  > ${detail}`),
  ].join(os.EOL);
}

function commitsBlock(
  commits: EnhancedCommit[],
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
  commits: Commit[],
  githubToken: string,
): Promise<void> {
  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
  const lastVersion = await packageHelper.getCurrentVersion();
  const {
    data: { id: releaseId },
  } = await github.getOctokit(githubToken).rest.repos.createRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag_name: `v${lastVersion}`,
    name: `${lastVersion} (${today})`,
    body: createReleaseBody(commits),
    draft: false,
    prerelease: false,
  });

  core.info(`📝 Release done: ${releaseId}`);
}
