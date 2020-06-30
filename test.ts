let top = 0
let next = 0
porocar.setBrightness(8)
let color = [porocar.colors(RGBColors.Red), 
             porocar.colors(RGBColors.Orange), 
             porocar.colors(RGBColors.Yellow), 
             porocar.colors(RGBColors.Green), 
             porocar.colors(RGBColors.Blue), 
             porocar.colors(RGBColors.Indigo), 
             porocar.colors(RGBColors.Violet), 
             porocar.colors(RGBColors.Purple)]
basic.forever(function () {
    porocar.setBrightness(8)
    next = top
    for (let index = 0; index <= 7; index++) {
        porocar.showPixelColor(index, color[next])
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
