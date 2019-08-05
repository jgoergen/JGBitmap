JGBitmap =
    (function () {

        let colorPalette = [
            "rgba(0,0,0,0)", // clear
            "#fff", // white
            "#000", // black
            "#ccc", // grey
            "#f00", // red
            "#0f0", // green
            "#00f", // blue
        ];

        let lastDrawingContext = null;
        let lastDrawingContextWidth = 0;
        let lastDrawingContextHeight = 0;
        let spriteCache = {};
        let graphicCache = {};

        function ReplaceColorPalette(newColorPalette) {

            colorPalette = newColorPalette;
        }

        function UpdateColorPalette(palettePosition, color) {

            colorPalette[palettePosition] = color;
        }

        function getCanvasAndCTX(width, height, scale) {

            if (lastDrawingContextWidth != width * scale || lastDrawingContextHeight != height * scale) {

                let canvas =
                    document
                        .createElement(
                            "Canvas");

                canvas.width = width * scale;
                canvas.height = height * scale;

                let ctx =
                    canvas
                        .getContext("2d");

                lastDrawingContext = {
                    canvas: canvas,
                    ctx: ctx
                };

                lastDrawingContextWidth = width * scale;
                lastDrawingContextHeight = height * scale;
            }

            return lastDrawingContext;
        }

        function RegisterSprite(spriteName, bitmapCode) {

            spriteCache[spriteName] = bitmapCode;
        }

        function RenderSprite(spriteName, width, height, scale) {

            var cacheRef = spriteName + "_" + width + "_" + height + "_" + scale;

            if (!graphicCache[cacheRef])
                graphicCache[cacheRef] =
                    RenderToCanvas(
                        spriteCache[spriteName],
                        width,
                        height,
                        scale);

            return graphicCache[cacheRef];
        }

        function RenderSpriteToImageUrl(bitmapCode, width, height, scale) {

            return RenderSprite(bitmapCode, width, height, scale).toDataURL();
        }

        function RenderToCanvas(bitmapCode, width, height, scale) {

            let drawingContexts =
                getCanvasAndCTX(
                    width,
                    height,
                    scale);

            let index = 0,
                u = 0,
                widthAccumulator = 1;

            while (index < bitmapCode.length) {

                let t = bitmapCode.substr(index, 1);
                repeats = (t.charCodeAt(0) - 65);

                do {

                    // NOTE: ~~ or 'double not' operator is used as a faster substitution for Math.floor!

                    if (t.charCodeAt(0) < 65) {

                        color = colorPalette[parseInt(t)];
                        drawingContexts.ctx.fillStyle = color;
                    }

                    x = (index + u) - (~~((index + u) / width) * width);
                    y = ~~((index + u) / height);
                    u ++;
                    nextY = (~~((index + u) / height));
                    repeats --;

                    if (y == nextY && repeats > 0) {

                        widthAccumulator ++;

                    } else {

                        if (color != "rgba(0,0,0,0)")
                            drawingContexts
                            .ctx
                            .fillRect(
                                x * scale,
                                y * scale,
                                ((scale * (widthAccumulator + 1))) - scale,
                                scale);

                        widthAccumulator = 1;
                    }

                } while (repeats > 0);

                u --;
                index ++;
            }

            return drawingContexts.canvas;
        }

        function RenderToImageUrl(bitmapCode, width, height, scale) {

            return RenderToCanvas(bitmapCode, width, height, scale).toDataURL();
        }

        return {
            RenderToCanvas: RenderToCanvas,
            RenderToImageUrl: RenderToImageUrl,
            UpdateColorPalette: UpdateColorPalette,
            ReplaceColorPalette: ReplaceColorPalette,
            RegisterSprite: RegisterSprite,
            RenderSprite: RenderSprite,
            RenderSpriteToImageUrl: RenderSpriteToImageUrl
        }
    })();