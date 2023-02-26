import { readdirSync, readFileSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

export const root = process.cwd();

export const readJsonSync = (path) => JSON.parse(readFileSync(path));

const isGlobPattern = (value) => /\**/.test(value);

const findPackageJson = (path, result = [], depth = 0) => {
  if (depth > 4) return result;

  const directory = readdirSync(path).filter((dir) => dir !== 'node_modules');

  for (const item of directory) {
    const currentPath = resolve(path, item);
    const currentStat = lstatSync(currentPath);

    if (item === 'package.json') {
      const json = readJsonSync(currentPath);
      result.push([json.name, path]);
      break;
    }

    if (currentStat.isDirectory()) {
      depth += 1;
      findPackageJson(currentPath, result, depth);
    }
  }
  return result;
};

export const getPackages = ({ workspaces }) =>
  Object.fromEntries(
    workspaces.reduce((all, entry) => {
      if (isGlobPattern(entry)) {
        entry = entry.replaceAll(/(\/\*\*|\/\*)/g, '');
      }

      const path = resolve(root, entry);

      return [...findPackageJson(path, all)];
    }, [])
  );
