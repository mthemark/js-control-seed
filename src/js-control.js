import './js-control.css';
import Cropper from 'cropperjs'

/**
 * This JSDoc type def represents the data coming into your control from Decisions,
 * when `setValue` is called.
 * @typedef YourInputs
 * @property {string} name
 * @property {string} value
 */

/**
 * @typedef DecisionsJsControl
 * @property {function} DecisionsJsControl.initialize - (host: JQuery, component: any): void;
 * @property {function} DecisionsJsControl.resize - (height: number, width: number): void;
 * @property {function} DecisionsJsControl.setValue - (data: YourInputs): void;
 * @property {function} DecisionsJsControl.getValue - (): YourOutputs;
 */

if (process.env.NODE_ENV === 'development') {
  // place things here that you need to load or do only in the dev environment.
  // this code will be removed in production.
}

/**
 * JSControl class. Name of class will become name of functional constructor that
 * Decisions will call to create an instance of your control.
 * 1. Rename to reflect the name of your JS Control
 * @typedef {DecisionsJsControl} ImageEditorControl
 */
export class ImageEditorControl {
  /** @type {HTMLElement} parent element, within which to render your control. */
  parentElement;

  /** @type {JQuery<HTMLElement>} host */
  host;

  /** @type {HTMLDivElement} */
  divWrapper;
  /** @type {HTMLDivElement} */
  divCropper;

  /**@type {HTMLSpanElement} */
  labelText;

  /** @type {HTMLInputElement} */
  input;

  /** @type {HTMLCanvasElement} */
  canvasUpload;

  init_height = "600px";

  /** @type {Cropper} */
  cpCropper;

  constructor() {
    this.divWrapper = document.createElement('div');
    this.divWrapper.style.border = 'dashed purple 1px';
    this.divWrapper.className = 'my-label-wrapper';
    this.divCropper = document.createElement('span');
    this.divCropper.id = 'divCropper';
    this.labelText = document.createElement('span');
    this.labelText.className = 'my-label-text';
    this.divWrapper.appendChild(this.labelText);
    this.input = document.createElement('input');
    this.input.className = 'my-input';
    this.input.type = 'file';
    this.divWrapper.appendChild(this.input);
    this.canvasUpload = document.createElement('img');
    this.canvasUpload.id = 'canvasUpload';
    this.divCropper.style = 'max-height: 100%;display: block';
    this.divCropper.appendChild(this.canvasUpload);
    this.divWrapper.appendChild(this.divCropper);
  }

  loadFile(ev) {
    var files = ev.target.files; // FileList object
    var reader = new FileReader();
    reader.onload = function (e) {
      var c0 = document.getElementById('canvasUpload')
      var css = { height : "500px", width : 'auto'};
      c0.css = css;
      c0.src = reader.result;
      if (!c0.cropper) {
        new Cropper(c0, {
          viewMode: 2,
          dragMode: 'move',
          aspectRatio: 4/5,
          minContainerHeight: 500,
          crop: function (event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
          },
        });
      }
      else {
        c0.cropper.replace(reader.result);
      }
    };
    reader.readAsDataURL(files[0]);
  }

  /**
   * Do any work that needs to be done once for your control.
   *
   * In this example, we are creating the HTML parts using vanilla JS,
   * but you could embed another library into your control,
   * or use a [script control](https://documentation.decisions.com/docs/javascript-control-using-library)
   * @param {JQuery<HTMLElement>} host jquery element to append custom content into
   */
  initialize(host) {
    this.host = host;
    this.parentElement = host[0];
    this.parentElement.appendChild(this.divWrapper);
    this.input.addEventListener('change', (ev) => {
      this.loadFile(ev);
    });
  }

  /**
   * @param {YourInputs} values - an object with keys : values matching each input you have/will
   * define for your control on the Decisions side.
   */
  setValue(values) {
    // store any data your control needs to store
    this.labelText.innerText = values.name;
    //this.input.value = values.value;
  }

  /**
   * If your control requires programmatic resize, handle it here.
   * @param {number} height in pixels
   * @param {number} width in pixels
   */
  resize(height, width) {
    console.log('height', height, 'width', width);
  }

  /**
   * Return values if control needs to output data.
   */
  getValue() {
    return { value: this.input.value };
  }
}

// add constructor to global context.
window.ImageEditorControl = ImageEditorControl;
