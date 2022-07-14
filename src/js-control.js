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
  /** @type {HTMLDivElement} */
  divControls;

  /**@type {HTMLSpanElement} */
  labelText;

  /** @type {HTMLInputElement} */
  inputFile;

  /** @type {HTMLInputElement} */
  inputCrop;

  /** @type {HTMLCanvasElement} */
  canvasUpload;

  /** @type {HTMLCanvasElement} */
  canvasOutput;

  outputFile;

  outputHeight = 720;

  init_height = "600px";

  /** @type {Cropper} */
  cpCropper;

  constructor() {
    this.divFullControl = document.createElement('div');
    this.divWrapper = document.createElement('div');
    this.divWrapper.className = 'cropper-wrapper';
    this.divCropper = document.createElement('span');
    this.divCropper.id = 'divCropper';
    this.labelText = document.createElement('span');
    this.labelText.className = 'cropper-wrapper-text';
    this.labelText.innerText = 'Upload Image'
    this.divWrapper.appendChild(this.labelText);
    this.inputFile = document.createElement('input');
    this.inputFile.className = 'common-input';
    this.inputFile.type = 'file';
    this.divWrapper.appendChild(this.inputFile);
    this.canvasUpload = document.createElement('img');
    this.canvasUpload.id = 'canvasUpload';
    this.divCropper.className = 'divCropper';
    this.divCropper.appendChild(this.canvasUpload);
    this.divWrapper.appendChild(this.divCropper);
    this.divControls = document.createElement('div');
    this.inputCrop = document.createElement('input');
    this.inputCrop.value = 'Crop Image';
    this.inputCrop.className = 'common-input';
    this.inputCrop.type = 'button';
    this.divControls.className = 'controls-wrapper';
    this.divControls.appendChild(this.inputCrop);
    this.divFullControl.appendChild(this.divWrapper);
    this.divFullControl.appendChild(this.divControls);
  }

  loadFile(ev) {
    var files = ev.target.files; // FileList object
    var reader = new FileReader();
    reader.onload = function (e) {
      var c0 = document.getElementById('canvasUpload')
      var css = { height: "500px", width: 'auto' };
      c0.css = css;
      c0.src = reader.result;
      if (!c0.cropper) {
        new Cropper(c0, {
          viewMode: 2,
          dragMode: 'move',
          aspectRatio: 4 / 5,
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

  download() {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(this.outputFile);
    a.download = this.outputFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
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
    this.parentElement.appendChild(this.divFullControl);
    this.inputFile.addEventListener('change', (ev) => { this.loadFile(ev); });
    this.inputCrop.addEventListener('click', (ev) => {
      //https://github.com/fengyuanchen/cropperjs#getcroppedcanvasoptions
      if (!this.canvasUpload.cropper) {
        alert('please selected an image...');
      }
      else {
        this.canvasUpload.cropper.getCroppedCanvas({
          height: this.outputHeight,
          imageSmoothingEnabled: false,
        }).toBlob((blob) => {
          this.outputFile = new File([blob], "cropped.image.png", { lastModified: new Date().getTime(), type: blob.type });
          //auto download
          this.download();
        });
      }
    });
  }

  /**
   * @param {YourInputs} values - an object with keys : values matching each input you have/will
   * define for your control on the Decisions side.
   */
  setValue(values) {
    // store any data your control needs to store
    //this.labelText.innerText = values.name;
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
    return {
      value: this.inputFile.value,
      outputFile: this.outputFile
    };
  }
}

// add constructor to global context.
window.ImageEditorControl = ImageEditorControl;
