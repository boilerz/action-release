import * as fs from 'fs';
import path from 'path';

import * as exec from '@actions/exec';

import {
  publish,
  readNpmRc,
  Registry,
  // setupNpmRcForPublish,
  updateNpmRcForPublish,
  writeNpmRc,
} from '../package-helper';
import * as packageHelper from '../package-helper';

describe('package-helper', () => {
  const npmRcSampleFileRecord: Record<string, string> = {
    registry: 'something',
    '@scope:registry': 'something',
    'metrics-registry': 'something',
    'always-auth': 'true',
    // eslint-disable-next-line no-template-curly-in-string
    '//registry.npmjs.org/:_authToken': '${NPM_TOKEN}',
  };

  describe('#readNpmRc', () => {
    it('should return null if file does not exists', async () => {
      await expect(
        readNpmRc(path.resolve(__dirname, '__fixtures/unknown')),
      ).resolves.toBeNull();
    });

    it('should read npmrc file record', async () => {
      await expect(readNpmRc(path.resolve(__dirname, '__fixtures/npmrc')))
        .resolves.toMatchInlineSnapshot(`
              Object {
                "//registry.npmjs.org/:_authToken": "\${NPM_TOKEN}",
                "always-auth": "true",
                "metrics-registry": "https://registry.npmjs.org/",
                "registry": "https://registry.npmjs.org/",
              }
            `);
    });
  });

  describe('#writeNpmRc', () => {
    it('should write npm rc file', async () => {
      const npmRcOutput = path.resolve(__dirname, '__fixtures/output');
      await writeNpmRc(npmRcOutput, npmRcSampleFileRecord);

      expect(fs.readFileSync(npmRcOutput, 'utf8')).toMatchInlineSnapshot(`
        "registry=something
        @scope:registry=something
        metrics-registry=something
        always-auth=true
        //registry.npmjs.org/:_authToken=\${NPM_TOKEN}
        "
      `);
      fs.unlinkSync(npmRcOutput);
    });
  });

  describe('#updateNpmRcForPublish', () => {
    it('should successfully update npm file record', () => {
      expect(updateNpmRcForPublish(npmRcSampleFileRecord))
        .toMatchInlineSnapshot(`
        Object {
          "//npm.pkg.github.com/:_authToken": "\${GITHUB_TOKEN}",
          "//registry.npmjs.org/:_authToken": "\${NPM_TOKEN}",
          "always-auth": "true",
        }
      `);
    });
  });

  describe('#setupNpmRcForPublish', () => {
    it('should setup npmrc file for publish', async () => {
      const npmrcCopy = path.resolve(__dirname, '__fixtures/npmrc-copy');
      await fs.copyFileSync(
        path.resolve(__dirname, '__fixtures/npmrc'),
        npmrcCopy,
      );
      jest.spyOn(path, 'resolve').mockReturnValueOnce(npmrcCopy);
      await packageHelper.setupNpmRcForPublish();

      expect(fs.readFileSync(npmrcCopy, 'utf8')).toMatchInlineSnapshot(`
        "//registry.npmjs.org/:_authToken=\${NPM_TOKEN}
        always-auth=true
        //npm.pkg.github.com/:_authToken=\${GITHUB_TOKEN}
        "
      `);

      fs.unlinkSync(npmrcCopy);
    });
  });

  describe('#publish', () => {
    it('should publish package', async () => {
      const execSpy = jest.spyOn(exec, 'exec').mockResolvedValue(0);

      await publish(Registry.NPM);
      await publish(Registry.GITHUB, 'dist');

      expect(execSpy.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "npm",
            Array [
              "config",
              "set",
              "registry",
              "https://registry.npmjs.org",
            ],
          ],
          Array [
            "npm",
            Array [
              "publish",
              ".",
              "--access",
              "public",
            ],
          ],
          Array [
            "npm",
            Array [
              "config",
              "set",
              "registry",
              "https://npm.pkg.github.com",
            ],
          ],
          Array [
            "npm",
            Array [
              "publish",
              "dist",
              "--access",
              "public",
            ],
          ],
        ]
      `);
    });
  });
});
