if (!window.JG)
    JG = {};

JG.Bitmap =
    (function () {

        let colorPallete = [
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

        function ReplaceColorPallete(newColorPallete) {

            colorPallete = newColorPallete;
        }

        function UpdateColorPallete(palletePosition, color) {

            colorPallete[palletePosition] = color;
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

        function RenderToCanvas(bitmapCode, width, height, scale) {

            let drawingContexts =
                getCanvasAndCTX(
                    width,
                    height,
                    scale);

            let i = 0,
                u = 0,
                widthAccumulator = 1;

            while (i < bitmapCode.length) {

                let t =
                    bitmapCode
                        .substr(
                            i,
                            1);

                r = (t.charCodeAt(0) - 65);

                do {

                    color =
                        colorPallete[
                        parseInt(t)];

                    drawingContexts
                        .ctx
                        .fillStyle =
                        color;

                    x = (i + u) - (~~((i + u) / width) * width);
                    y = ~~((i + u) / height);
                    u++;
                    nextY = (~~((i + u) / height));
                    r--;

                    if (y == nextY && r > 0) { // do i need this r > 0?

                        widthAccumulator++;

                    } else {

                        if (color != "rgba(0,0,0,0)")
                            drawingContexts
                                .ctx
                                .fillRect(
                                    x * scale,
                                    y * scale,
                                    scale - (scale * (widthAccumulator + 1)) - (scale > 1 ? 1 : 0),
                                    scale + (scale > 1 ? 1 : 0));

                        widthAccumulator = 1;
                    }

                } while (r > 0);

                u--;
                i++;
            }

            return drawingContexts.canvas;
        }

        function RenderToImageUrl(bitmapCode, width, height, scale) {

            return RenderToCanvas(bitmapCode, width, height, scale).toDataURL();
        }

        return {
            RenderToCanvas: RenderToCanvas,
            RenderToImageUrl: RenderToImageUrl,
            UpdateColorPallete: UpdateColorPallete,
            ReplaceColorPallete: ReplaceColorPallete
        }
    })();