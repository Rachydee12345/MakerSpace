basic.forever(function () {
    if (makerspace.buttonPressed()) {
        makerspace.setLed(MakerspaceSwitch.On)
    } else {
        makerspace.setLed(MakerspaceSwitch.Off)
    }
    basic.pause(20)
})
