import {DomElement, DomFactory} from "./view";
import {Position} from "./common";

export class DomElementImpl implements DomElement {
  constructor(public readonly element: HTMLElement) {
  }
  appendChild(child: DomElement) :void {
    this.element.appendChild(child.element);
  }
  setClassName(name: string) : void{
    this.element.className = name;
  }
  setPosition(pos: Position) :void{
    this.element.style.top = pos.top + "px";
    this.element.style.left = pos.left + "px";
  }
  hide() : void {
    this.element.style.display = "none";
  }
  show(): void {
    this.element.style.display = "block";
  }
  setText(text: string) : void {
    this.element.textContent = text;
  }
  getText(): string {
    return this.element.textContent;
  }
  clear() : void{
    this.element.innerHTML = "";
  }
  setClickHandler(handler: any) : void {
    this.element.addEventListener("click", handler);
  }
}

export class DomFactoryImpl implements DomFactory {
  createDiv() : DomElement {
    return new DomElementImpl(document.createElement("div"));
  }
}
