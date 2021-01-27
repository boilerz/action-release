import * as exec from '@actions/exec';
import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';

import {
  Commit,
  createReleaseBody,
  detectBumpType,
  getCurrentBranch,
  release,
  version,
} from '../git-helper';
import * as packageHelper from '../package-helper';

function createCommit(message: string): Commit {
  return {
    id: 'bac6aee2d316d65025022f9e84f12eb2ffcb34ac',
    url: 'http://somewhere.web',
    message,
  } as Commit;
}

describe('git-helper', () => {
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
      expect(
        detectBumpType.bind(null, null),
      ).toThrowErrorMatchingInlineSnapshot(`"Failed to access commits"`);
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
      await version('minor');
      await version('minor', 'john@doe.co', 'jdoe');

      expect(execSpy.mock.calls).toMatchSnapshot();
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
    it('should fail to release without github token', async () => {
      await expect(
        release.bind(null, undefined),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Cannot release without GITHUB_TOKEN"`,
      );
    });

    it('should release successfully', async () => {
      const createReleaseSpy = jest.fn().mockResolvedValue({
        data: { id: '42' },
      });
      jest.spyOn(github, 'getOctokit').mockReturnValue(({
        repos: {
          createRelease: createReleaseSpy,
        },
      } as unknown) as InstanceType<typeof GitHub>);
      jest.spyOn(packageHelper, 'getCurrentVersion').mockResolvedValue('1.0.0');
      jest.spyOn(github.context, 'repo', 'get').mockReturnValue({
        owner: 'jdoe',
        repo: 'foo',
      });

      await release('github.token', [
        createCommit(':arrow_up: bump something to 1.0.0'),
      ]);

      expect(createReleaseSpy).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              Object {
                "body": "### :arrow_up: Dependencies update
        - bump something to 1.0.0 ([bac6aee2](http://somewhere.web))

        ",
                "draft": false,
                "name": "1.0.0 (January 27, 2021)",
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
});
