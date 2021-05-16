import * as github from '@actions/github';
import { GitHub } from '@actions/github/lib/utils';
import MockDate from 'mockdate';

import {
  EnhancedCommit,
  createReleaseBody,
  release,
  retrieveChangesSinceLastRelease,
  hasPendingDependencyPRsOpen,
} from '../git-helper';
import * as packageHelper from '../package-helper';
import { comparison } from './__fixtures/comparison';

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
      jest.spyOn(github, 'getOctokit').mockReturnValue({
        repos: {
          createRelease: createReleaseSpy,
        },
      } as unknown as InstanceType<typeof GitHub>);
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
      jest.spyOn(github, 'getOctokit').mockReturnValue({
        repos: {
          listTags: listTagsSpy,
          listCommits: listCommitsSpy,
          compareCommits: compareCommitsSpy,
        },
      } as unknown as InstanceType<typeof GitHub>);
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
              "head": "2",
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
              "base": "v1.0.1",
              "head": "2",
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
      jest.spyOn(github, 'getOctokit').mockReturnValue({
        pulls: {
          list: listSpy,
        },
      } as unknown as InstanceType<typeof GitHub>);
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
