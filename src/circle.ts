/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'
import {linearDistance} from './utils';
import { fabric } from 'fabric';

class Circle extends FabricCanvasTool {
  private _width: number;
  private _color: string;
  private _fill: string;
  private isDown: boolean;
  private startX: number;
  private startY: number;
  private moved: boolean;
  private circle: fabric.Circle;

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
    this._width = props.lineWidth;
    this._color = props.lineColor;
    this._fill = props.fillColor;
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    this.isDown = true;
    this.moved = false;
    let pointer = canvas.getPointer(o.e);
    [this.startX, this.startY] = [pointer.x, pointer.y];
    this.circle = new fabric.Circle({
      left: this.startX, top: this.startY,
      originX: 'left', originY: 'center',
      strokeWidth: this._width,
      stroke: this._color,
      fill: this._fill,
      selectable: false,
      evented: false,
      radius: 1
    });
  }

  doMouseMove(o) {
    if (!this.isDown) return;
    let canvas = this._canvas;
    if (!this.moved) canvas.add(this.circle);
    this.moved = true;
    let pointer = canvas.getPointer(o.e);
    this.circle.set({
      radius: linearDistance({ x: this.startX, y: this.startY }, { x: pointer.x, y: pointer.y }) / 2,
      angle: Math.atan2(pointer.y - this.startY, pointer.x - this.startX) * 180 / Math.PI
    });
    this.circle.setCoords();
    canvas.renderAll();
  }

  doMouseUp(o) {
    let canvas = this._canvas;
    this.isDown = false;
    this.circle.rotate(0);
    if (!this.moved) canvas.remove(this.circle);
  }

  doMouseOut(event: fabric.IEvent): void {}
}

export default Circle;