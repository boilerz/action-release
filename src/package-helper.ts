import fs from 'fs';
import os from 'os';
import path from 'path';
import process from 'process';
import util from 'util';

import * as core from '@actions/core';
import * as exec from '@actions/exec';

const readdirAsync = fs.promises.readdir;
const readFileAsync = fs.promises.readFile;
const writeFileAsync = fs.promises.writeFile;
const existsAsync = util.promisify(fs.exists);

export enum Registry {
  NPM = 'https://registry.npmjs.org',
  GITHUB = 'https://npm.pkg.github.com',
}

interface PackageJson {
  version: string;
  devDependencies: Record<string, string>;
}

async function getPackageJson(): Promise<PackageJson> {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  core.debug(`📦 package.json path: ${packageJsonPath}`);

  const packageData: string = await readFileAsync(packageJsonPath, 'utf8');
  return JSON.parse(packageData);
}

export async function getCurrentVersion(): Promise<string> {
  const { version } = await getPackageJson();
  return version;
}

export async function getDevDependencies(): Promise<string[]> {
  const { devDependencies } = await getPackageJson();

  return Object.keys(devDependencies || {});
}

export async function readNpmRc(
  filePath: string,
): Promise<Record<string, string> | null> {
  if (!(await existsAsync(filePath))) return null;

  const fileRecord: Record<string, string> = {};
  const fileContent: string = await readFileAsync(filePath, 'utf8');
  const lines = fileContent.split(os.EOL).filter((line) => line !== '');
  lines.forEach((line) => {
    const [key, value] = line.split('=');
    fileRecord[key] = value;
  });

  return fileRecord;
}

export async function writeNpmRc(
  filePath: string,
  fileRecord: Record<string, string>,
): Promise<void> {
  const fileContent: string = Object.keys(fileRecord)
    .map((key) => `${key}=${fileRecord[key]}`)
    .join(os.EOL);
  await writeFileAsync(filePath, fileContent + os.EOL, { encoding: 'utf8' });
}

export function updateNpmRcForPublish(
  fileRecord: Record<string, string>,
): Record<string, string> {
  const updatedFileRecord = { ...fileRecord };
  Object.keys(fileRecord).forEach((key) => {
    if (/.*:?registry$/.test(key)) {
      delete updatedFileRecord[key];
    }
  });

  updatedFileRecord['always-auth'] = 'true';
  updatedFileRecord['//registry.npmjs.org/:_authToken'] = '${NPM_TOKEN}';
  updatedFileRecord['//npm.pkg.github.com/:_authToken'] = '${GITHUB_TOKEN}';

  return updatedFileRecord;
}

export async function setupNpmRcForPublish(): Promise<void> {
  const npmRcFilePath: string = path.resolve(process.cwd(), '.npmrc');
  const npmRcFileRecord: Record<string, string> =
    (await readNpmRc(npmRcFilePath)) || {};
  const updatedNpmRcFileRecord = await updateNpmRcForPublish(npmRcFileRecord);
  await writeNpmRc(npmRcFilePath, updatedNpmRcFileRecord);
}

export async function publish(
  registry: Registry,
  directory = '.',
): Promise<void> {
  core.debug(`📒 Setting config registry at ${registry}`);
  await exec.exec('npm', ['config', 'set', 'registry', registry]);

  core.info(`📦 Publishing to ${registry}`);
  await exec.exec('npm', ['publish', directory, '--access', 'public']);
}

export async function listPackagePaths(folderPath: string): Promise<string[]> {
  const dirents = await readdirAsync(folderPath, { withFileTypes: true });
  if (dirents.some(({ name }) => name === 'package.json')) {
    return [folderPath];
  }
  const packagesPaths = await Promise.all(
    dirents
      .filter((dirent) => dirent.isDirectory())
      .map(({ name }) => listPackagePaths(path.resolve(folderPath, name))),
  );
  return Array.prototype.concat(...packagesPaths);
}
