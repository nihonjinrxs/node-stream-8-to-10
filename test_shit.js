const { Readable, Writable } = require('stream');

/* eslint-disable no-console */

/**
 * Test readable stream class (for internal use in testing only)
 */
class TestReadableStream extends Readable {
  /**
   * Constructor
   * @param {Object} opts - options for the Readable stream 
   * 
   * @returns {TestReadableStream} - the object instance
   */
  constructor (opts) {
    super(opts);
    for (let e of ['readable', 'data', 'close', 'error', 'end']) {
      this.on(e, (data, eventName = e) => console.log(`Event '${typeof eventName === 'string' ? eventName : JSON.stringify(eventName)}' received on TestReadableStream: event data = ${JSON.stringify(data instanceof Buffer ? data.toString() : data, null, 2)}`));
    }
    this.on('readable', (_data) => {
      this.on('data', (chunk) => console.log(`Event 'data' received on TestReadableStream: event data = ${JSON.stringify(chunk.toString(), null, 2)}`));
    });
  }
  /**
   * Required _read method of Readable interface. Logging no-op.
   * 
   * @returns {void}
   */
  _read () {
    console.log('TestReadableStream._read() called.');
  }
  
  /**
   * Wrapping read method of Readable interface. Logging no-op.
   * 
   * @returns {void}
  read () {
    console.log('TestReadableStream.read() called. Calling super.read()');
    super.read();
  }
   */
  
  /**
   * Wrapping push method of Readable interface. Logging no-op.
   * @param {Buffer} chunk - the chunk to be pushed onto the stream
   * @param {string} encoding - the encoding of the chunk
   * 
   * @returns {boolean} - true if successful, false if not
   */
  push (chunk, encoding) {
    console.log('TestReadableStream.read() called. Calling super.read()');
    return super.push(chunk, encoding);
  }
}

/**
 * A test Writable class that emits on write
 */
class TestWritableStream extends Writable {
  /**
   * Constructor
   * @param {Object} options - options for the Writable stream 
   * 
   * @returns {TestWritableStream} - the object instance
   */
  constructor (options) {
    super(options);
    this.bufferedData = [];
    for (let e of ['pipe', 'unpipe', 'drain', 'close', 'error', 'finish']) {
      this.on(e, (data, eventName = e) => console.log(`Event '${typeof eventName === 'string' ? eventName : JSON.stringify(eventName)}' received on TestWritableStream: event data = ${JSON.stringify(data, null, 2)}`));
    }
  }
  /**
   * Required _write method of Writeable interface. Buffer, emit, and callback.
   * @param {buffer|string} chunk - the chunk to be written
   * @param {string|undefined} encoding - the encoding of the chunk
   * @param {function} callback - the callback function to execute when done
   * 
   * @returns {void}
   */
  _write (chunk, encoding, callback) {
    const data = encoding === 'buffer' ? chunk.toString() : chunk.toString(encoding);
    this.bufferedData.push(data);
    /**
      * update event
      *
      * @event TestWritableStream#update
      * @type {object}
      * @property {string} data - stringified chunk to be written
      */
    this.emit('update', { data: data });
    callback();
  }
}

const processStdout = new TestReadableStream();
const progressObj = new TestWritableStream();
progressObj.on('update', (data) => console.log(`Event 'update' received on TestWritableStream progressObj: event data = ${JSON.stringify(data, null, 2)}`));

console.log('Piping now');
processStdout.pipe(progressObj);
console.log('Piped, but no data sent yet');

console.log('Pushing data to TestReadableStream processStdout');
for (let k = 0; k < 30; k++) {
  console.log(`Data${processStdout.push(`<< Data chunk # ${k} >>`) ? '' : ' NOT'} successfully pushed TestReadableStream processStdout`);
}
console.log('Completed pushing data to TestReadableStream processStdout');
console.log('Pushing null to TestReadableStream processStdout to end stream');
processStdout.push(null);
console.log('SCRIPT COMPLETE.');

/* eslint-enable no-console */

