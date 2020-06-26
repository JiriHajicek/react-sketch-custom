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
      .find((object) => object.type === "center-point");

    if (existingCenterPoint) {
      existingCenterPoint.set({ top: pointer.y, left: pointer.x });
      canvas.renderAll();
      return;
    }

    canvas.add(
      new fabric.Circle({
        left: pointer.x,
        top: pointer.y,
        originX: "center",
        originY: "center",
        fill: this._fill,
        selectable: false,
        evented: false,
        radius: this._radius,
        type: "center-point",
      })
    );

    canvas.renderAll();
  }

  doMouseMove(o) {}

  doMouseUp(o) {}
}

export default CenterPointTool;
