# Door is

Tests whether the door is open or closed using the microswitch connected to P0.

```sig
a4MicroSystemAccess.doorIs(a4MicroSystemAccess.DoorState.Closed)
```

The block returns `true` when the measured state matches the state selected in the block. On the microSySTEM-Access model, the microswitch produces a low level on P0 when the door is closed.
