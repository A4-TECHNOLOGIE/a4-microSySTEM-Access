# Test procedure

This document covers compilation and physical testing of every public block in the extension.

## Equipment

- one microSySTEM-Access model;
- one BBC micro:bit V1 or V2;
- one USB cable;
- the magnetic lock on C0, door microswitch on P0 and keypad UART on P14/P15.

## Compile test

Import the repository into MakeCode and download the included `test.ts` program. The program must compile for both micro:bit V1 and V2 without errors. It must also start in the simulator without raising an exception.

## Hardware test

1. Power the model. The magnetic lock must energize and keep the door locked.
2. Press button A. The lock must release and the micro:bit must display a tick.
3. Press button B. The lock must energize and the micro:bit must display a cross.
4. Press A+B with the door closed. The display must show `C`.
5. Press A+B with the door open. The display must show `O`.
6. Touch each keypad key from `0` to `9`, then `*` and `#`. Each press must be detected once and must not stop the program.
7. Enter `1234` without pressing `#`. The display must show `4` when the configured length is reached.
8. Press `#`. The display must show a tick.
9. Enter any other sequence followed by `#`. The display must show a cross.
10. Enter digits and press `*`. The stored code must be cleared.
11. Enter digits and shake the micro:bit. The final digit must be deleted.

## Pass criteria

- both choices of the door lock block operate C0 in the correct direction;
- the sensor reliably distinguishes the open and closed door states;
- all 12 keypad characters are decoded correctly at 9600 baud;
- the keypad event supplies the correct character;
- code entry, length detection, comparison, clearing and last-digit deletion behave as documented;
- no simulator exception occurs when the hardware is absent.

The production model tested by A4 Technologie returns a high level on P0 when the door is closed.
