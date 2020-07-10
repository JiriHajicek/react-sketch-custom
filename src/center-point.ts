/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";
import { fabric } from 'fabric';

class CenterPointTool extends FabricCanvasTool {
  private _color: string;
  private _fill: string;
  private _width: number;
  private _radius: number;

  configureCanvas(props) {
    const  canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => (o.selectable = o.evented = false));

    this._color = props.lineColor;
    this._fill = props.fillColor;
    this._width = props.lineWidth;
    this._radius = 10;

    const activeObject: fabric.Object | undefined = canvas.getActiveObject();
    const existingCenterPoint: fabric.Object | undefined = this.getCenterPoint();


    if (activeObject) {
      const centerPoint = activeObject.getCenterPoint();

      if (existingCenterPoint) {
        existingCenterPoint.set({ top: centerPoint.y, left: centerPoint.x });
        existingCenterPoint.bringToFront();
      } else {
        const centerPointGroup = this.createCenterPointGroup({ x: centerPoint.x, y: centerPoint.y });
        centerPointGroup.bringToFront();
        canvas.add(centerPointGroup);
      }

      canvas.renderAll();
    }

  }

  doMouseDown(o: fabric.IEvent) {
    const canvas = this._canvas;
    const pointer = canvas.getPointer(o.e);

    const existingCenterPoint = this.getCenterPoint();

    if (existingCenterPoint) {
      existingCenterPoint.set({ top: pointer.y, left: pointer.x });
      existingCenterPoint.bringToFront();
      canvas.renderAll();
      return;
    }

    const centerPointGroup = this.createCenterPointGroup(pointer);

    canvas.add(centerPointGroup);

    canvas.renderAll();
  }

  doMouseMove(o: fabric.IEvent) {}

  doMouseUp(o: fabric.IEvent) {}

  doMouseOut(event: fabric.IEvent) {
  }

  getCenterPoint(): fabric.Object | undefined {
    return this._canvas
      .getObjects()
      .find((object) => object.type === "center-point-group");
  }

  createCenterPointGroup(position: { x: number, y: number }): fabric.Group {
    const circle = new fabric.Circle({
      left: position.x,
      top: position.y,
      originX: "center",
      originY: "center",
      fill: this._fill,
      selectable: false,
      evented: false,
      radius: this._radius,
    });

    const rectTop = new fabric.Rect({
      width: 5,
      height: 20,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: position.x,
      top: position.y - 25,
      selectable: false,
      evented: false,
    });
    const rectBottom = new fabric.Rect({
      width: 5,
      height: 20,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: position.x,
      top: position.y + 25,
      selectable: false,
      evented: false,
    });
    const rectLeft = new fabric.Rect({
      width: 20,
      height: 5,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: position.x - 25,
      top: position.y,
      selectable: false,
      evented: false,
    });
    const rectRight = new fabric.Rect({
      width: 20,
      height: 5,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: position.x + 25,
      top: position.y,
      selectable: false,
      evented: false,
    });

    return new fabric.Group(
      [ circle, rectTop, rectBottom, rectLeft, rectRight ],
      {
        type: 'center-point-group',
        originY: 'center',
        originX: 'center'
      });
  }
}

export default CenterPointTool;
