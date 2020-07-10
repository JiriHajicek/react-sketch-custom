/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'
import { fabric } from "fabric";

class Select extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = false;
    canvas.selection = true;
    canvas.forEachObject((o) => {
      o.selectable = o.evented = true;
    });
  }

  doMouseMove(o: fabric.IEvent): void {}

  doMouseUp(o: fabric.IEvent): void {}

  doMouseOut(event: fabric.IEvent): void {
  }

  doMouseDown(event: fabric.IEvent): void {
  }
}

export default Select