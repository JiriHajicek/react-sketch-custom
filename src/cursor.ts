/*eslint no-unused-vars: 0*/

import FabricCanvasTool from './fabrictool'
import { fabric } from 'fabric';

class Cursor extends FabricCanvasTool {

  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => o.selectable = o.evented = false);
  }

  doMouseDown(event: fabric.IEvent): void {
  }

  doMouseMove(event: fabric.IEvent): void {
  }

  doMouseOut(event: fabric.IEvent): void {
  }

  doMouseUp(event: fabric.IEvent): void {
  }
}

export default Cursor;