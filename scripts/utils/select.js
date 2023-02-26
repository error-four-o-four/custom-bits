import process from 'node:process';
import readline from 'node:readline';
import EventEmitter from 'node:events';

import clr from 'kleur';

// https://github.com/terkelg/sisteransi/blob/master/src/index.js
const ESC = '\x1B';
const CSI = `${ESC}[`;

const up = (count = 1) => `${CSI}${count}A`;
const hide = () => `${CSI}?25l`;
const show = () => `${CSI}?25h`;

const ALL = 'toggle all';

// https://github.com/terkelg/prompts/blob/master/lib/elements/prompt.js
export class Select extends EventEmitter {
  constructor(choices) {
    super();

    this.in = process.stdin;
    this.in.setEncoding('utf8');
    this.in.on('keypress', this.keypress.bind(this));

    if (this.in.isTTY) this.in.setRawMode(true);

    this.out = process.stdout;

    this.rl = readline.createInterface({
      input: this.in,
      output: this.out,
    });
    this.rl.on('line', this.submit.bind(this));
    readline.emitKeypressEvents(this.in, this.rl);

    this.index = 0;
    this.keys = [ALL, ...Object.keys(choices)];
    // this.values = [ALL, ...Object.values(choices)];
    this.selected = [];

    this.firstRender = true;
  }

  get key() {
    return this.keys[this.index];
  }

  // get value() {
  //   return this.values[this.index];
  // }

  get selectedAll() {
    return this.selected.length === this.keys.length - 1;
  }

  keypress(str, key) {
    const { ctrl, name } = key;

    if (str !== undefined && str !== ' ') return;

    if (name === undefined) return;

    if ((name && name === 'escape') || (ctrl && name === 'c')) {
      this.cancel();
    }

    if (str === ' ') {
      this.toggle();
    }

    if (
      typeof this[name] === 'function' &&
      (name === 'up' || name === 'down')
    ) {
      this[name]();
    }
  }

  up() {
    this.index = Math.max(0, this.index - 1);
    this.render();
  }

  down() {
    this.index = Math.min(this.keys.length - 1, this.index + 1);
    this.render();
  }

  toggle() {
    if (this.key === ALL && this.selectedAll) {
      this.selected = [];
      this.render();
      return;
    }

    if (this.key === ALL && !this.selectedAll) {
      this.selected = [...this.keys.filter((key) => key !== ALL)];
      this.render();
      return;
    }

    if (this.selected.includes(this.key)) {
      this.selected = this.selected.filter((key) => key !== this.key);
      this.render();
      return;
    }

    this.selected.push(this.key);
    this.render();
  }

  cancel() {
    this.out.write(show());
    this.in.removeListener('keypress', this.keypress);
    this.rl.close();

    this.emit('canceled');
  }

  submit() {
    this.out.write(show());
    this.in.removeListener('keypress', this.keypress);
    this.rl.close();

    this.emit('submit', this.selected);
  }

  clear() {
    this.out.write(`${CSI}G`);
    this.out.write(up(this.keys.length - 1));
    // readline.moveCursor(this.out, 0, -1 * (2 + this.keys.length));
    readline.clearScreenDown(this.out);
  }

  render() {
    const getPrefix = (bool) => (bool ? `[x]` : `[ ]`);

    const mapChoices = (choice, i) => {
      const line = `${
        i === 0
          ? getPrefix(this.selectedAll)
          : getPrefix(this.selected.includes(choice))
      } ${choice}`;
      return this.index === i ? clr.white(line) : clr.grey(line);
    };

    if (this.firstRender) {
      this.out.write(hide());
      this.firstRender = false;
    } else {
      this.clear();
    }

    this.out.write(this.keys.map(mapChoices).join(`\n`));
  }
}
