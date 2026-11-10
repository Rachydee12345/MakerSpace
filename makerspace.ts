enum MakerspaceSwitch {
    //% block="on"
    On = 1,
    //% block="off"
    Off = 0
}

enum MakerspaceColour {
    //% block="red"
    Red = 0xff0000,
    //% block="amber"
    Amber = 0xff8000,
    //% block="green"
    Green = 0x00ff00,
    //% block="blue"
    Blue = 0x0000ff,
    //% block="purple"
    Purple = 0x8000ff,
    //% block="white"
    White = 0xffffff,
    //% block="off"
    Off = 0
}

enum MakerspaceTraffic {
    //% block="red"
    Red,
    //% block="amber"
    Amber,
    //% block="green"
    Green,
    //% block="off"
    Off
}

enum MakerspaceRow {
    //% block="top"
    Top,
    //% block="bottom"
    Bottom
}

enum MakerspaceDisplay {
    //% block="CLK / DIO"
    ClockData,
    //% block="IIC"
    Iic
}

enum MakerspaceRemote {
    //% block="A"
    A = 0x45,
    //% block="B"
    B = 0x46,
    //% block="C"
    C = 0x47,
    //% block="D"
    D = 0x44,
    //% block="up"
    Up = 0x40,
    //% block="down"
    Down = 0x19,
    //% block="left"
    Left = 0x07,
    //% block="right"
    Right = 0x09,
    //% block="centre"
    Centre = 0x15,
    //% block="+"
    Plus = 0x43,
    //% block="−"
    Minus = 0x0d,
    //% block="0"
    Number0 = 0x16,
    //% block="1"
    Number1 = 0x0c,
    //% block="2"
    Number2 = 0x18,
    //% block="3"
    Number3 = 0x5e,
    //% block="4"
    Number4 = 0x08,
    //% block="5"
    Number5 = 0x1c,
    //% block="6"
    Number6 = 0x5a,
    //% block="7"
    Number7 = 0x42,
    //% block="8"
    Number8 = 0x52,
    //% block="9"
    Number9 = 0x4a
}

/** Blocks for the Emakefun Sensor:bit sockets in the Makerspace wiring guide. */
//% color=#125C69 icon="\uf0ad" block="Makerspace Kit" weight=75
//% groups='["Start here", "Sensors", "Lights and movement", "Displays", "Touch piano", "Remote control"]'
namespace makerspace {
    let ring: Buffer
    let lastDistance = -1
    let lastPing = -60
    let screenReady = false
    let remoteReady = false
    const remoteEventSource = 5841

    /** Check the external button plugged into P0. */
    //% blockId=wellington_kit_button_pressed block="kit button is pressed" group="Start here" weight=100
    export function buttonPressed(): boolean {
        pins.setPull(DigitalPin.P0, PinPullMode.PullUp)
        return pins.digitalReadPin(DigitalPin.P0) === 0
    }

    /** Switch the single LED module plugged into P12. */
    //% blockId=wellington_kit_led block="turn kit LED %state" group="Start here" weight=99
    export function setLed(state: MakerspaceSwitch): void {
        pins.digitalWritePin(DigitalPin.P12, state)
    }

    /** Read the slider on P1 as a percentage. */
    //% blockId=wellington_kit_slider block="slider position (percent)" group="Start here" weight=98
    export function sliderPosition(): number {
        return Math.round(pins.analogReadPin(AnalogPin.P1) * 100 / 1023)
    }

    /** Read the photosensitive module on P2. Higher and lower readings can be compared in class. */
    //% blockId=wellington_kit_light block="light sensor reading" group="Sensors" weight=95
    export function lightReading(): number {
        return pins.analogReadPin(AnalogPin.P2)
    }

    /** Read the analogue output of the flame sensor on P2. Use this as an infrared experiment. */
    //% blockId=wellington_kit_infrared_light block="flame sensor reading" group="Sensors" weight=93
    export function flameReading(): number {
        return pins.analogReadPin(AnalogPin.P2)
    }

    /** Read the RUS-04 with IO on P13. Returns -1 when there is no echo. */
    //% blockId=wellington_kit_distance block="distance in cm" group="Sensors" weight=94
    export function distanceCm(): number {
        const now = input.runningTime()
        if (now - lastPing < 60) {
            return lastDistance
        }
        lastPing = now
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.digitalWritePin(DigitalPin.P13, 0)
        control.waitMicros(2)
        pins.digitalWritePin(DigitalPin.P13, 1)
        control.waitMicros(50)
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalReadPin(DigitalPin.P13)
        const echo = pins.pulseIn(DigitalPin.P13, PulseValue.High, 25000)
        lastDistance = echo > 0 ? Math.round(echo / 58.8) : -1
        return lastDistance
    }

    /** Set the colour of the 12-pixel ring plugged into P15. */
    //% blockId=wellington_kit_ring block="set light ring to %colour" group="Lights and movement" weight=85
    export function setRing(colour: MakerspaceColour): void {
        if (!ring) {
            ring = pins.createBuffer(36)
        }
        for (let i = 0; i < 36; i += 3) {
            ring[i] = (colour >> 11) & 31
            ring[i + 1] = (colour >> 19) & 31
            ring[i + 2] = (colour >> 3) & 31
        }
        light.sendWS2812Buffer(ring, DigitalPin.P15)
    }

    /** Choose one lamp on the traffic light or turn all three off. */
    //% blockId=wellington_kit_traffic block="set traffic light to %colour" group="Lights and movement" weight=84
    export function setTrafficLight(colour: MakerspaceTraffic): void {
        pins.digitalWritePin(DigitalPin.P8, colour === MakerspaceTraffic.Red ? 1 : 0)
        pins.digitalWritePin(DigitalPin.P1, colour === MakerspaceTraffic.Amber ? 1 : 0)
        pins.digitalWritePin(DigitalPin.P0, colour === MakerspaceTraffic.Green ? 1 : 0)
    }

    /** Choose a colour on the square RGB module in the lower-right five-pin socket. */
    //% blockId=wellington_kit_rgb block="set RGB light to %colour" group="Lights and movement" weight=83
    export function setRgbLight(colour: MakerspaceColour): void {
        pins.analogWritePin(AnalogPin.P2, Math.idiv(((colour >> 16) & 255) * 1023, 255))
        pins.analogWritePin(AnalogPin.P15, Math.idiv(((colour >> 8) & 255) * 1023, 255))
        pins.analogWritePin(AnalogPin.P13, Math.idiv((colour & 255) * 1023, 255))
    }

    /** Move a correctly powered 180-degree servo with its signal connected to P8. */
    //% blockId=wellington_kit_servo block="move servo to %degrees degrees" group="Lights and movement" weight=82
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    export function moveServo(degrees: number): void {
        pins.servoWritePin(AnalogPin.P8, Math.clamp(0, 180, degrees))
    }

    /** Switch an active buzzer plugged into P8. A passive buzzer uses a tone instead. */
    //% blockId=wellington_kit_buzzer block="turn active buzzer %state" group="Lights and movement" weight=81
    export function setBuzzer(state: MakerspaceSwitch): void {
        pins.digitalWritePin(DigitalPin.P8, state)
    }

    function startRemote(): void {
        if (remoteReady) {
            return
        }
        remoteReady = true
        let mark = 0
        let bits = -1
        let packet = 0
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        pins.onPulsed(DigitalPin.P14, PulseValue.Low, function () {
            mark = pins.pulseDuration()
        })
        pins.onPulsed(DigitalPin.P14, PulseValue.High, function () {
            const space = pins.pulseDuration()
            if (mark >= 7500 && mark <= 10500 && space >= 3500 && space <= 5500) {
                bits = 0
                packet = 0
            } else if (bits >= 0 && mark >= 300 && mark <= 850 && space >= 300 && space <= 2200) {
                if (space > 1050) {
                    packet |= 1 << bits
                }
                bits++
                if (bits === 32) {
                    const command = (packet >>> 16) & 255
                    const inverse = (packet >>> 24) & 255
                    bits = -1
                    if ((command ^ inverse) === 255) {
                        control.raiseEvent(remoteEventSource, command)
                    }
                }
            } else {
                bits = -1
            }
        })
    }

    /** Run your blocks once when the matching NEC remote key is pressed. Plug the IR receiver into P14. */
    //% blockId=wellington_kit_remote block="when remote button %key is pressed" group="Remote control" weight=70
    export function onRemoteButton(key: MakerspaceRemote, handler: () => void): void {
        control.onEvent(remoteEventSource, key, handler)
        startRemote()
    }

    /** Read the Touch Piano V2. Returns 1 to 8, or 0 when no key is touched. */
    //% blockId=wellington_kit_piano block="piano key number" group="Touch piano" weight=75
    export function pianoKey(): number {
        // V2 wake-up sequence and active-low key bits, based on Emakefun's Sensor:bit implementation.
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P14, 1)
        control.waitMicros(93)
        pins.digitalWritePin(DigitalPin.P14, 0)
        control.waitMicros(10)
        let firstKey = 0
        for (let i = 1; i <= 8; i++) {
            pins.digitalWritePin(DigitalPin.P13, 1)
            pins.digitalWritePin(DigitalPin.P13, 0)
            if (pins.digitalReadPin(DigitalPin.P14) === 0 && firstKey === 0) {
                firstKey = i
            }
        }
        control.waitMicros(2000)
        return firstKey
    }

    function lcdNibble(value: number, data: boolean): void {
        const bits = (value & 0xf0) | (data ? 9 : 8)
        pins.i2cWriteNumber(0x27, bits, NumberFormat.UInt8LE)
        pins.i2cWriteNumber(0x27, bits | 4, NumberFormat.UInt8LE)
        pins.i2cWriteNumber(0x27, bits, NumberFormat.UInt8LE)
    }

    function lcdByte(value: number, data: boolean): void {
        lcdNibble(value, data)
        lcdNibble(value << 4, data)
        control.waitMicros(50)
    }

    function startScreen(): void {
        if (screenReady) {
            return
        }
        // HD44780 4-bit start-up. Wait before sending the first command.
        control.waitMicros(50000)
        lcdNibble(0x30, false)
        control.waitMicros(5000)
        lcdNibble(0x30, false)
        control.waitMicros(150)
        lcdNibble(0x30, false)
        control.waitMicros(150)
        lcdNibble(0x20, false)
        lcdByte(0x28, false)
        lcdByte(0x0c, false)
        lcdByte(0x06, false)
        lcdByte(0x01, false)
        control.waitMicros(2000)
        screenReady = true
    }

    /** Show up to 16 characters on one row of a compatible LCD1602 at address 0x27. */
    //% blockId=wellington_kit_lcd block="show %message on %row row of LCD screen" group="Displays" weight=91
    //% message.defl="Hello!"
    export function showMessage(message: string, row: MakerspaceRow): void {
        startScreen()
        lcdByte(row === MakerspaceRow.Top ? 0x80 : 0xc0, false)
        for (let i = 0; i < 16; i++) {
            lcdByte(i < message.length ? message.charCodeAt(i) : 32, true)
        }
    }

    function tmWriteByte(value: number): void {
        for (let bit = 0; bit < 8; bit++) {
            pins.digitalWritePin(DigitalPin.P13, 0)
            pins.digitalWritePin(DigitalPin.P14, (value >> bit) & 1)
            control.waitMicros(4)
            pins.digitalWritePin(DigitalPin.P13, 1)
            control.waitMicros(4)
        }
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalReadPin(DigitalPin.P14)
        control.waitMicros(4)
        pins.digitalWritePin(DigitalPin.P13, 1)
        control.waitMicros(4)
        pins.digitalWritePin(DigitalPin.P13, 0)
    }

    function tmSend(bytes: number[]): void {
        pins.digitalWritePin(DigitalPin.P14, 1)
        pins.digitalWritePin(DigitalPin.P13, 1)
        control.waitMicros(4)
        pins.digitalWritePin(DigitalPin.P14, 0)
        for (const value of bytes) {
            tmWriteByte(value)
        }
        pins.digitalWritePin(DigitalPin.P14, 0)
        pins.digitalWritePin(DigitalPin.P13, 1)
        control.waitMicros(4)
        pins.digitalWritePin(DigitalPin.P14, 1)
    }

    /** Display a whole number from 0 to 9999. Match the block option to the module's printed label. */
    //% blockId=wellington_kit_digits block="show %value on 4-digit display %model" group="Displays" weight=90
    //% value.min=0 value.max=9999 value.defl=1234
    export function showDigits(value: number, model: MakerspaceDisplay): void {
        const segments = [0x3f, 0x06, 0x5b, 0x4f, 0x66, 0x6d, 0x7d, 0x07, 0x7f, 0x6f]
        const digits = [0, 0, 0, 0]
        let remaining = Math.floor(Math.clamp(0, 9999, value))
        for (let i = 3; i >= 0; i--) {
            if (remaining > 0 || i === 3) {
                digits[i] = segments[remaining % 10]
            }
            remaining = Math.idiv(remaining, 10)
        }
        if (model === MakerspaceDisplay.Iic) {
            pins.i2cWriteNumber(0x24, 0x31, NumberFormat.UInt8LE)
            for (let i = 0; i < 4; i++) {
                pins.i2cWriteNumber(0x34 + i, digits[i], NumberFormat.UInt8LE)
            }
        } else {
            tmSend([0x40])
            tmSend([0xc0, digits[0], digits[1], digits[2], digits[3]])
            tmSend([0x8b])
        }
    }
}
