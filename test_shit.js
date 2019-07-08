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
 * Test readable stream class (for internal use in testing only)
 */
class TestReadableStreamNoReadableEventHandlers extends Readable {
  /**
   * Constructor
   * @param {Object} opts - options for the Readable stream 
   * 
   * @returns {TestReadableStream} - the object instance
   */
  constructor (opts) {
    super(opts);
    for (let e of ['data', 'close', 'error', 'end']) {
      this.on(e, (data, eventName = e) => console.log(`Event '${typeof eventName === 'string' ? eventName : JSON.stringify(eventName)}' received on TestReadableStreamNoReadableEventHandlers: event data = ${JSON.stringify(data instanceof Buffer ? data.toString() : data, null, 2)}`));
    }
  }
  /**
   * Required _read method of Readable interface. Logging no-op.
   * 
   * @returns {void}
   */
  _read () {
    console.log('TestReadableStreamNoReadableEventHandlers._read() called.');
  }
  
  /**
   * Wrapping read method of Readable interface. Logging no-op.
   * 
   * @returns {void}
  read () {
    console.log('TestReadableStreamNoReadableEventHandlers.read() called. Calling super.read()');
    super.read();
  }
   */
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
  
  /**
   * Wrapping push method of Writable interface. Logging no-op.
   * @param {Buffer} chunk - the chunk to be pushed onto the stream
   * @param {string} encoding - the encoding of the chunk
   * 
   * @returns {boolean} - true if successful, false if not
   */
  push (chunk, encoding) {
    console.log(`TestWritableStream.push(...) called with arguments ${JSON.stringify({chunk: chunk, encoding: encoding})}. Calling super.push(...)`);
    return super.push(chunk, encoding);
  }
}

const readableStreams = {
  TestReadableStream: new TestReadableStream(),
  TestReadableStreamNoReadableEventHandlers: new TestReadableStreamNoReadableEventHandlers()
};

for (let [streamClass, processStdout] of Object.entries(readableStreams)) {
  const progressObj = new TestWritableStream();
  progressObj.on('update', (data) => console.log(`Event 'update' received on ${streamClass} progressObj: event data = ${JSON.stringify(data, null, 2)}`));
  
  console.log('Piping now');
  processStdout.pipe(progressObj);
  console.log('Piped, but no data sent yet');
  
  console.log(`Pushing data to ${streamClass} processStdout`);
  for (let k = 0; k < 30; k++) {
    console.log(`Data${processStdout.push(`<< Data chunk # ${k} >>`) ? '' : ' NOT'} successfully pushed ${streamClass} processStdout`);
  }
  console.log(`Completed pushing data to ${streamClass} processStdout`);
  console.log(`Pushing null to ${streamClass} processStdout to end stream`);
  processStdout.push(null);
  console.log(`SCRIPT COMPLETE for ${streamClass}.`);
}

/* eslint-enable no-console */

