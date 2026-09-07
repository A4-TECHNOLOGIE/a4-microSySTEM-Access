# Keypad key available

Reports whether at least one keypad key is waiting to be read.

```sig
a4MicroSystemAccess.keyAvailable()
```

Use this Boolean block before `read keypad key` when the rest of the program must continue running while it waits for input.
