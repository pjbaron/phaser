/**
 *
 * A raw texture surface with handling and manipulation methods.
 * TODO: Currently holds the HTML Image only but should be extended to any other image sources.
 * TODO: Atlas needs to be able to handle 90 degree rotation of images (used for better packing sometimes)
 * TODO: Atlas needs to handle 'trimmed' images where necessary white-space has been cut off for better packing (necessary for correct positioning - use offsets)
 * 
 * Each surface may contain a number of separate images, called 'cells' here because they will often be animation cells.
 * Surfaces will be sent entire to graphics card in WebGL mode, the shaders use the cell data to pick out the correct frame.
 * 
 */

/*
Notes for atlas with trimmed sprites:
"frame" contains the rectangle of the sprite in this texture
"spriteSourceSize" contains the offsets required to position the "frame" into the original source rectangle
"sourceSize" contains the original source dimensions
 */

function pbSurface()
{
	this.cellsWide = 0;
	this.cellsHigh = 0;
	this.imageData = null;
	this.cells = 0;
	// the percentage of the source texture occupied by each animation cell
	this.cellTextureBounds = null;
	// the size of a trimmed cell of the animation (size to draw)
	this.cellSourceSize = null;
	// the size of an untrimmed cell of the animation
	this.srcSize = null;
	this.cellOffsets = null;
	this.isNPOT = false;
	this.rttTexture = null;
	this.rttTextureRegister = -1;
	// the smoothing type used when scaling the surface
	// TODO: currently unused by the renderer, referenced by Phaser.Sprite.smoothed
	this.scaleMode = 0;
	// is the surface 'dirty' (eg. parameters have changed, or texture)
	// TODO: currently unused by the renderer, referenced by Phaser.Sprite.loadTexture
	this._isDirty = false;
}




/**
 * create - create an empty surface for a single cell image
 *
 */
pbSurface.prototype.create = function(_width, _height)
{
	this.cells = this.cellsWide = this.cellsHigh = 1;

	this.cellSourceSize = [];
	this.srcSize = this.cellSourceSize;
	this.cellSourceSize[0] = { wide:_width, high:_height };
	this.isNPOT = !(this.isPowerOfTwo(this.cellSourceSize[0].wide) && this.isPowerOfTwo(this.cellSourceSize[0].high));

	console.log("pbSurface.create " + this.cellSourceSize[0].wide +  "x" + this.cellSourceSize[0].high + " isNPOT = " + (this.isNPOT ? "true" : "false"));

	this.rttTexture = null;
	this.rttTextureRegister = 0;
	this.imageData = null;
	
	this.cellTextureBounds = [];
	this.cellTextureBounds[0] = new pbRectangle(0, 0, 1, 1);
};


/**
 * createSingle - create a surface to contain a single sprite image
 *
 * @param  {[type]} _imageData          [description]
 * @param  {[type]} _rttTexture         [description]
 * @param  {[type]} _rttTextureRegister [description]
 * @param  {Object {width,height}} _trimmmedFrom - optional, define the rectangle size that this shape was trimmed from
 * @param  {Object {x,y}} _offsets - optional, define the offset of this shape within the untrimmed rectangle
 *
 * @return {[type]}                     [description]
 */
pbSurface.prototype.createSingle = function(_imageData, _rttTexture, _rttTextureRegister, _trimmedFrom, _offsets)
{
	if (_rttTexture === undefined)
	{
		_rttTexture = null;
	}
	if (_rttTextureRegister === undefined)
	{
		_rttTextureRegister = 0;
	}

	this.cells = this.cellsWide = this.cellsHigh = 1;

	this.cellSourceSize = [];
	if (_trimmedFrom === undefined)
	{
		this.srcSize = this.cellSourceSize;
	}
	else
	{
		this.srcSize = [];
		this.srcSize[0] = { wide:_trimmedFrom.width, high:_trimmedFrom.height };
		if (_offsets !== undefined)
		{
			this.cellOffsets = [];
			this.cellOffsets[0] = { x: _offsets.x, y: _offsets.y };
		}
	}

	if (_rttTexture)
	{
		this.cellSourceSize[0] = { wide:_rttTexture.width, high:_rttTexture.height };
	}
	else if (_imageData)
	{
		this.cellSourceSize[0] = { wide:_imageData.width, high:_imageData.height };
	}
	this.isNPOT = !(this.isPowerOfTwo(this.cellSourceSize[0].wide) && this.isPowerOfTwo(this.cellSourceSize[0].high));

	console.log("pbSurface.createSingle " + this.cellSourceSize[0].wide +  "x" + this.cellSourceSize[0].high + " isNPOT = " + (this.isNPOT ? "true" : "false"));

	this.rttTexture = _rttTexture;
	this.rttTextureRegister = _rttTextureRegister;
	this.imageData = _imageData;
	
	this.cellTextureBounds = [];
	this.cellTextureBounds[0] = new pbRectangle(0, 0, 1, 1);
};


pbSurface.prototype.createGrid = function(_wide, _high, _numWide, _numHigh, _imageData, _rttTexture, _rttTextureRegister, _trimmedFrom, _offsets)
{
	if (_rttTexture === undefined)
	{
		_rttTexture = null;
	}
	if (_rttTextureRegister === undefined)
	{
		_rttTextureRegister = 0;
	}

	var srcWide, srcHigh;
	if (_rttTexture)
	{
		srcWide = _rttTexture.width;
		srcHigh = _rttTexture.height;
	}
	else if (_imageData)
	{
		srcWide = _imageData.width;
		srcHigh = _imageData.height;
	}
	this.isNPOT = !(this.isPowerOfTwo(srcWide) && this.isPowerOfTwo(srcHigh));

	if (_wide === 0)
	{
		_wide = srcWide;		
	}
	if (_high === 0)
	{
		_high = srcHigh;
	}
	
	this.cellsWide = _numWide;
	this.cellsHigh = _numHigh;
	this.cells = this.cellsWide * this.cellsHigh;

	this.rttTexture = _rttTexture;
	this.rttTextureRegister = _rttTextureRegister;
	this.imageData = _imageData;
	
	console.log("pbSurface.createGrid " + srcWide +  "x" + srcHigh + " " + this.cellsWide + "x" + this.cellsHigh + " isNPOT = " + (this.isNPOT ? "true" : "false"));

	// dimensions of one cell in texture coordinates (0 = left/top, 1 = right/bottom)
	var texWide, texHigh;
	if (_imageData)
	{
		texWide = 1.0 / (srcWide / _wide);
		texHigh = 1.0 / (srcHigh / _high);
	}
	else
	{
		// there is no image attached, create a surface to exactly fit the animation cells
		texWide = 1.0 / this.cellsWide;
		texHigh = 1.0 / this.cellsHigh;
	}

	
	this.cellTextureBounds = [];
	this.cellSourceSize = [];
	if (_trimmedFrom === undefined)
	{
		this.srcSize = this.cellSourceSize;
	}
	else
	{
		this.srcSize = [];
	}
	if (_offsets !== undefined)
	{
		this.cellOffsets = [];
	}

	var i = 0;
	for(var y = 0; y < this.cellsHigh; y++)
	{
		for(var x = 0; x < this.cellsWide; x++)
		{
			this.cellSourceSize[i] = { wide: _wide, high: _high };
			if (_trimmedFrom !== undefined)
			{
				this.srcSize[i] = { wide:_trimmedFrom.width, high:_trimmedFrom.height };
			}
			this.cellTextureBounds[i++] = new pbRectangle(x * texWide, y * texHigh, texWide, texHigh);
			if (_offsets !== undefined)
			{
				this.cellOffsets[i] = { x: _offsets.x, y: _offsets.y };
			}
		}
	}
};


/**
 * createAtlas - create a surface and specify the cell positions using texture atlas data
 * I have tested this with the dragon_atlas.json file used in Phaser demos previously, which was
 * created with TexturePacker.
 *
 * @param  {[type]} data               [description]
 * @param  {[type]} _imageData          [description]
 */
pbSurface.prototype.createAtlas = function(data, _imageData)
{
	var w = data.meta.size.w;
	var h = data.meta.size.h;
	this.isNPOT = !(this.isPowerOfTwo(w) && this.isPowerOfTwo(h));

	console.log("pbSurface.createAtlas " + w + "x" + h + " frames = " + data.frames.length + " isNPOT = " + (this.isNPOT ? "true" : "false"));

	this.cells = data.frames.length;
	this.imageData = _imageData;
	this.cellTextureBounds = [];
	this.srcSize = [];
	this.cellSourceSize = [];
	this.cellOffsets = null;
	for(var i = 0, l = this.cells; i < l; i++)
	{
		var f = data.frames[i];
		// the size of an untrimmed cell of the animation
		this.srcSize[i] = { wide: f.sourceSize.w, high: f.sourceSize.h };
		// the size of a trimmed cell of the animation (size to draw)
		this.cellSourceSize[i] = { wide: f.spriteSourceSize.w, high: f.spriteSourceSize.h };
		// the percentage of the source texture occupied by each animation cell
		this.cellTextureBounds[i] = new pbRectangle(f.frame.x / w, f.frame.y / h, f.frame.w / w, f.frame.h / h);
		if (f.trimmed)
		{
			if (!this.cellOffsets)
			{
				this.cellOffsets = [];
			}
			this.cellOffsets[i] = { x: f.spriteSourceSize.x, y: f.spriteSourceSize.y };
		}
	}
};


/**
 * createStarlingAtlas - create a surface using Starling style atlas data, and specify the cell positions
 * this function was created to work with (for e.g.) examples/assets/sprites/seacreatures.xml
 *
 * @param  {[type]} data               [description]
 * @param  {[type]} _imageData          [description]
 */
pbSurface.prototype.createStarlingAtlas = function(data, _imageData)
{
	var d = data.documentElement;
	var w = _imageData.width;
	var h = _imageData.height;
	this.isNPOT = !(this.isPowerOfTwo(w) && this.isPowerOfTwo(h));

	console.log("pbSurface.createAtlas " + w + "x" + h + " frames = " + d.childElementCount + " isNPOT = " + (this.isNPOT ? "true" : "false"));

	this.cells = d.childElementCount;
	this.imageData = _imageData;
	this.cellTextureBounds = [];
	this.srcSize = [];
	this.cellSourceSize = [];
	this.cellOffsets = [];
	for(var i = 0, l = this.cells; i < l; i++)
	{
		var f = d.children[i].attributes;

		var xi = parseInt(f.x.value, 10);
		var yi = parseInt(f.y.value, 10);
		var wi = parseInt(f.width.value, 10);
		var hi = parseInt(f.height.value, 10);

		// if frameX etc exist, then the image has been trimmed from this original size
		var fx = parseInt(f.frameX ? f.frameX.value : "0", 10);
		var fy = parseInt(f.frameY ? f.frameY.value : "0", 10);
		var fw = parseInt(f.frameWidth ?  f.frameWidth.value : f.width.value, 10);
		var fh = parseInt(f.frameHeight ? f.frameHeight.value : f.height.value, 10);

		// the size of an untrimmed cell of the animation
		this.srcSize[i] = { wide: fw, high: fh };
		// the size of a trimmed cell of the animation (size to draw)
		this.cellSourceSize[i] = { wide: wi, high: hi };
		// the percentage of the source texture occupied by each animation cell
		this.cellTextureBounds[i] = new pbRectangle(xi / w, yi / h, wi / w, hi / h);
		if (f.frameX || f.frameY)
		{
			this.cellOffsets[i] = { x: -fx, y: -fy };
		}
		else
		{
			this.cellOffsets[i] = { x: 0, y: 0 };
		}
	}
};


/**
 * createAtlasFromJSON - create a surface and specify the cell positions using a JSON data structure
 * I have tested this with the dragon_atlas.json file used in Phaser demos previously, which was
 * created with TexturePacker.
 *
 * @param  {[type]} _JSON               [description]
 * @param  {[type]} _imageData          [description]
 */
pbSurface.prototype.createAtlasFromJSON = function(_JSON, _imageData)
{
	var data = JSON.parse(_JSON);
	this.createAtlas(data, _imageData);
};


pbSurface.prototype.destroy = function()
{
	this.imageData = null;
	this.cellSourceSize = null;
	this.cellTextureBounds = null;
};


pbSurface.prototype.isPowerOfTwo = function(x)
{
	return ((x > 0) && !(x & (x - 1)));
};


pbSurface.prototype.dirty = function()
{
	this._isDirty = true;
};
