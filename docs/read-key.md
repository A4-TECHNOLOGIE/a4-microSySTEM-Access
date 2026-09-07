# Read keypad key

Returns the oldest unread keypad character.

```sig
a4MicroSystemAccess.readKey()
```

Possible results are `0` to `9`, `*`, `#` or an empty string when no unread key is available. Reading a key removes it from the input queue.
