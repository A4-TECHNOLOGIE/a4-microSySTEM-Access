let lastTestKey = ""

a4MicroSystemAccess.initializeKeypad()
a4MicroSystemAccess.lockDoor()

input.onButtonPressed(Button.A, function () {
    a4MicroSystemAccess.unlockDoor()
    basic.showIcon(IconNames.Yes)
})

input.onButtonPressed(Button.B, function () {
    a4MicroSystemAccess.lockDoor()
    basic.showIcon(IconNames.No)
})

input.onButtonPressed(Button.AB, function () {
    if (a4MicroSystemAccess.doorIs(a4MicroSystemAccess.DoorState.Closed)) {
        basic.showString("C")
    } else {
        basic.showString("O")
    }
})

a4MicroSystemAccess.onKeyPressed(function (key) {
    if (key == "#") {
        if (a4MicroSystemAccess.enteredCodeIs("1234")) {
            basic.showIcon(IconNames.Yes)
        } else {
            basic.showIcon(IconNames.No)
        }
        a4MicroSystemAccess.clearEnteredCode()
    } else {
        basic.showString(a4MicroSystemAccess.getEnteredCode())
    }
})

input.onGesture(Gesture.Shake, function () {
    a4MicroSystemAccess.deleteLastCharacter()
    basic.showString(a4MicroSystemAccess.getEnteredCode())
})

basic.forever(function () {
    if (a4MicroSystemAccess.keyAvailable()) {
        lastTestKey = a4MicroSystemAccess.readKey()
    }
    basic.pause(20)
})

// Compile-only coverage for the blocking function.
if (false) {
    lastTestKey = a4MicroSystemAccess.waitForKey()
}
