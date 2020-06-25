import FabricCanvasTool from "./fabrictool";

const fabric = require("fabric").fabric;

function polygonPositionHandler(dim, finalMatrix, fabricObject) {
  const x = (fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x),
    y = (fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y);

  return fabric.util.transformPoint(
    { x: x, y: y }, fabricObject.calcTransformMatrix()
  );
}

function actionHandler(eventData, transform, x, y) {
  const polygon = transform.target,
    currentControl = polygon.controls[polygon.__corner],
    mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    size = polygon._getTransformedDimensions(0, 0),
    finalPointPosition = {
      x: mouseLocalPosition.x * polygon.width / size.x + polygon.pathOffset.x,
      y: mouseLocalPosition.y * polygon.height / size.y + polygon.pathOffset.y
    };
  polygon.points[currentControl.pointIndex] = finalPointPosition;
  return true;
}

// define a function that can keep the polygon in the same position when we change its
// width/height/top/left.
function anchorWrapper(anchorIndex, fn) {
  return function(eventData, transform, x, y) {
    const fabricObject = transform.target,
      absolutePoint = fabric.util.transformPoint({
        x: (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x),
        y: (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y),
      }, fabricObject.calcTransformMatrix());

    const actionPerformed = fn(eventData, transform, x, y);
    const newDim = fabricObject._setPositionDimensions({});
    const newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / fabricObject.width,
      newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / fabricObject.height;
    fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    return actionPerformed;
  }
}

export default class PolylineCutTool extends FabricCanvasTool {
  configureCanvas(props) {
    const canvas = this._canvas;
    canvas.isDrawingMode = canvas.selection = false;
    canvas.forEachObject((o) => (o.selectable = o.evented = false));

    this._width = props.lineWidth;
    this._color = props.lineColor;
    this.completedEdit = false;
    this.editing = false;

    this.initializeRoof();

    /**
     *
     * @type {Line[]}
     */
    this.lines = [];
  }

  /**
   * Create new roof with no points
   */
  initializeRoof() {
    /**
     *
     * @type {Polygon}
     */
    this.roof = new fabric.Polygon([], {
      strokeWidth: 1,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'blue',
      type: 'polygon-cut',
      globalCompositeOperation: 'destination-out',
    });
  }

  doMouseDown(o) {
    let canvas = this._canvas;
    const pointer = canvas.getPointer(o.e);

    if (!!canvas.getActiveObject()) return null;
    if (!canvas.getActiveObject() && this.editing) {
      this.editing = false;
      return;
    }

    // if (this.roof.edit) return;
    // if (!this.roof.edit && this.completedEdit) {
    //   this.completedEdit = false;
    //   return;
    // }

    const shouldEndPolygon = this.shouldEndPolygon(o)

    if (shouldEndPolygon) {
      this.endPolygon(o)
      // this.edit();
    }
    else {
      this.lines.push(new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        strokeWidth: 3,
        selectable: false,
        stroke: 'white',
      }))

      canvas.add(this.lines[this.lines.length - 1]);
    }

    canvas.renderAll();
  }

  doMouseMove(o) {
    let canvas = this._canvas;
    const pointer = canvas.getPointer(o.e);

    if (this.lines.length === 0 || this.roof.edit) return;

    this.lines[this.lines.length - 1].set({
      x2: pointer.x,
      y2: pointer.y,
    })

    canvas.renderAll();
  }

  doMouseUp(o) {

  }

  doMouseOut(o) {

  }

  /**
   * If last line is at most 10 pixels from the first point
   * we can consider it as a closed polyline
   * @param o
   * @returns {boolean}
   */
  shouldEndPolygon(o) {
    const canvas = this._canvas;
    const pointer = canvas.getPointer(o.e);

    return this.lines.some(line => {
      const startingPoint = new fabric.Point(line.x1, line.y1);
      const distanceFromCursor = startingPoint.distanceFrom(pointer);

      return distanceFromCursor < 10;
    })
  }

  /**
   *
   * @param o
   */
  endPolygon(o) {
    const canvas = this._canvas;

    canvas.remove(this.roof);

    this.roof.points = this.lines.map(line => new fabric.Point(line.x1, line.y1));

    const obj = this.roof.toObject();
    delete obj.top;
    delete obj.left;

    const shape = new fabric.Polygon(this.roof.points, obj);

    this.lines.forEach(line => canvas.remove(line))
    this.lines = [];
    this.editing = true;
    this.initializeRoof();
    canvas.add(shape);

    canvas.renderAll();
  }

  edit() {
    const canvas = this._canvas;

    /**
     * Find polyline in canvas objects
     * @type {Polygon}
     */
    const poly = canvas.getObjects().find(canvasObject => {
      if (!canvasObject.points || canvasObject.type !== 'polygon') return false;
      if (canvasObject.points.length !== this.roof.points.length);

      return !canvasObject.points.some((point, index) => point.x !== this.roof.points[index].x || point.y !== this.roof.points[index].y)
    })

    canvas.setActiveObject(poly);
    poly.edit = !poly.edit;

    if (poly.edit) {
      const lastControl = poly.points.length - 1;
      poly.cornerStyle = 'circle';

      poly.controls = poly.points.reduce(function(acc, point, index) {
        acc['p' + index] = new fabric.Control({
          positionHandler: polygonPositionHandler,
          actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
          actionName: 'modifyPolygon',
          pointIndex: index
        });

        return acc;
      }, {});
    } else {
      poly.cornerStyle = 'rect';
      poly.controls = fabric.Object.prototype.controls;
    }

    poly.hasBorders = !poly.edit;

    canvas.requestRenderAll();
  }
}
