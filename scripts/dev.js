import path from 'node:path';
import process from 'node:process';

// https://github.com/alexeyraspopov/picocolors#readme
import clr from 'kleur';

import { root, readJsonSync, getPackages } from './utils/utils.js';
import { Select } from './utils/select.js';
import { serve } from './utils/serve.js';

const json = readJsonSync(path.resolve(root, 'package.json'));

if (!json.workspaces) {
  console.log(
    `${clr.red('No Packages found')}\n${clr.white(
      'Consider adding a workspaces property in the package.json'
    )}\n`
  );
  process.exit(1);
}

console.log(
  [
    clr.white('Choose a Package:'),
    clr.gray('Use [up] and [down] to move the cursor'),
    clr.gray('Press [space] to toggle the selection and [Enter] to confirm'),
  ].join(`\n`)
);

const packages = getPackages(json);
const select = new Select(packages);

// INIT
select.render();

select.on('canceled', () => {
  console.log(`\nCanceled`);
  process.exit(1);
});

select.on('submit', (selectedPackageKeys) => {
  const l = selectedPackageKeys.length;
  console.log(
    [
      `\nSelected: ${l} package${l === 1 ? '' : 's'}`,
      'Starting Vite Server ...',
    ].join(`\n`)
  );

  const selected = Object.entries(packages)
    .filter(([key]) => selectedPackageKeys.includes(key))
    .map(([, value]) => value);

  serve(selected);
});
