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
 * Functions to operate ecocar-plus.
 */
//% weight=5 color=#c0c000 icon="\uf1b9"
namespace ecocar {
    const neocount = 25;
    let neobuf = pins.createBuffer(neocount * 3 + 1);
    let Brightness = 0;
    let I2Caddress = 0x10;

    /**
     * set line brightness threshold. 
     * @param threshold
     */
    //% blockId="set line brightness threshold" block="set threshold %threshold" 
    export function set_threshold(threshold: number) {
        let buf = pins.createBuffer(3);
        buf[0] = 0x45;
        buf[1] = threshold & 0xff;
        buf[2] = threshold >> 8;
        pins.i2cWriteBuffer(I2Caddress, buf);
    }

    /**
     * set sonic speed. 
     * @param speed
     */
    //% blockId="set sonic speed" block="set sonic speed %speed" 
    export function set_sonic_speed(speed: number) {
        let buf = pins.createBuffer(3);
        buf[0] = 0x46;
        buf[1] = speed & 0xff;
        buf[2] = speed >> 8;
        pins.i2cWriteBuffer(I2Caddress, buf);
    }

    /**
     * set motor collection value. 
     * @param left
     * @param right
     */
    //% blockId="set motor collection value" block="set collection value%left %right" 
    export function set_collection_value(left: number,right:number) {
        let buf = pins.createBuffer(3);
        buf[0] = 0x46;
        buf[1] = left;
        buf[2] = right;
        pins.i2cWriteBuffer(I2Caddress, buf);
    }

    /**
     * motor run. 
     * @param left
     * @param right
     */
    //% blockId="motor run" block="motor run left speed=%left right speed=%right" 
    export function motor_run(left: number,right:number) {
        let buf = pins.createBuffer(5);

        buf[0] = 0x00;
        if(left>=0){
            buf[1] = 0;
            buf[2] = left;
        } else{
            buf[1] = 1;
            buf[2] = -left;
        }
        if(right>=0){
            buf[3] = 0;
            buf[4] = right;
        } else{
            buf[3] = 1;
            buf[4] = -right;
        }
        pins.i2cWriteBuffer(I2Caddress, buf);
    }

    /**
     * Shows all LEDs to a given color (range 0-255 for r, g, b). 
     * @param rgb RGB color of the LED
     */
    //% blockId="show all LEDs" block="show color %rgb=neopixel_colors" 
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
    //% blockId="show pixel color" block="sow pixel color at %pixeloffset|to %rgb=neopixel_colors" 
    export function showPixelColor(pixeloffset: number, rgb: number): void {
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
    //% blockId="show" block="show"
    export function show() {
        neobuf[0] = 0x80;
        pins.i2cWriteBuffer(I2Caddress, neobuf)
        pins.i2cWriteNumber(I2Caddress, 0xff, NumberFormat.Int8BE);
    }

    /**
     * Turn off all LEDs.
     */
    //% blockId="clear" block="clear"
    export function clear(): void {
        for (let i = 1; i <= neocount * 3; i++) neobuf[i] = 0x00;
        show();
    }

    /**
     * Set the brightness of the LEDs.
     * @param brightness a measure of LED brightness in 0-255. eg: 255
     */
    //% blockId="set_brightness" block="set brightness %brightness"
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
    //% blockId="neopixel_rgb" block="red %red|green %green|blue %blue"
    export function rgb(red: number, green: number, blue: number): number {
        return packRGB(red, green, blue);
    }

    /**
     * Gets the RGB value of a known color
    */
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