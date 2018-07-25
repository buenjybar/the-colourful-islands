import { Component, OnInit, ViewChild } from '@angular/core';

const SIZE = 50;
const SEA_LAND_RATIO = 40;

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

  public onColorChanged(event: Event) {
    // Write your code below.
    this.newColor = this.inputEl.nativeElement.value;
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
    // Write your code below.
    const canvas = this.canvasEl.nativeElement;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    const squareWidth = Math.floor(canvas.width / SIZE);
    const squareHeight = Math.floor(canvas.height / SIZE);
    const self = this;

    canvas.addEventListener('click', function (event) {

      const x = Math.floor(event.offsetX / squareWidth) * squareWidth,
        y = Math.floor(event.offsetY / squareHeight) * squareHeight,
        row = y / squareHeight,
        col = x / squareWidth;

      if (self.getValueAt(row, col) === AreaStatus.Land) {
        self.setIslandColor(row, col, self.newColor);

        const islandDiscoveryStatuses = Array(SIZE).fill(false).map(() => Array(SIZE).fill(false));
        self.traverseIsland(row, col, islandDiscoveryStatuses, self.newColor);

        self.render();
      }

    }, false);
  }

  /**
   * discover islands and apply a new color to each of them.
   * the definition of an Island is : All LAND square that connect to an other LAND square
   */
  private findIslands() {
    // Write your code below.

    // on init, all island are undiscovered
    const islandDiscoveryStatuses = Array(SIZE).fill(false).map(() => Array(SIZE).fill(false));
    let discoveredIslandColor;

    // start discovering islands
    for (let i = 0; i < SIZE; ++i) {
      for (let j = 0; j < SIZE; ++j) {
        if (this.getValueAt(i, j) === AreaStatus.Land && !islandDiscoveryStatuses[i][j]) {
          discoveredIslandColor = this.generateRandomColor();
          this.setIslandColor(i, j, discoveredIslandColor);
          this.traverseIsland(i, j, islandDiscoveryStatuses, discoveredIslandColor);
          ++this.numberOfIslands;
        }
      }
    }
  }

  /**
   *  Discover island neighbors
   */
  private traverseIsland(row, col, islandDiscoveryStatuses, discoveredIslandColor) {
    // row and column numbers of the 8 neighbors
    const rowNumbers = [-1, -1, -1, 0, 0, 1, 1, 1];
    const colNumbers = [-1, 0, 1, -1, 1, -1, 0, 1];

    islandDiscoveryStatuses[row][col] = true;

    for (let i = 0; i < 8; ++i) {
      if (this.canBeTraversed(row + rowNumbers[i], col + colNumbers[i], islandDiscoveryStatuses)) {
        this.setIslandColor(row + rowNumbers[i], col + colNumbers[i], discoveredIslandColor);
        this.traverseIsland(row + rowNumbers[i], col + colNumbers[i], islandDiscoveryStatuses, discoveredIslandColor);
      }
    }
  }

  /**
   * check if the area can be traversed
   */
  private canBeTraversed(row, col, islandDiscoveryStatuses) {
    return (row >= 0) && (row < SIZE) &&
      (col >= 0) && (col < SIZE) &&
      (this.getValueAt(row, col) === AreaStatus.Land &&
      !islandDiscoveryStatuses[row][col]);
  }

}
