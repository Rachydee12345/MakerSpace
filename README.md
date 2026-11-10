# Wellington Makerspace Kit

15 MakeCode blocks for the Emakefun Sensor:bit PH2.0 board. Pupils choose blocks by module name. The socket names below are for setting up the hardware.

## Start with the button and LED

1. Unzip the download. At [MakeCode for micro:bit](https://makecode.microbit.org/), choose **Import → Import File** and select **Wellington_Makerspace_Starter.hex**.
2. Open **Blocks** and find **Makerspace Kit**. The starter already checks a coloured external button and turns the single LED on while the button is held.
3. With power disconnected, plug a coloured **Button Module** into the top-right three-pin socket, **P0 3V3 GND**. Plug the single **LED** module into the bottom-right three-pin socket, **P12 VCC GND**. Use the three-wire PH2.0 leads and match the signal, power and ground labels.
4. Have the teacher check that the board's **VCC jumper is set to 3V3**. Download the programme to the micro:bit. Use the expansion board's documented power input for standalone use. The external button and LED need the physical board.
5. Try changing the programme so the LED turns off when you press the button.

**Pupil challenge**  
Swap to the slider on P1. In a forever loop, turn the LED on when the slider position is greater than 50. Change the threshold and predict what will happen.

## Find the sockets

Hold the Sensor:bit with its long micro:bit slot at the top and its USB and round power sockets at the bottom. Match the full printed label and the number of contacts. Some signals appear on more than one socket.

| Module | Socket | Block |
| --- | --- | --- |
| Coloured Button Module | **P0 3V3 GND**, top right | kit button is pressed |
| Single LED Module | **P12 VCC GND**, bottom-right three-pin | turn kit LED on or off |
| Yellow slider | **P1 3V3 GND**, second on the right | slider position (percent) |
| Photosensitive Sensor | **P2 3V3 GND**, third on the right | light sensor reading |
| Flame sensor with analogue signal marked **A** | Use the four-pin **P8 P2 3V3 GND** socket with the matching lead. Verify A → P2 and D → P8 on the module marked G V A D. Compare readings with a remote control or another suitable infrared source. | flame sensor reading |
| IR Receiver Module and Emakefun remote | **P14 VCC GND**, second on the left. Use 3V3 VCC and aim the remote at the receiver. | when remote button is pressed |
| Touch Piano V2, marked **CLK DIO V G** | **P13 P14 VCC GND**, top middle. CLK → P13, DIO → P14. | piano key number |
| Four-digit display with **CLK / DIO** connector | Same top-middle socket. CLK → P13, DIO → P14. Select **CLK / DIO** in the block. | show number on 4-digit display |
| Four-digit display with **IIC** connector | Either middle **IIC** socket. Select **IIC** in the block. | show number on 4-digit display |
| LCD1602 with a compatible I²C backpack at **0x27** | Either middle **IIC** socket. SDA → P20, SCL → P19. | show message on top or bottom row of LCD screen |
| RUS-04 distance sensor | Teacher setup. **IO → P13**, RGB optional on P14, with suitable power and signal levels. The top-middle socket carries P13 and P14. | distance in cm. A reading of −1 means no echo. |
| 12-pixel WS2812 light ring | Teacher setup. **Signal → P15**, third three-pin socket on the left, or equivalent wiring with a compatible power supply and signal level. | set light ring to colour |
| Traffic Light Module | Upper-right five-pin socket **P8 P1 P0 3V3 GND**. Red → P8, amber → P1, green → P0. | set traffic light to red, amber, green or off |
| Square RGB Module | Lower-right five-pin socket **P15 P2 P13 VCC GND**. Green → P15, red → P2, blue → P13. | set RGB light to colour |
| 180° servo | Teacher setup. Signal → **P8**. Use the correct connector or adaptor, a supply rated for the servo and common ground. | move servo to degrees |
| Active buzzer | **P8 VCC GND**, three-pin on the right, with compatible VCC. Check the buzzer type first. | turn active buzzer on or off |

### Teacher setup

- Start with 3.3 V for the button, LED, slider and light sensor. Power off before moving cables or the voltage jumper. Check each module's signal, power and ground labels, especially on the four- and five-wire leads.
- The VCC jumper changes the shared VCC rail across sockets. Keep micro:bit signal lines at safe 3.3 V logic levels. The RUS-04 is specified for 4.5–5.5 V supply. Verify its signal compatibility and use suitable level shifting where needed. Verify the supply and I²C pull-up levels for the display modules, and check the ring's supply and data-level requirements. Use a suitable separate supply and common ground where required, especially for the servo. Bench-test these setups before putting them out for pupils.
- If two modules in the table use the same P number anywhere in their socket label, use them in separate activities. For example, the traffic light shares pins with the button and slider. The touch piano, CLK/DIO display and RUS-04 share the top-middle socket.
- The touch piano returns 0 for no key and 1–8 for a key. Combine it with **show number** first, then map keys to notes in a separate activity. The IR block targets Emakefun's A–D NEC remote key map and fires on full key messages.
- The 4-digit display controller label is on the back or beside its connector. The guide lists both Emakefun variants because the photo does not show that label. The NTC temperature sensor, fan and separate 18650 board are outside this version. The software was checked with the MakeCode toolchain. The physical modules still need a classroom bench test.

## Reuse and publish the extension

The starter project contains the custom blocks and can be duplicated for pupil projects. Once this repository is public, open a micro:bit project in [MakeCode](https://makecode.microbit.org/), choose **Extensions**, and paste the exact repository URL below. Open **Makerspace Kit** in the toolbox after it loads.

```text
https://github.com/Rachydee12345/MakerSpace
```

## References

- [Emakefun Sensor:bit board and module documentation](https://emakefun-docs.readthedocs.io/zh-cn/latest/micro_bit/sensorbit/)
- [Emakefun Sensor:bit source and piano timing reference](https://github.com/emakefun/pxt-sensorbit/tree/23a5aced2bc5ca775e395bada1c14cf09d78c573)
- [Emakefun RUS-04 specifications](https://emakefun-docs.readthedocs.io/zh-cn/latest/sensors/sensors/rus_04/)
- [Emakefun remote key values](https://github.com/emakefun/pxt-irRemote/tree/449e664288e3be712cc8193a40e10b7240d90fe4)
- [micro:bit power supply notes](https://tech.microbit.org/hardware/power-supply/)
