import { Position } from './common'
import { TURKISH_ASCIIFY_TABLE, TURKISH_CHAR_ALIST } from './turkish'
import { DomElement, DomFactory } from "./view"

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

class CorrectionView {
  private text: string;
  private children: Array<DomElement>;
  constructor(
    private container: DomElement,
    public correctionCallback: CorrectionCallback,
    private domFactory: DomFactory) {
  }

  public render(text: string) {
    this.text = text;
    this.children = [];
    this.container.clear();

    let textContainer = this.domFactory.createDiv();
    textContainer.setClassName("correction-menu-text");

    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i);
      let div = this.domFactory.createDiv();
      let classNames = ["correction-menu-item"];
      if (i == 0) {
        classNames.push("correction-menu-item-first");
      } else if (i == text.length - 1) {
        classNames.push(" correction-menu-item-last");
      }

      let alternative = CORRECTION_TABLE[ch];
      if (alternative) {
        let self = this;
        classNames.push("correction-menu-item-alternative");
        div.setClickHandler(function () {
          self.onclick(i);
        })
      }
      div.setText(ch);
      div.setClassName(classNames.join(" "));
      this.children.push(div);
      textContainer.appendChild(div);
    }
    this.container.appendChild(textContainer);
  }

  onclick(index: number) {
    let div = this.children[index];
    let alternative = CORRECTION_TABLE[div.getText()];
    if (!alternative) {
      return;
    }
    div.setText(alternative);
    this.text =
      this.text.substring(0, index) + alternative
      + this.text.substring(index + 1);
    this.correctionCallback.onchange(this.text);
  }
}

export class CorrectionMenu {
  // Public for testing.
  public view: CorrectionView;
  constructor(
    private container: DomElement,
    private correctionCallback: CorrectionCallback,
    private domFactory: DomFactory) {
    this.container.setClassName("correction-menu");
    this.view =
      new CorrectionView(this.container, correctionCallback, domFactory);
  }

  public static hasCorrections(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      if (CORRECTION_TABLE[text.charAt(i)]) {
        return true;
      }
    }
    return false;
  }

  public show(pos: Position, text: string) {
    this.view.render(text);
    this.container.setPosition(pos);
    this.container.show();
  }

  public hide() {
    this.container.hide();
  }
}
