import childProcess from 'child_process';
import path from 'path';
import process from 'process';

import * as core from '@actions/core';
import MockDate from 'mockdate';

import run from '../index';
import wait from '../wait';

describe('gh action', () => {
  it('should throws invalid number', async () => {
    const input = parseInt('foo', 10);
    await expect(wait(input)).rejects.toThrow('milliseconds not a number');
  });

  it('should wait 500ms', async () => {
    const start = new Date();
    await wait(500);
    const end = new Date();
    const delta = Math.abs(end.getTime() - start.getTime());

    expect(delta).toBeGreaterThan(450);
  });

  it('should handle run failure', async () => {
    MockDate.set(new Date(0));
    const setFailedSpy = jest
      .spyOn(core, 'setFailed')
      .mockImplementation(() => undefined);
    jest.spyOn(core, 'getInput').mockReturnValue('');

    await run();

    expect(setFailedSpy).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": Array [
          Array [
            "milliseconds not a number",
          ],
        ],
        "results": Array [
          Object {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
  });

  it('should run successfully', async () => {
    MockDate.set(new Date(0));
    const debugSpy = jest.spyOn(core, 'debug');
    jest.spyOn(core, 'getInput').mockReturnValue('500');

    await run();

    expect(debugSpy.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          "Waiting 500 milliseconds ...",
        ],
        Array [
          "1970-01-01T00:00:00.000Z",
        ],
        Array [
          "1970-01-01T00:00:00.000Z",
        ],
      ]
    `);
  });

  it('should run dist output', async () => {
    process.env.INPUT_MILLISECONDS = '500';
    const np = process.execPath;
    const ip = path.join(__dirname, '../..', 'dist', 'index.js');
    const options: childProcess.ExecFileSyncOptions = {
      env: process.env,
    };
    expect(
      childProcess.execFileSync(np, [ip], options).toString().split('\n'),
    ).toHaveLength(5);
  });
});
