import { OpenOptions } from "serialport";

export type DG600FOptions = {
  /**
   * 'npx @serialport/list' to get a list
   */
  device: string;
  /**
   * Default is 9600
   */
  baudRate?: OpenOptions["baudRate"];
  /**
   * Default is 8
   */
  dataBits?: OpenOptions["dataBits"];
  /**
   * Default is 2
   */
  stopbits?: OpenOptions["stopBits"];
  /**
   * Default is none
   */
  parity?: OpenOptions["parity"];
};
