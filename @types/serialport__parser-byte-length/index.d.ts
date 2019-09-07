declare module "@serialport/parser-byte-length" {
  import { Writable } from "stream";

  type ByteLengthOptions = {
    length: number;
  };
  class ByteLength extends Writable {
    constructor(options: ByteLengthOptions);
  }
  export = ByteLength;
}
