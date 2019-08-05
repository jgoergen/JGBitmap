Sprite = function (_width, _height, _pixelArray, _colorPalette) {

	this.repetitionCharBegin = 65;
	this.repetitionCharMax = 25;

    this.fromString = function (_string) {

		this.rawPixelArray = new Array();
		var frameArray = _string.split("|");
		
		for (var n = 0; n < frameArray.length; n++) {
			
			if (frameArray[n].length < 1)
				continue;
			
			var pixelArray = new Array();
	
			for (var i = 0; i < frameArray[n].length; i++) {
	
				// get the current char
				var theChar = frameArray[n].substr(i, 1);
													
				pixelArray.push(this.getCharTablePosition(theChar));
	
				// if the next char is greater than 65 then its a repeater.
				var quit = false;
				var o = i;
	
				while (!quit) {
	
					o++;
					if (frameArray[n].length >= o) {
	
						var repeatingChar = frameArray[n].substr(o, 1);
					
						if (this.getCharTablePosition(repeatingChar) == null) {
	
							var repeatAmount = (repeatingChar.charCodeAt(0) - this.repetitionCharBegin);
							
							for (var u = 0; u < repeatAmount; u++)
								pixelArray.push(this.getCharTablePosition(theChar));
	
							i = o;
						} else {
	
							quit = true;
						}
					} else {
	
						quit = true;
					}
				}
			}
	
			this.rawPixelArray.push(pixelArray);
		}		
    }

    this.getCharTablePosition = function (_char) {

        for (var a = 0; a < this.charTable.length; a++)
            if (this.charTable[a] == _char)
                return a.toString();

        return null;
    }

    this.getCode = function () {

        var spriteCode = new Array();

        for (var o = 0; o < this.rawPixelArray.length; o++) {

            var currentSpriteCode = "";
			var validChunk = "";
			
            for (var i = 0; i < this.rawPixelArray[o].length; i++) {
				
				var theCode = (this.rawPixelArray[o][i] == undefined ? "0" : this.charTable[this.rawPixelArray[o][i]]);
                validChunk += theCode;
				
				if (theCode != "0") {
				
					currentSpriteCode += validChunk;
					validChunk = "";
				}
			}

			

            spriteCode.push(currentSpriteCode);
        }

        // A is the 65th ascii character
        //alert("A".charCodeAt(0) - 65);  

        var compressedSpriteCode = "";
        var inARow = 0;

        for (var o = 0; o < spriteCode.length; o++) {
            compressedSpriteCode += spriteCode[o].substr(0, 1)

            for (var i = 1; i < spriteCode[o].length; i++) {
                // if this pixel is the same as the last, and were not over 26 in a row then hold it
                // well encode this run with a letter instead.
                if (spriteCode[o].substr(i, 1) == spriteCode[o].substr((i - 1), 1)) {
                    inARow++;

                    if (inARow > this.repetitionCharMax) {
                        inARow -= this.repetitionCharMax;
                        compressedSpriteCode += String.fromCharCode(this.repetitionCharMax + this.repetitionCharBegin)
                    }
                } else {
                    if (inARow > 0) {
                        compressedSpriteCode += String.fromCharCode(inARow + this.repetitionCharBegin);
                        inARow = 0;
                    }

                    compressedSpriteCode += spriteCode[o].substr(i, 1);
                }
				
            }
			
			if (inARow > 0) {
				compressedSpriteCode += String.fromCharCode(inARow + this.repetitionCharBegin);
				inARow = 0;
			}

            compressedSpriteCode += "|";
        }
		
		if (compressedSpriteCode.substr(compressedSpriteCode.length - 1, 1) == "|")
			compressedSpriteCode = compressedSpriteCode.substr(0, compressedSpriteCode.length - 1);

        return compressedSpriteCode;
    }

    this.getFrameAsImage = function (whatFrame, scale) {

        if (scale == undefined || scale == "" || scale == null || typeof scale != "number")
            scale = 1;

        tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = Math.floor(this.width * scale);
        tmpCanvas.height = Math.floor(this.height * scale);
        tmpCTX = tmpCanvas.getContext('2d');

        for (var i = 0; i < this.rawPixelArray[whatFrame].length; i++) {
			
            var y = Math.floor(i / this.width);
            var x = Math.floor(i - (y * this.height));
            var curPixel = (this.rawPixelArray[whatFrame][i] != undefined ? this.rawPixelArray[whatFrame][i] : "0");

            x = (x * scale);
            y = (y * scale);

            tmpCTX.fillStyle = this.colorPalette[curPixel];
			
            tmpCTX.fillRect(x, y, scale, scale);
        }
		
		if (i < 256) {
			
			for (var o = i; o < 256; o++) {
				var y = Math.floor(o / this.width);
				var x = Math.floor(o - (y * this.height));
	
				x = (x * scale);
				y = (y * scale);
	
				tmpCTX.fillStyle = this.colorPalette[0];
				
				tmpCTX.fillRect(x, y, scale, scale);
			}
		}

        return tmpCanvas;
    }

    this.defaultColorPalette = function () {

        var tmpPalette = new Array();
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(0, 0, 0, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(235, 255, 10, 1)");
        tmpPalette.push("rgba(255, 0, 0, 1)");
        tmpPalette.push("rgba(0, 255, 0, 1)");
        tmpPalette.push("rgba(0, 0, 255, 1)");
        tmpPalette.push("rgba(255, 162, 0, 1)");
        tmpPalette.push("rgba(212, 0, 255, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(0, 0, 0, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(235, 255, 10, 1)");
        tmpPalette.push("rgba(255, 0, 0, 1)");
        tmpPalette.push("rgba(0, 255, 0, 1)");
        tmpPalette.push("rgba(0, 0, 255, 1)");
        tmpPalette.push("rgba(255, 162, 0, 1)");
        tmpPalette.push("rgba(212, 0, 255, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(0, 0, 0, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(235, 255, 10, 1)");
        tmpPalette.push("rgba(255, 0, 0, 1)");
        tmpPalette.push("rgba(0, 255, 0, 1)");
        tmpPalette.push("rgba(0, 0, 255, 1)");
        tmpPalette.push("rgba(255, 162, 0, 1)");
        tmpPalette.push("rgba(212, 0, 255, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(156, 156, 156, 1)");
        tmpPalette.push("rgba(255, 255, 255, 1)");
        tmpPalette.push("rgba(0, 0, 0, 1)");

        return tmpPalette;
    }


    // CONSTRUCTOR CODE 
    if (_pixelArray == undefined || _pixelArray == "" || _pixelArray == null || typeof _pixelArray == "undefined")
        _pixelArray = new Array(new Array());

    if (_colorPalette == undefined || _colorPalette == "" || _colorPalette == null || typeof _colorPalette == "undefined")
        _colorPalette = this.defaultColorPalette();

    this.width = _width;
    this.height = _height;
    this.rawPixelArray = _pixelArray;
    this.colorPalette = _colorPalette;
    this.charTable = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z");
}