/* eslint no-unused-vars: 0 */

/**
 * "Abstract" like base class for a Canvas tool
 */
class FabricCanvasTool {
  /**
   *
   * @param {fabric.Canvas} canvas
   */
  constructor(canvas) {
    /**
     * @type {fabric.Canvas}
     */
    this._canvas = canvas;
  }

  configureCanvas(props) {

  }

  /**
   *
   * @param {IEvent} event
   */
  doMouseUp(event) {

  }

  /**
   *
   * @param {IEvent} event
   */
  doMouseDown(event) {

  }

  /**
   *
   * @param {IEvent} event
   */
  doMouseMove(event) {

  }

  /**
   *
   * @param {IEvent} event
   */
  doMouseOut(event) {

  }
}

export default FabricCanvasTool;