/**
 * Well known colors for a NeoPixel strip
 */
enum RGBColors {
    //% block=red
    Red = 0xFF0000,
    //% block=orange
    Orange = 0xFFA500,
    //% block=yellow
    Yellow = 0xFFFF00,
    //% block=green
    Green = 0x00FF00,
    //% block=blue
    Blue = 0x0000FF,
    //% block=indigo
    Indigo = 0x4b0082,
    //% block=violet
    Violet = 0x8a2be2,
    //% block=purple
    Purple = 0xFF00FF,
    //% block=white
    White = 0xFFFFFF,
    //% block=black
    Black = 0x000000
}
/**
 * Functions to operate NeoPixel strips.
 */
//% weight=5 color=#c0c000 icon="\uf1b9"
namespace ecocar {
    const neocount = 25;
    let neobuf = pins.createBuffer(neocount * 3 + 1);
    let Brightness = 0;
    let I2Caddress = 0x10;

    /**
     * Shows all LEDs to a given color (range 0-255 for r, g, b). 
     * @param rgb RGB color of the LED
     */
    //% blockId="set_strip_color" block="show color %rgb=neopixel_colors" 
    //% weight=85 blockGap=8
    export function showColor(rgb: number) {
        rgb = rgb >> 0;
        setAllRGB(rgb);
        show();
    }

    /**
     * Set LED to a given color (range 0-255 for r, g, b). 
     * You need to call ``show`` to make the changes visible.
     * @param pixeloffset position of the NeoPixel in the strip
     * @param rgb RGB color of the LED
     */
    //% blockId="set_pixel_color" block="set pixel color at %pixeloffset|to %rgb=neopixel_colors" 
    //% blockGap=8
    //% weight=80
    export function setPixelColor(pixeloffset: number, rgb: number): void {
        if (pixeloffset >= neocount) return;

        let red = unpackR(rgb);
        let green = unpackG(rgb);
        let blue = unpackB(rgb);
        let buf = pins.createBuffer(4);

        let off = (pixeloffset >> 0) * 3 + 1;

        if (Brightness == 0) {
            neobuf[off + 0] = green;
            neobuf[off + 1] = red;
            neobuf[off + 2] = blue;
        } else {
            neobuf[off + 0] = (green * Brightness) >> 8;
            neobuf[off + 1] = (red * Brightness) >> 8;
            neobuf[off + 2] = (blue * Brightness) >> 8;
        }

        buf[0] = (pixeloffset >> 0) * 3 | 0x80;
        buf[1] = neobuf[off + 0];
        buf[2] = neobuf[off + 1];
        buf[3] = neobuf[off + 2];

        pins.i2cWriteBuffer(I2Caddress, buf);
        pins.i2cWriteNumber(I2Caddress, 0xff, NumberFormat.Int8BE);
    }

    /**
     * Send all the changes to the strip.
     */
    //% blockId="show" block="show" blockGap=8
    //% weight=79
    export function show() {
        neobuf[0] = 0x80;
        pins.i2cWriteBuffer(I2Caddress, neobuf)
        pins.i2cWriteNumber(I2Caddress, 0xff, NumberFormat.Int8BE);
    }

    /**
     * Turn off all LEDs.
     * You need to call ``show`` to make the changes visible.
     */
    //% blockId="clear" block="clear"
    //% weight=76
    export function clear(): void {
        for (let i = 1; i <= neocount * 3; i++) neobuf[i] = 0x00;
        show();
    }

    /**
     * Set the brightness of the strip. This flag only applies to future operation.
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% blockId="set_brightness" block="set brightness %brightness" blockGap=8
    //% weight=59
    export function setBrightness(brightness: number): void {
        Brightness = brightness;
    }

    function setAllRGB(rgb: number) {
        let red = unpackR(rgb);
        let green = unpackG(rgb);
        let blue = unpackB(rgb);
        for (let i = 1; i <= neocount * 3; i += 3) {
            if (Brightness == 0) {
                neobuf[i + 0] = green;
                neobuf[i + 1] = red;
                neobuf[i + 2] = blue;
            } else {
                neobuf[i + 0] = (green * Brightness) >> 8;
                neobuf[i + 1] = (red * Brightness) >> 8;
                neobuf[i + 2] = (blue * Brightness) >> 8;
            }
        }
    }
    /**
     * Converts red, green, blue channels into a RGB color
     * @param red value of the red channel between 0 and 255. eg: 255
     * @param green value of the green channel between 0 and 255. eg: 255
     * @param blue value of the blue channel between 0 and 255. eg: 255
     */
    //% weight=1
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
    //% weight=2 blockGap=8
    //% blockId="neopixel_colors" block="%color"
    export function colors(color: RGBColors): number {
        return color;
    }

    function packRGB(a: number, b: number, c: number): number {
        return ((a & 0xFF) << 16) | ((b & 0xFF) << 8) | (c & 0xFF);
    }
    function unpackR(rgb: number): number {
        let r = (rgb >> 16) & 0xFF;
        return r;
    }
    function unpackG(rgb: number): number {
        let g = (rgb >> 8) & 0xFF;
        return g;
    }
    function unpackB(rgb: number): number {
        let b = (rgb) & 0xFF;
        return b;
    }
}