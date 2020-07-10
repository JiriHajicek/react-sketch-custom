/* eslint no-unused-vars: 0 */

import type { fabric } from 'fabric';

/**
 * "Abstract" like base class for a Canvas tool
 */
abstract class FabricCanvasTool {
  protected readonly _canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this._canvas = canvas;
  }

  abstract configureCanvas(props): void;

  abstract doMouseUp(event: fabric.IEvent): void;

  abstract doMouseDown(event: fabric.IEvent): void

  abstract doMouseMove(event: fabric.IEvent): void;

  abstract doMouseOut(event: fabric.IEvent): void;
}

export default FabricCanvasTool;