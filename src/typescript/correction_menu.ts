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

class CorrectionTextView {
  private dynamic_divs: Array<Array<DomElement>>;
  private text: string;
  constructor(
    private container: DomElement,
    public correctionCallback: CorrectionCallback,
    private domFactory: DomFactory) {
  }

  public build(text: string) {
    this.text = text;
    this.container.clear();
    this.dynamic_divs = [];

    for (let i = 0; i < text.length; i++) {
      let ch = text.charAt(i);
      let div = this.domFactory.createDiv();
      let classNames = ["correction-menu-item"];
      div.setClassName("correction-menu-item");
      if (i == 0) {
        classNames.push("correction-menu-item-first");
      } else if (i == text.length - 1) {
        classNames.push(" correction-menu-item-last");
      }

      let alternative = CORRECTION_TABLE[ch];
      if (alternative) {
        // Character has an alternative.
        let divs: Array<DomElement> = [];
        classNames.push("correction-menu-item-dynamic");

        // Add the actual character.
        let item = this.domFactory.createDiv();
        item.setText(ch);
        item.setClassName("correction-menu-item-main");
        div.appendChild(item);
        divs.push(item);

        // Add the alternate character.
        let child = this.domFactory.createDiv();
        child.setText(alternative);
        child.setClassName("correction-menu-item-alternative");
        let self = this;
        let div_index = this.dynamic_divs.length;
        child.setClickHandler(function () {
          self.onclick(div_index, i);
        });
        div.appendChild(child);
        divs.push(child);

        this.dynamic_divs.push(divs);
      } else {
        // No alternatives.
        div.setText(ch);
        classNames.push("correction-menu-item-static");
      }

      div.setClassName(classNames.join(" "));
      this.container.appendChild(div);
    }
  }

  onclick(div_index: number, char_index: number) {
    // Replace the selected alternative with the current character.
    let main_div: DomElement = this.dynamic_divs[div_index][0];
    let alternative_div: DomElement = this.dynamic_divs[div_index][1];
    let replaced = main_div.getText();
    main_div.setText(alternative_div.getText());
    alternative_div.setText(replaced);

    this.text = this.text.substring(0, char_index) + main_div.getText() +
      this.text.substring(char_index + 1);
    this.correctionCallback.onchange(this.text);
  }
}

class CorrectionMenuView {
  private textView: CorrectionTextView;

  constructor(
    container: DomElement,
    correctionCallback: CorrectionCallback,
    domFactory: DomFactory) {
    let arrow = domFactory.createDiv();
    arrow.setClassName("correction-menu-arrow");
    container.appendChild(arrow);

    let textContainer = domFactory.createDiv();
    textContainer.setClassName("correction-menu-text");
    container.appendChild(textContainer);

    this.textView =
      new CorrectionTextView(textContainer, correctionCallback, domFactory);
  }

  public buildDom(text: string) {
    this.textView.build(text);
  }
}

export class CorrectionMenu {
  private container: DomElement;
  private view: CorrectionMenuView;
  constructor(
    private parent: DomElement,
    private correctionCallback: CorrectionCallback,
    private domFactory: DomFactory) {
    this.container = domFactory.createDiv();
    this.container.setClassName("correction-menu");
    parent.appendChild(this.container);
    this.view =
      new CorrectionMenuView(this.container, correctionCallback, domFactory);
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
    this.view.buildDom(text);
    this.container.setPosition(pos);
    this.container.show();
  }

  public hide() {
    this.container.hide();
  }
}
