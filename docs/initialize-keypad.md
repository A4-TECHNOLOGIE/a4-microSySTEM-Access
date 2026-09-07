# Initialize keypad

Initializes the 12-key capacitive keypad on P14/P15 at 9600 baud.

```sig
a4MicroSystemAccess.initializeKeypad()
```

The other keypad and access-code blocks initialize it automatically. This block is useful when the keypad must be ready at program startup.

Initializing the keypad redirects the micro:bit serial port. Do not use another UART accessory at the same time.
