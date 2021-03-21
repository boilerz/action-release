import * as core from '@actions/core';
import * as exec from '@actions/exec';

import * as gitHelper from '../git-helper';
import { Comparison } from '../git-helper';
import run, { defaultRunOptions } from '../main';
import * as packageHelper from '../package-helper';
import { comparison } from './__fixtures/comparison';

function mockInputs(inputs: Record<string, string>): jest.SpyInstance {
  return jest.spyOn(core, 'getInput').mockImplementation((name) => {
    return inputs[name] || '';
  });
}

function mockReturnedValueOf(value: {
  hasPendingDependencyPRsOpen?: boolean;
  retrieveChangesSinceLastRelease?: Comparison;
  listPackagePaths?: string[];
}) {
  if (value.listPackagePaths) {
    jest
      .spyOn(packageHelper, 'listPackagePaths')
      .mockResolvedValue(value.listPackagePaths);
  }
  if (value.retrieveChangesSinceLastRelease) {
    jest
      .spyOn(gitHelper, 'retrieveChangesSinceLastRelease')
      .mockResolvedValue(value.retrieveChangesSinceLastRelease);
  }
  if (typeof value.hasPendingDependencyPRsOpen === 'boolean') {
    jest
      .spyOn(gitHelper, 'hasPendingDependencyPRsOpen')
      .mockResolvedValue(value.hasPendingDependencyPRsOpen);
  }
}

describe('gh action', () => {
  const runOptions = { ...defaultRunOptions, githubToken: 'github.token' };

  let execSpy: jest.SpyInstance;
  let releaseSpy: jest.SpyInstance;
  let publishSpy: jest.SpyInstance;

  beforeEach(() => {
    execSpy = jest.spyOn(exec, 'exec').mockResolvedValue(0); // For safety
    releaseSpy = jest.spyOn(gitHelper, 'release').mockResolvedValue();
    publishSpy = jest.spyOn(packageHelper, 'publish').mockResolvedValue();
  });

  it('should fail without GITHUB_TOKEN', async () => {
    const setFailedSpy = jest.spyOn(core, 'setFailed');

    await run();

    expect(setFailedSpy).toHaveBeenCalledWith(`⛔️ Missing GITHUB_TOKEN`);
  });

  it('should set status to failed when an error occur', async () => {
    jest
      .spyOn(gitHelper, 'retrieveChangesSinceLastRelease')
      .mockRejectedValue(new Error('Unknown'));

    const setFailedSpy = jest.spyOn(core, 'setFailed');

    await run(runOptions);

    expect(setFailedSpy).toHaveBeenCalledWith('Unknown');
  });

  it('should skip to publish to npm or github', async () => {
    jest.spyOn(packageHelper, 'setupNpmRcForPublish').mockResolvedValue();
    mockReturnedValueOf({
      hasPendingDependencyPRsOpen: false,
      retrieveChangesSinceLastRelease: comparison,
      listPackagePaths: ['dist'],
    });

    mockInputs({
      baseBranch: 'master',
      publish: 'true',
      publishToNpm: 'false',
      publishToGithub: 'true',
    });
    await run(runOptions);

    expect(publishSpy).toHaveBeenNthCalledWith(
      1,
      'https://npm.pkg.github.com',
      'dist',
    );

    publishSpy.mockReset();
    mockInputs({
      baseBranch: 'master',
      publish: 'true',
      publishToNpm: 'true',
      publishToGithub: 'false',
    });
    await run(runOptions);

    expect(publishSpy).toHaveBeenNthCalledWith(
      1,
      'https://registry.npmjs.org',
      'dist',
    );
  });

  it('should version successfully', async () => {
    mockInputs({ baseBranch: 'master' });
    mockReturnedValueOf({
      hasPendingDependencyPRsOpen: false,
      retrieveChangesSinceLastRelease: comparison,
    });

    await run(runOptions);

    expect(releaseSpy).not.toHaveBeenCalled();
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it('should version and release successfully', async () => {
    mockInputs({ release: 'true', baseBranch: 'master' });
    mockReturnedValueOf({
      hasPendingDependencyPRsOpen: false,
      retrieveChangesSinceLastRelease: comparison,
    });
    await run(runOptions);

    expect(releaseSpy).toHaveBeenCalled();
    expect(publishSpy).not.toHaveBeenCalled();
  });

  it('should version, release and publish successfully', async () => {
    mockInputs({
      release: 'true',
      publish: 'true',
      publishToGithub: 'true',
      publishToNpm: 'true',
      baseBranch: 'master',
    });
    mockReturnedValueOf({
      hasPendingDependencyPRsOpen: false,
      retrieveChangesSinceLastRelease: comparison,
      listPackagePaths: ['dist'],
    });

    const setupNpmRcForPublishSpy = jest
      .spyOn(packageHelper, 'setupNpmRcForPublish')
      .mockResolvedValue();

    await run(runOptions);

    expect(releaseSpy).toHaveBeenCalled();
    expect(setupNpmRcForPublishSpy).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });

  it('should version, release, build and publish successfully', async () => {
    mockInputs({
      release: 'true',
      publish: 'true',
      publishToGithub: 'true',
      publishToNpm: 'true',
      buildStep: 'true',
      baseBranch: 'main',
    });
    mockReturnedValueOf({
      hasPendingDependencyPRsOpen: false,
      retrieveChangesSinceLastRelease: comparison,
      listPackagePaths: ['dist'],
    });
    const setupNpmRcForPublishSpy = jest
      .spyOn(packageHelper, 'setupNpmRcForPublish')
      .mockResolvedValue();

    await run(runOptions);

    expect(releaseSpy).toHaveBeenCalled();
    expect(execSpy).toHaveBeenCalledWith('yarn', ['build']);
    expect(setupNpmRcForPublishSpy).toHaveBeenCalled();
    expect(publishSpy).toHaveBeenCalled();
  });
});
