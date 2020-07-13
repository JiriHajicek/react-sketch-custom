
import FabricCanvasTool from './fabrictool'
import { fabric } from 'fabric';

class Pencil extends FabricCanvasTool {

  configureCanvas(props) {
    this._canvas.isDrawingMode = true;
    this._canvas.freeDrawingBrush.width = props.lineWidth;
    this._canvas.freeDrawingBrush.color = props.lineColor;
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

export default Pencil;