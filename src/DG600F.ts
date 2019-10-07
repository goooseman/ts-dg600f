import ParserByteLength from "@serialport/parser-byte-length";
import { EventEmitter } from "events";
import Serialport from "serialport";
import { promisify } from "util";
import { DG600FOptions } from "./types";

class DG600F extends EventEmitter {
  private socket?: Serialport;
  private options: Required<DG600FOptions>;
  constructor(options: DG600FOptions) {
    super();
    this.options = {
      baudRate: 4800,
      dataBits: 8,
      stopbits: 2,
      parity: "none",
      ...options,
    };
  }

  public isOpened(): boolean {
    return (this.socket && this.socket.isOpen) || false;
  }

  public isEnabled(): boolean {
    return true;
  }

  public async start() {
    if (this.socket) {
      await promisify(this.socket.close)();
    }

    this.socket = new Serialport(this.options.device, {
      baudRate: this.options.baudRate,
      dataBits: this.options.dataBits,
      stopBits: this.options.stopbits,
      parity: this.options.parity,
      autoOpen: false,
    });

    this.socket.on("close", () => {
      this.emit("close");
    });

    this.socket.on("error", (err: Error) => {
      this.emit("error", err);
    });

    const parser = this.socket.pipe(new ParserByteLength({ length: 3 }));
    parser.on("data", this.handleData);
    this.socket.open();
    this.emit("ready");
  }

  public async close() {
    if (!this.socket) {
      throw new Error("Connection is not opened");
    }
    await promisify(this.socket.close)();
    this.socket = undefined;
    this.emit("close");
  }

  public async enable() {
    // Device does not need to be enabled
    // But this method exists for the interface compatibility with ts-ssp
  }
  public async disable() {}
  public async reset() {}

  /**
   * Handles data from device
   * The DG600F (in the configuration I've chosen) sends out 3 bytes for every coin:
   * Byte 1 = 0xAA
   * Byte 2 = User-configured coin value (€0,05 = 3, €0,10 = 5, €0,20 = 10, €0,50 = 25, €1 = 50, €2 = 100)
   * Byte 3 = XOR of byte 1 and 2
   */
  private handleData = (buffer: Buffer) => {
    if (buffer[0] !== 0xaa) {
      this.emit(
        "error",
        new Error(
          `First byte in buffer expected to be 0xAA, but recieved ${buffer[0]}`,
        ),
      );
      return;
    }
    if (buffer[1] < 1 || buffer[1] > 100) {
      this.emit(
        "error",
        new Error(
          `Second byte in buffer expected to be beetween 1 and 100, but recieved ${buffer[1]}`,
        ),
      );
      return;
    }
    if (buffer[2] !== (buffer[0] ^ buffer[1])) {
      this.emit(
        "error",
        new Error(
          `Third byte in buffer expected to be ${buffer[0] ^
            buffer[1]}, but recieved ${buffer[2]}`,
        ),
      );
      return;
    }
    this.emit("coin", buffer[1]);
  };
}

export default DG600F;
