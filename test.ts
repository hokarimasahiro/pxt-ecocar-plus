let top = 0
let next = 0
ecocar.setBrightness(8)
let color = [ecocar.colors(RGBColors.Red), ecocar.colors(RGBColors.Orange), ecocar.colors(RGBColors.Yellow), ecocar.colors(RGBColors.Green), ecocar.colors(RGBColors.Blue), ecocar.colors(RGBColors.Indigo), ecocar.colors(RGBColors.Violet), ecocar.colors(RGBColors.Purple)]
basic.forever(function () {
    ecocar.setBrightness(8)
    next = top
    for (let index = 0; index <= 7; index++) {
        ecocar.showPixelColor(index, color[next])
        next += 1
        if (next > 7) {
            next = 0
        }
    }
    top += 1
    if (top > 7) {
        top = 0
    }
    basic.pause(1000)
})
