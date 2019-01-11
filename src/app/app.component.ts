import { Component, OnInit, ViewChild } from '@angular/core';

const SIZE = 50;
const SEA_LAND_RATIO = 30;

enum AreaStatus {
  Sea = 0,
  Land = 1,
  Discovered = 2,
}

const SEA_COLOR = '#cbe1ff';
const LAND_COLOR = '#bbbbbb';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public title = 'The Island Discovery';
  public canvasWidth = 800;
  public canvasHeight = 800;
  public island: number[] = new Array(SIZE * SIZE);
  public color: string[] = new Array(SIZE * SIZE);
  public newColor: string = '#00FF00';
  public timeGeneration = 0;
  public numberOfIslands = 0;

  @ViewChild('canvasElement')
  public canvasEl;

  @ViewChild('inputElement')
  public inputEl;

  private position;

  public ngOnInit() {
    this.generate();
    const start = performance.now();
    this.findIslands();
    const end = performance.now();
    this.timeGeneration = Math.floor((end - start) * 100) / 100;

    this.attachEventListeners();
    this.render();
  }


//we don't need this
  public onColorChanged(event: Event) {
  }

  private getInitialColor(value: number): string {
    if (value === AreaStatus.Land) {
      return LAND_COLOR;
    }
    return SEA_COLOR;
  }

  private setValueAt(row: number, column: number, value: number) {
    this.island[row * SIZE + column] = value;
  }

  private getValueAt(row: number, column: number): number {
    return this.island[row * SIZE + column];
  }

  private setIslandColor(row: number, column: number, value: string) {
    this.color[row * SIZE + column] = value;
  }

  private getIslandColor(row: number, column: number): string {
    return this.color[row * SIZE + column];
  }

  /**
   * generate new island
   */
  private generate() {

    let state, color;
    for (let col = 0; col < SIZE; col++) {
      for (let row = 0; row < SIZE; row++) {
        state = Math.round(Math.random() * 100);
        const area = state >= SEA_LAND_RATIO ? AreaStatus.Sea : AreaStatus.Land;
        color = this.getInitialColor(area);

        this.setValueAt(row, col, area);
        this.setIslandColor(row, col, color);
      }
    }
  }

  /**
   * render the island into the canvas Element
   */
  private render() {
    const canvas = this.canvasEl.nativeElement;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const ctx = canvas.getContext('2d');
    const squareWidth = Math.floor(canvas.width / SIZE);
    const squareHeight = Math.floor(canvas.height / SIZE);

    let x, y;
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        ctx.fillStyle = this.getIslandColor(row, col);
        y = row * squareHeight;
        x = col * squareWidth;
        ctx.fillRect(x, y, squareWidth, squareHeight);
        ctx.fillStyle = '#000';
      }
    }
  }

  /**
   * generate random color
   * @return {string}
   */
  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    const color = ['#'];
    for (let i = 0; i < 6; i++) {
      color.push(letters[Math.floor(Math.random() * 16)]);
    }
    return color.join('');
  }

  /**
   * attach event listeners
   */
  private attachEventListeners() {
    this.canvasEl.nativeElement.onclick = this.createChangeColor(this)
  }

  //Allow access to this in event scope
  private createChangeColor(self) {
    return((event :MouseEvent) => {
      let x = 0;
      let y = 0;
      let canvas = <HTMLCanvasElement>event.target;
      x = event.pageX - canvas.offsetLeft;
      y = event.pageY - canvas.offsetTop;
      x = Math.floor(x / (self.canvasWidth / SIZE));
      y = Math.floor(y / (self.canvasHeight / SIZE));
      if (self.getValueAt(y, x) > 1) {
        if (self.parseInput(self.inputEl.nativeElement.value) === true) {
          self.scanAround(y, x, self.inputEl.nativeElement.value);
          self.render();
        }
      }
    })
  }

  //Make sure hex code in input field is valid
  private parseInput(value) {
    if (value.length === 4)
      var checkedInput  = /^#[0-9A-F]{3}$/i.test(value);
    else if (value.length === 7)
      var checkedInput  = /^#[0-9A-F]{6}$/i.test(value);
    else
      checkedInput = false;
    return checkedInput;
  }

  private scanAround(row, col, color) {
    let initVal = this.getValueAt(row, col);
    this.setIslandColor(row, col, color);
    this.setValueAt(row, col, (initVal + 1));

    let direction = 0;
    while (direction < 8) {
      let offsetRow = row;
      let offsetCol = col;
      if (direction === 0 || direction === 1 || direction === 7)
        offsetCol += 1;
      if (direction == 1 || direction === 2 || direction === 3)
        offsetRow += 1;
      if (direction === 3 || direction === 4 || direction === 5)
        offsetCol -= 1;
      if (direction === 5 || direction === 6 || direction === 7)
        offsetRow -= 1;
      if (offsetCol < SIZE && offsetRow < SIZE && offsetCol >= 0 &&
          offsetRow >= 0 && this.getValueAt(offsetRow, offsetCol) === initVal) {
        this.scanAround(offsetRow, offsetCol, color);
      }
        direction++;
    }
  }


  //Make sure color is unique
  private  defineColor(colorChecker) {
    const color = this.generateRandomColor();
    for (let i = 0; i < colorChecker.length; i++) {
      if (colorChecker[i] === color)
        return this.defineColor(colorChecker);
    }
    colorChecker.push(color);
    return color;
  }

  private findIslands() {
    var colorChecker = new Array();
    for (let row = 0; row < SIZE;  row++) {
      for (let col = 0; col < SIZE; col++) {
        if (this.getValueAt(row, col) === 1) {
          let color = this.defineColor(colorChecker);
          this.numberOfIslands++;
          this.scanAround(row, col, color);
        }
      }
    }
  }
}
