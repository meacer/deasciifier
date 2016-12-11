/// <reference path="./common.ts" />
/// <reference path="./turkish.ts" />

namespace deasciifier {

  function makeCorrectionTable() {
    let table: { [key: string]: string } = {};
    for (let key in TURKISH_CHAR_ALIST) {
      table[key] = TURKISH_CHAR_ALIST[key];
    }
    for (let key in TURKISH_ASCIIFY_TABLE) {
      table[key] = TURKISH_ASCIIFY_TABLE[key];
    }
    return table;
  }
  const CORRECTION_TABLE = makeCorrectionTable();

  export interface CorrectionCallback {
    onchange(text: string): void;
  }

  class CorrectionTextView {
    private dynamic_divs: Array<HTMLDivElement>;
    private text: string;
    constructor(
      private container: any, public correction_callback: CorrectionCallback) {
    }

    public build(text: string) {
      this.text = text;
      this.container.innerHTML = "";
      this.dynamic_divs = [];
      for (let i = 0; i < text.length; i++) {
        let ch = text.charAt(i);
        let div = document.createElement("div");
        div.className = "correction-menu-item";
        if (i == 0) {
          div.className += " correction-menu-item-first";
        } else if (i == text.length - 1) {
          div.className += " correction-menu-item-last";
        }
        let alternative = CORRECTION_TABLE[ch];
        if (alternative) {
          // Character has an alternative.
          let divs: Array<HTMLDivElement>[] = [];
          div.className += " correction-menu-item-dynamic";

          // Add the actual character.
          let item = document.createElement("div");
          item.textContent = ch;
          item.className = "correction-menu-item-main";
          div.appendChild(item);
          divs.push(item);

          // Add the alternate character.
          let child = document.createElement("div");
          child.textContent = alternative;
          child.className = "correction-menu-item-alternative";
          let self = this;
          let div_index = this.dynamic_divs.length;
          child.onclick = function () {
            self.onclick(div_index, i);
          }
          div.appendChild(child);
          divs.push(child);

          this.dynamic_divs.push(divs);
        } else {
          // No alternatives.
          div.textContent = ch;
          div.className += " correction-menu-item-static";
        }
        this.container.appendChild(div);
      }
    }

    onclick(div_index: number, char_index: number) {
      // Replace the selected alternative with the current character.
      let main_div: HTMLDivElement = this.dynamic_divs[div_index][0];
      let alternative_div: HTMLDivElement = this.dynamic_divs[div_index][1];
      let replaced = main_div.textContent;
      main_div.textContent = alternative_div.textContent;
      alternative_div.textContent = replaced;

      this.text = this.text.substring(0, char_index) + main_div.textContent +
        this.text.substring(char_index + 1);
      this.correction_callback.onchange(this.text);
    }
  }

  class CorrectionMenuView {
    private container: any;
    private textView: CorrectionTextView;

    constructor(private el: any, correction_callback: CorrectionCallback) {
      let menuContainer = document.createElement("div");
      this.textView = new CorrectionTextView(el, correction_callback);
    }

    public buildDom(text: string) {
      this.textView.build(text);
    }
  }

  export class CorrectionMenu {
    private el: any;
    private view: CorrectionMenuView;
    constructor(private correction_callback: CorrectionCallback) {
      this.el = document.createElement("div");
      this.el.className = "correction-menu";
      this.el.style.display = 'none';
      this.el.style.zIndex = 999999999;
      this.el.style.position = "absolute";
      document.body.appendChild(this.el);
      this.view = new CorrectionMenuView(this.el, correction_callback);
    }

    public static hasCorrections(text: string): boolean {
      for (let i = 0; i < text.length; i++) {
        if (CORRECTION_TABLE[text.charAt(i)]) {
          return true;
        }
      }
      return false;
    }

    createMenu(text: string) {
      this.view.buildDom(text);
    }

    public show(pos: Position, text: string) {
      this.el.innerHTML = "";
      this.el.style.top = pos.top;
      this.el.style.left = pos.left;
      this.el.style.display = 'block';
      this.createMenu(text);
    }

    public hide() {
      this.el.style.display = 'none';
      this.el.innerHTML = "";
    }
  }
}
