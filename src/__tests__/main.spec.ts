import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import * as gitHelper from '../git-helper';
import run from '../main';
import * as packageHelper from '../package-helper';

function mockInputs(inputs: Record<string, string>): jest.SpyInstance {
  return jest.spyOn(core, 'getInput').mockImplementation((name) => {
    return inputs[name] || '';
  });
}

describe('gh action', () => {
  let execSpy: jest.SpyInstance;
  let versionSpy: jest.SpyInstance;
  let releaseSpy: jest.SpyInstance;
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    execSpy = jest.spyOn(exec, 'exec').mockResolvedValue(0); // For safety
    versionSpy = jest.spyOn(gitHelper, 'version').mockResolvedValue();
    releaseSpy = jest.spyOn(gitHelper, 'release').mockResolvedValue();
    publishSpy = jest.spyOn(packageHelper, 'publish').mockResolvedValue();
  });

  it('should set status to failed when an error occur', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(() => {
      throw new Error('Unknown');
    });

    const setFailedSpy = jest.spyOn(core, 'setFailed');

    await run();

    expect(setFailedSpy).toHaveBeenCalledWith('Unknown');
  });

  it('should skip when version flag is set to false', async () => {
    mockInputs({ version: 'false' });
    const warningSpy = jest.spyOn(core, 'warning');
    await run();

    expect(warningSpy).toHaveBeenCalledWith(
      'Skipping version (flag false), release and publish',
    );
  });

  it('should skip if the current branch is not the base branch', async () => {
    mockInputs({ version: 'true', baseBranch: 'master' });
    jest.spyOn(gitHelper, 'getCurrentBranch').mockReturnValue('foo');
    const warningSpy = jest.spyOn(core, 'warning');

    await run();

    expect(warningSpy).toHaveBeenCalledWith(
      'Current branch: foo, releasing only from master',
    );
  });

  it('should skip if the only one commit is a version commit pushed by the bot', async () => {
    const originalCommits = github.context.payload.commits;
    const originalActor = github.context.actor;
    const infoSpy = jest.spyOn(core, 'info');
    github.context.actor = process.env.GITHUB_USER || 'boilerz-bot';
    github.context.payload.commits = [
      {
        message: ':bookmark: v0.0.1',
      },
    ];

    await run();

    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Skipping, version commit pushed by .*/),
    );
    github.context.payload.commits = originalCommits;
    github.context.actor = originalActor;
  });

  it('should version successfully', async () => {
    mockInputs({ version: 'true', baseBranch: 'master' });
    jest.spyOn(gitHelper, 'getCurrentBranch').mockReturnValue('master');
    jest.spyOn(gitHelper, 'detectBumpType').mockReturnValue('patch');

    await run();

    expect(versionSpy).toHaveBeenCalledWith('patch');
    expect(releaseSpy).not.toHaveBeenCalled();
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it('should version and release successfully', async () => {
    mockInputs({ version: 'true', release: 'true', baseBranch: 'master' });
    jest.spyOn(gitHelper, 'getCurrentBranch').mockReturnValue('master');
    jest.spyOn(gitHelper, 'detectBumpType').mockReturnValue('patch');

    await run();

    expect(versionSpy).toHaveBeenCalledWith('patch');
    expect(releaseSpy).toHaveBeenCalled();
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it('should version, release and publish successfully', async () => {
    mockInputs({
      version: 'true',
      release: 'true',
      publish: 'true',
      baseBranch: 'master',
    });
    jest.spyOn(gitHelper, 'getCurrentBranch').mockReturnValue('master');
    jest.spyOn(gitHelper, 'detectBumpType').mockReturnValue('patch');
    const setupNpmRcForPublishSpy = jest
      .spyOn(packageHelper, 'setupNpmRcForPublish')
      .mockResolvedValue();

    await run();

    expect(versionSpy).toHaveBeenCalledWith('patch');
    expect(releaseSpy).toHaveBeenCalled();
    expect(setupNpmRcForPublishSpy).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });

  it('should version, release, build and publish successfully', async () => {
    mockInputs({
      version: 'true',
      release: 'true',
      publish: 'true',
      buildStep: 'true',
      baseBranch: 'main',
    });
    jest.spyOn(gitHelper, 'getCurrentBranch').mockReturnValue('main');
    jest.spyOn(gitHelper, 'detectBumpType').mockReturnValue('minor');
    const setupNpmRcForPublishSpy = jest
      .spyOn(packageHelper, 'setupNpmRcForPublish')
      .mockResolvedValue();

    await run();

    expect(versionSpy).toHaveBeenCalledWith('minor');
    expect(releaseSpy).toHaveBeenCalled();
    expect(execSpy).toHaveBeenCalledWith('yarn', ['build']);
    expect(setupNpmRcForPublishSpy).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });
});
