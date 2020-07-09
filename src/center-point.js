/*eslint no-unused-vars: 0*/

import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

class CenterPointTool extends FabricCanvasTool {
  configureCanvas(props) {
    let canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => (o.selectable = o.evented = false));

    /**
     * @type {string}
     */
    this._color = props.lineColor;

    /**
     * @type {string}
     */
    this._fill = props.fillColor;

    /**
     * @type {number}
     */
    this._width = props.lineWidth;

    /**
     * @type {number}
     */
    this._radius = 10;
  }

  doMouseDown(o) {
    const canvas = this._canvas;
    const pointer = canvas.getPointer(o.e);

    const existingCenterPoint = canvas
      .getObjects()
      .find((object) => object.type === "center-point-group");

    if (existingCenterPoint) {
      existingCenterPoint.set({ top: pointer.y, left: pointer.x });
      existingCenterPoint.bringToFront();
      canvas.renderAll();
      return;
    }

    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
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
      left: pointer.x,
      top: pointer.y - 25,
      selectable: false,
      evented: false,
    });
    const rectBottom = new fabric.Rect({
      width: 5,
      height: 20,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: pointer.x,
      top: pointer.y + 25,
      selectable: false,
      evented: false,
    });
    const rectLeft = new fabric.Rect({
      width: 20,
      height: 5,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: pointer.x - 25,
      top: pointer.y,
      selectable: false,
      evented: false,
    });
    const rectRight = new fabric.Rect({
      width: 20,
      height: 5,
      fill: this._fill,
      originX: 'center',
      originY: 'center',
      left: pointer.x + 25,
      top: pointer.y,
      selectable: false,
      evented: false,
    });

    const group = new fabric.Group(
      [ circle, rectTop, rectBottom, rectLeft, rectRight ],
      {
        type: 'center-point-group',
        originY: 'center',
        originX: 'center'
      });
    canvas.add(group);

    canvas.renderAll();
  }

  doMouseMove(o) {}

  doMouseUp(o) {}
}

export default CenterPointTool;
