# Typescript DG600F coin acceptor protocol

> NodeJS library to work with DG600F coin acceptor. Based on the [work](https://github.com/dhoepelman/in4389) of [dhoepelman](https://github.com/dhoepelman).

**Warning!** Library is not yet tested and published.

### Supported devices

- DG600F

### Installation

`npm install ts-dg600f`

### DG600F Settings

The library assumes certain settings on the DG600F. See [its technical manual](./docs/DG600F.pdf) for how to set these

| Setting                 | Value                      |
| ----------------------- | -------------------------- |
| DIP-switch              | On Off On Off              |
| Baud rate               | 9600bps / 25ms             |
| Signal output format    | 3 bytes (`0xAA value XOR`) |
| Serial Or Parallel Port | Serial                     |

### (Re-)Training DG600F

The training procedure is detailed in section 7 of the [technical manual](./docs/DG600F.pdf). There is also a [video](http://youtu.be/Dyun1xjKqc4) available.

A short summary:

1.  Hold the A (left) button for ~2 second to enter coin parameters. The display should show "CP"
2.  (Optional) Hold B for ~2 second to clear all existing parameters. The display should flash "CC". Press A to return to "CP"
3.  With the A button cycle to the coin you want to train (CP)
4.  Press B. The display will show "00" (or the value you programmed for that coin)
5.  With B select the value for this coin (range `0`-`A0`). This code assumes the value is `Math.ceil(value_in_cents/2)`. So a €2 coin is `A0`, a €0,50 coin is `25` and a €0,05 coin is `3`.
6.  Make sure the acceptor is in the same position as you intend to use it. The acceptor should nearly perpendicular to the ground.
7.  Enter (different!) samples of the coin you want to detect until the machine beeps and displays "F". It will take max 20 coins.
8.  Press A to return to CP and redo steps 3-8 until all coins are trained
