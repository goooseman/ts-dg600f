// tslint:disable-next-line: no-relative-imports
import DG600F from "../src/DG600F";

// tslint:disable: no-console
const start = async () => {
  const dg600f = new DG600F({
    baudRate: 4800,
    device: "/dev/tty.SLAB_USBtoUART", //device address, use 'npx @serialport/list' to get a list
  });

  dg600f.on("coin", (coin: number) => {
    console.log("Coin is accepted", coin);
  });

  dg600f.on("error", console.error);

  void dg600f.start();

  process.on("SIGINT", () => {
    process.exit(0);
  });

  process.on("exit", () => {
    void dg600f.disable();
  });

  process.on("uncaughtException", (err: Error) => {
    console.error(err);
    process.exit(1);
  });
};

void start();
