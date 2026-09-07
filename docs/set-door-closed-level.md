# Set closed-door sensor level

Changes the electrical level interpreted as a closed door.

```sig
a4MicroSystemAccess.setDoorClosedLevel(a4MicroSystemAccess.DoorSensorLevel.High)
```

The default is `high`, which matches the standard microSySTEM-Access model. This advanced block is only needed if a hardware revision uses inverted microswitch logic.
