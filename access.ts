/**
 * MakeCode extension for the A4 Technologie microSySTEM-Access model.
 */
//% weight=100 color=#00838F icon="\uf084" block="A4 microSySTEM Access"
//% groups='["Magnetic lock", "Door sensor", "Keypad", "Access code"]'
namespace a4MicroSystemAccess {
    const dfrAddress = 0x33
    const c0ModeRegister = 0x2C
    const c0WriteRegister = 0x39
    const digitalOutputMode = 4

    const doorSensorPin = DigitalPin.P0
    const keypadTxPin = SerialPin.P14
    const keypadRxPin = SerialPin.P15
    const maximumQueuedKeys = 16
    const maximumCodeLength = 16

    let keypadInitialized = false
    let keypadEventSource = 0
    let keyQueue: string[] = []
    let enteredCode = ""
    const doorClosedLevel = 0

    /**
     * Door states reported by the microswitch.
     */
    export enum DoorState {
        //% block="closed"
        Closed,
        //% block="open"
        Open
    }

    function writeDfrRegister(registerAddress: number, value: number): void {
        const buffer = pins.createBuffer(2)
        buffer[0] = registerAddress
        buffer[1] = value
        pins.i2cWriteBuffer(dfrAddress, buffer)
    }

    function writeLockOutput(value: number): void {
        writeDfrRegister(c0ModeRegister, digitalOutputMode)
        writeDfrRegister(c0WriteRegister, value)
    }

    function decodeKey(data: number): string {
        switch (data) {
            case 0xE1: return "1"
            case 0xE2: return "2"
            case 0xE3: return "3"
            case 0xE4: return "4"
            case 0xE5: return "5"
            case 0xE6: return "6"
            case 0xE7: return "7"
            case 0xE8: return "8"
            case 0xE9: return "9"
            case 0xEA: return "*"
            case 0xEB: return "0"
            case 0xEC: return "#"
            default: return ""
        }
    }

    function updateEnteredCode(key: string): void {
        if (key == "*") {
            enteredCode = ""
        } else if (key != "#" && enteredCode.length < maximumCodeLength) {
            enteredCode += key
        }
    }

    function storeKey(key: string, eventValue: number): void {
        if (keyQueue.length >= maximumQueuedKeys) keyQueue.shift()
        keyQueue.push(key)
        updateEnteredCode(key)
        control.raiseEvent(keypadEventSource, eventValue)
    }

    function startKeypadReader(): void {
        control.inBackground(function () {
            while (true) {
                const data = serial.readBuffer(1)

                if (data && data.length > 0) {
                    const key = decodeKey(data[0])
                    if (key != "") storeKey(key, data[0])
                }

                basic.pause(5)
            }
        })
    }

    /**
     * Locks the door by energizing the magnetic lock connected to C0.
     */
    //% blockId=a4_access_lock_door
    //% help=github:a4-microsystem-access/docs/lock-door
    //% block="lock door"
    //% group="Magnetic lock"
    //% weight=100
    export function lockDoor(): void {
        writeLockOutput(1)
    }

    /**
     * Unlocks the door by switching off the magnetic lock connected to C0.
     */
    //% blockId=a4_access_unlock_door
    //% help=github:a4-microsystem-access/docs/unlock-door
    //% block="unlock door"
    //% group="Magnetic lock"
    //% weight=90
    export function unlockDoor(): void {
        writeLockOutput(0)
    }

    /**
     * Returns true when the door is in the selected state.
     * @param state door state to test
     */
    //% blockId=a4_access_door_is
    //% help=github:a4-microsystem-access/docs/door-is
    //% block="door is %state"
    //% group="Door sensor"
    //% weight=100
    export function doorIs(state: DoorState): boolean {
        const doorIsClosed = pins.digitalReadPin(doorSensorPin) == doorClosedLevel
        return state == DoorState.Closed ? doorIsClosed : !doorIsClosed
    }

    /**
     * Initializes the capacitive keypad connected to P14 and P15.
     * The keypad uses the micro:bit serial port at 9600 baud.
     */
    //% blockId=a4_access_initialize_keypad
    //% help=github:a4-microsystem-access/docs/initialize-keypad
    //% block="initialize keypad"
    //% group="Keypad"
    //% weight=100
    export function initializeKeypad(): void {
        if (keypadInitialized) return

        keypadInitialized = true
        keypadEventSource = control.allocateEventSource()
        keyQueue = []
        enteredCode = ""

        serial.redirect(keypadTxPin, keypadRxPin, BaudRate.BaudRate9600)
        serial.setRxBufferSize(64)
        basic.pause(100)
        startKeypadReader()
    }

    /**
     * Waits for the next keypad key and returns it.
     */
    //% blockId=a4_access_wait_for_key
    //% help=github:a4-microsystem-access/docs/wait-for-key
    //% block="wait for keypad key"
    //% group="Keypad"
    //% weight=90
    export function waitForKey(): string {
        initializeKeypad()
        while (keyQueue.length == 0) basic.pause(20)
        return keyQueue.shift()
    }

    /**
     * Runs code whenever a valid keypad key is pressed.
     * @param handler code to run; key is the pressed character
     */
    //% blockId=a4_access_on_key_pressed
    //% help=github:a4-microsystem-access/docs/on-key-pressed
    //% block="on keypad key pressed"
    //% draggableParameters=reporter
    //% group="Keypad"
    //% weight=60
    export function onKeyPressed(handler: (key: string) => void): void {
        initializeKeypad()
        control.onEvent(keypadEventSource, EventBusValue.MICROBIT_EVT_ANY, function () {
            handler(decodeKey(control.eventValue()))
        })
    }

    /**
     * Returns the digits entered since the code was last cleared.
     * The star key clears the code and the hash key is not appended.
     */
    //% blockId=a4_access_entered_code
    //% help=github:a4-microsystem-access/docs/entered-code
    //% block="entered code"
    //% group="Access code"
    //% weight=100
    export function getEnteredCode(): string {
        initializeKeypad()
        return enteredCode
    }

    /**
     * Clears all digits from the entered access code.
     */
    //% blockId=a4_access_clear_entered_code
    //% help=github:a4-microsystem-access/docs/clear-entered-code
    //% block="clear entered code"
    //% group="Access code"
    //% weight=90
    export function clearEnteredCode(): void {
        enteredCode = ""
    }

    /**
     * Returns true when the entered access code matches the given code.
     * @param code access code to compare, eg: "1234"
     */
    //% blockId=a4_access_entered_code_is
    //% help=github:a4-microsystem-access/docs/entered-code-is
    //% block="entered code is %code"
    //% code.defl="1234"
    //% group="Access code"
    //% weight=80
    export function enteredCodeIs(code: string): boolean {
        initializeKeypad()
        return enteredCode == code
    }

    /**
     * Deletes the last digit from the entered access code.
     */
    //% blockId=a4_access_delete_last_character
    //% help=github:a4-microsystem-access/docs/delete-last-character
    //% block="delete last code digit"
    //% group="Access code"
    //% weight=70
    export function deleteLastCharacter(): void {
        if (enteredCode.length > 0) {
            enteredCode = enteredCode.substr(0, enteredCode.length - 1)
        }
    }

}
