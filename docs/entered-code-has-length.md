# Entered code has length

Tests whether the entered access code contains the selected number of digits.

```sig
a4MicroSystemAccess.enteredCodeHasLength(4)
```

The selectable length is limited to 1–16 digits. Use this block to detect a complete but incorrect entry, then clear it with `clearEnteredCode()`.
