import {Position} from "./common";

export interface DomElement {
  element: any;
  appendChild(child: DomElement): void;
  setClassName(name: string): void;
  setPosition(pos: Position): void;

  hide(): void;
  show(): void;

  setText(text: string) : void;
  getText() : string;
  // Clears contents, deletes children.
  clear(): void;

  setClickHandler(handler: any) : void;
}

export interface DomFactory {
  createDiv() : DomElement;
}
