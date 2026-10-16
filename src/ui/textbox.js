const BOX = { x: 16, y: 164, width: 288, height: 64 };
const PADDING = 10;
const LINE_HEIGHT = 14;
const CHARACTERS_PER_SECOND = 45;
// TODO: replace with a bitmap pixel font from assets/fonts/; canvas text blurs when scaled.
const FONT = '10px monospace';

// Deltarune-style dialogue box. Text types out a character at a time;
// cancel skips to the end of the page and confirm advances to the next page.
export class TextBox {
  constructor() {
    this.pages = null;
    this.pageIndex = 0;
    this.visibleCharacters = 0;
  }

  get isOpen() {
    return this.pages !== null;
  }

  open(pages) {
    this.pages = pages;
    this.pageIndex = 0;
    this.visibleCharacters = 0;
  }

  update(dt, input) {
    const page = this.pages[this.pageIndex];

    if (this.visibleCharacters < page.length) {
      this.visibleCharacters = Math.min(page.length, this.visibleCharacters + CHARACTERS_PER_SECOND * dt);
      if (input.wasPressed('cancel')) this.visibleCharacters = page.length;
      return;
    }

    if (input.wasPressed('confirm')) {
      this.pageIndex++;
      this.visibleCharacters = 0;
      if (this.pageIndex >= this.pages.length) this.pages = null;
    }
  }

  draw(ctx) {
    if (!this.isOpen) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(BOX.x, BOX.y, BOX.width, BOX.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(BOX.x + 2, BOX.y + 2, BOX.width - 4, BOX.height - 4);

    const text = this.pages[this.pageIndex].slice(0, Math.floor(this.visibleCharacters));
    ctx.fillStyle = '#fff';
    ctx.font = FONT;
    ctx.textBaseline = 'top';
    ctx.fillText('*', BOX.x + PADDING, BOX.y + PADDING);
    text.split('\n').forEach((line, i) => {
      ctx.fillText(line, BOX.x + PADDING + 12, BOX.y + PADDING + i * LINE_HEIGHT);
    });
  }
}
