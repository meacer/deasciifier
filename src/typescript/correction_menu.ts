/// <reference path="./common.ts" />
/// <reference path="./turkish.ts" />
import { Position } from './common'
import { TURKISH_ASCIIFY_TABLE, TURKISH_CHAR_ALIST } from './turkish'


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
  private dynamic_divs: Array<Array<HTMLDivElement>>;
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
        let divs: Array<HTMLDivElement> = [];
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
  private textView: CorrectionTextView;

  constructor(
    container: HTMLDivElement, correction_callback: CorrectionCallback) {
    let arrow = document.createElement("div");
    arrow.className = "correction-menu-arrow";
    container.appendChild(arrow);

    let textContainer = document.createElement("div");
    textContainer.className = "correction-menu-text";
    container.appendChild(textContainer);

    this.textView =
      new CorrectionTextView(textContainer, correction_callback);
  }

  public buildDom(text: string) {
    this.textView.build(text);
  }
}

export class CorrectionMenu {
  private container: HTMLDivElement;
  private view: CorrectionMenuView;
  constructor(private correction_callback: CorrectionCallback) {
    this.container = document.createElement("div");
    this.container.className = "correction-menu";
    this.container.style.display = "none";
    this.container.style.zIndex = "99";
    this.container.style.position = "absolute";
    document.body.appendChild(this.container);
    this.view = new CorrectionMenuView(this.container, correction_callback);
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
    this.createMenu(text);
    this.container.style.top = pos.top + "px";
    this.container.style.left = pos.left + "px";
    this.container.style.display = 'block';
  }

  public hide() {
    this.container.style.display = "none";
  }
}
