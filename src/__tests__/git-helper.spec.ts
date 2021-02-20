import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import MockDate from 'mockdate';

import {
  EnhancedCommit,
  createReleaseBody,
  detectBumpType,
  getCurrentBranch,
  release,
  version,
  areDiffWorthRelease,
  File,
  retrieveChangesSinceLastRelease,
  hasPendingDependencyPRsOpen,
} from '../git-helper';
import * as packageHelper from '../package-helper';
import { comparison, files } from './__fixtures/comparison';

function createCommit(message: string, sha?: string): EnhancedCommit {
  return {
    sha: sha || 'bac6aee2d316d65025022f9e84f12eb2ffcb34ac',
    html_url: 'http://somewhere.web',
    commit: {
      message,
    },
  } as EnhancedCommit;
}

describe('git-helper', () => {
  beforeEach(() => {
    jest.spyOn(github.context, 'repo', 'get').mockReturnValue({
      owner: 'jdoe',
      repo: 'foo',
    });
  });
  afterEach(MockDate.reset);

  describe('#getCurrentBranch', () => {
    it('should failed to detect branch without ref', () => {
      expect(
        getCurrentBranch.bind(null, null),
      ).toThrowErrorMatchingInlineSnapshot(`"Failed to detect branch"`);
    });

    it('should failed to detect branch without a well formed ref', () => {
      expect(
        getCurrentBranch.bind(null, ['']),
      ).toThrowErrorMatchingInlineSnapshot(
        `"Cannot retrieve branch name from GITHUB_REF"`,
      );
    });

    it('should detect branch successfully', () => {
      expect(getCurrentBranch('refs/heads/master')).toEqual('master');
    });
  });

  describe('#detectBumpType', () => {
    it('should failed to detect bump type with not enough commits', () => {
      expect(detectBumpType.bind(null, [])).toThrowErrorMatchingInlineSnapshot(
        `"Failed to access commits"`,
      );
    });

    it('should return a minor bump type for features and minor message commit', () => {
      expect(
        detectBumpType([createCommit(':sparkles: feat something')]),
      ).toEqual('minor');
      expect(
        detectBumpType([createCommit(':sparkles: minor something else')]),
      ).toEqual('minor');
      expect(
        detectBumpType([createCommit(':sparkles: something else')]),
      ).toEqual('minor');
    });

    it('should return a patch bump type for any other commit type', () => {
      expect(detectBumpType([createCommit(':arrow_up: bump bar@1.0')])).toEqual(
        'patch',
      );
    });
  });

  describe('#version', () => {
    let execSpy: jest.SpyInstance;
    beforeEach(() => {
      execSpy = jest.spyOn(exec, 'exec').mockResolvedValue(0); // For safety
    });

    it('should version successfully', async () => {
      expect(await version('minor', 'john@doe.co', 'jdoe')).toBe(true);
      expect(await version('minor', 'john@doe.co', 'jdoe')).toBe(true);

      expect(execSpy.mock.calls).toMatchSnapshot();
    });

    it('should skip version is branch is behind', async () => {
      execSpy.mockRestore();
      jest.spyOn(exec, 'exec').mockImplementation(
        async (command, args, options): Promise<number> => {
          if (command === 'git' && (args || []).includes('-uno')) {
            const stdout = Buffer.from(
              `Your branch is behind 'origin/master' by 6 commits, and can be fast-forwarded.`,
              'utf-8',
            );
            options?.listeners?.stdout?.(stdout);
          }
          return 0;
        },
      );

      expect(await version('minor', 'john@doe.co', 'jdoe')).toBe(false);
    });
  });

  describe('#createReleaseBody', () => {
    it('should create a release body', () => {
      expect(
        createReleaseBody([
          createCommit('Merge 42'),
          createCommit(':arrow_up: Upgrade something'),
          createCommit(':arrow_up: Upgrade something else'),
          createCommit(':sparkles: New feature'),
          createCommit(':bug: fix issue'),
          createCommit('An other commit\ndetail1\ndetail2'),
        ]),
      ).toMatchInlineSnapshot(`
        "### :arrow_up: Dependencies update
        - Upgrade something ([bac6aee2](http://somewhere.web))
        - Upgrade something else ([bac6aee2](http://somewhere.web))

        ### :sparkles: Features
        - New feature ([bac6aee2](http://somewhere.web))

        ### :bug: Bug fixes
        - fix issue ([bac6aee2](http://somewhere.web))

        ### :card_file_box: Other changes
        - An other commit ([bac6aee2](http://somewhere.web))
          > detail1
          > detail2
        "
      `);

      expect(createReleaseBody([createCommit(':arrow_up: Upgrade something')]))
        .toMatchInlineSnapshot(`
        "### :arrow_up: Dependencies update
        - Upgrade something ([bac6aee2](http://somewhere.web))

        "
      `);
    });
  });

  describe('#release', () => {
    it('should release successfully', async () => {
      MockDate.set(new Date(0));
      const createReleaseSpy = jest.fn().mockResolvedValue({
        data: { id: '42' },
      });
      jest.spyOn(github, 'getOctokit').mockReturnValue(({
        repos: {
          createRelease: createReleaseSpy,
        },
      } as unknown) as InstanceType<typeof GitHub>);
      jest.spyOn(packageHelper, 'getCurrentVersion').mockResolvedValue('1.0.0');

      await release(
        [createCommit(':arrow_up: bump something to 1.0.0')],
        'github.token',
      );

      expect(createReleaseSpy).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              Object {
                "body": "### :arrow_up: Dependencies update
        - bump something to 1.0.0 ([bac6aee2](http://somewhere.web))

        ",
                "draft": false,
                "name": "1.0.0 (January 01, 1970)",
                "owner": "jdoe",
                "prerelease": false,
                "repo": "foo",
                "tag_name": "v1.0.0",
              },
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": Promise {},
            },
          ],
        }
      `);
    });
  });

  describe('#areDiffWorthRelease', () => {
    it('should not worth a release', async () => {
      jest
        .spyOn(packageHelper, 'getDevDependencies')
        .mockResolvedValue(['eslint']);
      const versionFiles = [
        {
          filename: 'package.json',
          patch: `
          @@ -1,6 +1,6 @@
           "name": "@boilerz/super-server-auth-core",
        -  "version": "1.6.12",
        +  "version": "1.6.13",
           "repository": "git@github.com:boilerz/super-server-auth-core.git",
           `,
        },
      ] as File[];
      const unworthyReleaseFiles = [
        { filename: '.github/workflows/ci.yml' },
        { filename: '.husky/pre-commit' },
        { filename: '.eslintignore' },
        { filename: '.eslintrc' },
        { filename: '.gitignore' },
        { filename: '.yarnrc' },
        { filename: 'LICENCE' },
        { filename: 'README' },
        { filename: 'tsconfig' },
      ] as File[];

      expect(
        await areDiffWorthRelease({
          files: versionFiles,
          commits: [createCommit('non dev dep')],
        }),
      ).toBe(false);
      expect(
        await areDiffWorthRelease({
          files: unworthyReleaseFiles,
          commits: [
            createCommit('non dev dep'),
            createCommit(':arrow_up: Bump eslint from 7.18.0 to 7.19.0'),
          ],
        }),
      ).toBe(false);
    });

    it('should not worth a release when comparison detect only dev dependency update', async () => {
      const infoSpy = jest.spyOn(core, 'info');
      jest
        .spyOn(packageHelper, 'getDevDependencies')
        .mockResolvedValue(['eslint']);

      expect(
        await areDiffWorthRelease({
          files: [],
          commits: [
            createCommit('Merge commit'),
            createCommit(':arrow_up: Bump eslint from 7.18.0 to 7.19.0'),
          ],
        }),
      ).toBe(false);
      expect(infoSpy).toHaveBeenLastCalledWith(
        '👨‍💻 Commits contain only dev dependencies update',
      );
    });

    it('should worth a release', async () => {
      expect(
        await areDiffWorthRelease({
          files,
          commits: [
            createCommit(':arrow_up: Bump eslint from 7.18.0 to 7.19.0'),
            createCommit('non dev dep'),
          ],
        }),
      ).toBe(true);
    });
  });

  describe('#retrieveChangesSinceLastRelease', () => {
    let listTagsSpy: jest.SpyInstance;
    let listCommitsSpy: jest.SpyInstance;
    let compareCommitsSpy: jest.SpyInstance;

    beforeEach(() => {
      listTagsSpy = jest.fn();
      listCommitsSpy = jest.fn().mockResolvedValue({
        data: [
          createCommit('1', '1'),
          createCommit('2', '2'),
          createCommit('3', '3'),
          createCommit('4', '4'),
        ],
      });
      compareCommitsSpy = jest.fn();
      jest.spyOn(github, 'getOctokit').mockReturnValue(({
        repos: {
          listTags: listTagsSpy,
          listCommits: listCommitsSpy,
          compareCommits: compareCommitsSpy,
        },
      } as unknown) as InstanceType<typeof GitHub>);
    });

    it('should retrieve changes since last release using oldest commit', async () => {
      listTagsSpy.mockResolvedValue({ data: [] });
      compareCommitsSpy.mockResolvedValue({ data: comparison });

      await retrieveChangesSinceLastRelease('github.token');

      expect(compareCommitsSpy.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "base": "4",
              "head": "1",
              "owner": "jdoe",
              "repo": "foo",
            },
          ],
        ]
      `);
    });

    it('should retrieve changes since last release using latest tag', async () => {
      listTagsSpy.mockResolvedValue({
        data: [{ name: 'v1.0.2' }, { name: 'v1.0.1' }],
      });
      compareCommitsSpy.mockResolvedValue({ data: comparison });

      await retrieveChangesSinceLastRelease('github.token');

      expect(compareCommitsSpy.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "base": "v1.0.2",
              "head": "1",
              "owner": "jdoe",
              "repo": "foo",
            },
          ],
        ]
      `);
    });
  });

  describe('#hasPendingDependencyPRsOpen', () => {
    let listSpy: jest.SpyInstance;

    beforeEach(() => {
      listSpy = jest.fn();
      jest.spyOn(github, 'getOctokit').mockReturnValue(({
        pulls: {
          list: listSpy,
        },
      } as unknown) as InstanceType<typeof GitHub>);
    });

    it('should return true if dependencies PR are open', async () => {
      listSpy.mockResolvedValue({
        data: [
          { labels: [{ name: 'dependencies' }] },
          { labels: [{ name: 'automerge' }] },
        ],
      });

      expect(await hasPendingDependencyPRsOpen('github.token')).toBe(true);
    });

    it('should return false if no dependencies PR are open', async () => {
      listSpy.mockResolvedValue({
        data: [{ labels: [{ name: 'automerge' }] }],
      });

      expect(await hasPendingDependencyPRsOpen('github.token')).toBe(false);
    });
  });
});
