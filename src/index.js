import './testbed.css';
import { initializeTestBed } from './testbed.ts';
import { ImageEditorControl } from './js-control';
import { value } from './value';
import 'cropperjs/dist/cropper.css'

/**
 * This is mock container app that simulates how Decisions will
 * instantiate, initialize, and setValue, getValue, resize, etc.
 */

const control = new ImageEditorControl();
const host = initializeTestBed(control);
control.initialize(host);

document.addEventListener('resize', () => {
  const size = host[0].getBoundingClientRect();
  control.resize(size.height, size.width);
});
  
control.setValue(value);

