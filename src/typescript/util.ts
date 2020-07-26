
export class StringBuffer {
  //private text: string;
  private arr: Array<string>;

  constructor(text: string) {
    //this.text = text;
    this.arr = text.split("");
  }

  public length() : number {
    return this.arr.length;
  }
  
  public substring(
    start: number, end: number): string {
      return this.arr.slice(start, end).join("");
  }

  public charAt(index: number) : string {
    return this.arr[index];
  }

  public setCharAt(index: number, c: string ) {
      this.arr[index] = c;
  }

  public toString() : string {
    return this.arr.join("");
  }
}
