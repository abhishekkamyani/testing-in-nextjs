// jest.polyfills.js
const { TextDecoder, TextEncoder } = require('node:util');
const { ReadableStream, TransformStream, WritableStream } = require('node:stream/web');
const { Blob, File } = require('node:buffer');
const { clearImmediate } = require('node:timers');
const { BroadcastChannel, MessagePort, MessageChannel } = require('node:worker_threads');

// 1. Assign all core Node.js Web API equivalents to the global object FIRST.
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder, writable: true, configurable: true },
  TextEncoder: { value: TextEncoder, writable: true, configurable: true },
  ReadableStream: { value: ReadableStream, writable: true, configurable: true },
  TransformStream: { value: TransformStream, writable: true, configurable: true },
  WritableStream: { value: WritableStream, writable: true, configurable: true },
  Blob: { value: Blob, writable: true, configurable: true },
  File: { value: File, writable: true, configurable: true },
  clearImmediate: { value: clearImmediate, writable: true, configurable: true },
  BroadcastChannel: { value: BroadcastChannel, writable: true, configurable: true },
  MessagePort: { value: MessagePort, writable: true, configurable: true },
  MessageChannel: { value: MessageChannel, writable: true, configurable: true },
});

// 2. NOW require undici.
const { fetch, Headers, Request, Response, FormData } = require('undici');

// 3. Finally, assign the Fetch API polyfills.
Object.defineProperties(globalThis, {
  fetch: { value: fetch, writable: true, configurable: true },
  Headers: { value: Headers, writable: true, configurable: true },
  Request: { value: Request, writable: true, configurable: true },
  Response: { value: Response, writable: true, configurable: true },
  FormData: { value: FormData, writable: true, configurable: true },
});