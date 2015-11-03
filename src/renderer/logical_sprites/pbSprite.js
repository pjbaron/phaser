/**
 * 
 * pbSprite - wrapper to bind pbSurface, pbImage and pbTransformObject together to create a simple to use Sprite object
 * 
 */



function pbSprite()
{
	this.surface = null;
	this.image = null;
    this.transform = new pbTransformObject();
    this.anchor = null;
    this.scale = null;
    this.children = null;
    this.contains = null;
    this._position = null;
}


pbSprite.prototype.constructor = pbSprite;


pbSprite.prototype.createWithKey = function(game, _x, _y, _key)
{
	// get the texture object from the textures dictionary using 'key'
	if (_key instanceof String || typeof _key == "string")
	{
		var textureObject = game.cache.getImage(_key, true);
		if (textureObject.base instanceof pbSurface)
		{
			this.surface = textureObject.base;
		}
		else
		{
			this.surface = new pbSurface();
			this.surface.createGrid(0, 0, 1, 1, textureObject.data);
		}

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
	}
	else if (_key instanceof Phaser.BitmapData)
	{
		var ctx = _key.context;
		var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

		this.surface = new pbSurface();
		this.surface.createSingle(imageData);

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
		this.image.fromCanvas = _key.canvas;
	}
	else
	{
		// _key is a new canvas, create a surface the same size
// TODO: need to wrap the canvas with a pbSurface so it's accessible to everything else... try adding the canvas contents to the Cache so that LoadTexture (from Core.init) can see it
		var ctx = _key.getContext("2d");
		var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

		this.surface = new pbSurface();
		this.surface.createSingle(imageData);

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
		this.image.fromCanvas = _key;
	}

	// create a transform object for the image
	this._position = new Phaser.Point(_x, _y);
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend pbSprite can access properties of my member objects
	this.anchor = this.image.anchor;
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;
};


pbSprite.prototype.createGPU = function(_x, _y, _texture, _layer)
{
	// create an image holder and attach the surface
	this.image = new imageClass();
	// _surface, _cellFrame, _anchorX, _anchorY, _tiling, _fullScreen
	this.image.create(null);
	this.image.onGPU = _texture;

	// create a transform object for the image
	this._position = new Phaser.Point(_x, _y);
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend pbSprite can access properties of my member objects
	this.anchor = this.image.anchor;
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;
};


// pbSprite.prototype.createWithTexture = function(_x, _y, _texture)
// {
//     // get the texture object from the textures dictionary using 'key'
//     this.textureObject = textures.getFirst(_key);
//     // set up easy access to the surface
//     this.surface = this.textureObject.surface;
//     // create an image holder and attach the surface
//     this.image = new imageClass();
//     this.image.create(this.surface);
//     // create a transform object for the image
//     this.transform = new pbTransformObject();
//     this.transform.create(this.image, _x, _y);
// };


pbSprite.prototype.destroy = function()
{
	this.surface = null;

	if (this.image)
	{
		this.image.destroy();
	}
	this.image = null;

	this._position = null;
	if (this.transform)
	{
		this.transform.destroy();
	}
	this.transform = null;

	// break references so they can be garbage collected
	this.anchor = null;
	this.scale = null;
	this.children = null;
	this.contains = null;
};


pbSprite.prototype.resize = function( _key )
{
	if (_key instanceof HTMLCanvasElement)
	{
		if (this.transform.width != _key.width || this.transform.height != _key.height)
		{
			// bullet-proofing, getImageData will crash if presented with a zero dimension
			if (_key.width === 0) _key.width = 1;
			if (_key.height === 0) _key.height = 1;

			// debug only
			console.log("pbSprite.resize to " + _key.width + "x" + _key.height);

			// get the image data from the canvas
			var ctx = _key.getContext("2d");
			var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

			// create a new pbSurface using the new imageData
			this.surface = new pbSurface();
			this.surface.createSingle(imageData);

			// update the canvas reference held in the image
			this.image.fromCanvas = _key;

			// make sure the transform object has the correct dimensions for the new surface
			this.transform.width = this.image.surface.cellSourceSize[this.image.cellFrame].wide;
			this.transform.height = this.image.surface.cellSourceSize[this.image.cellFrame].high;
		}
	}
};


Object.defineProperties(pbSprite.prototype, {

	x: {
		get: function () {
			return this.transform.x;
		},
		set: function (value) {
			this.transform.x = value;
	        if (this.body && this.body.type === Phaser.Physics.ARCADE && this.body.phase === 2)
	        {
	            this.body._reset = 1;
	        }
		}
	},

	y: {
		get: function () {
			return this.transform.y;
		},
		set: function (value) {
			this.transform.y = value;
	        if (this.body && this.body.type === Phaser.Physics.ARCADE && this.body.phase === 2)
	        {
	            this.body._reset = 1;
	        }
		}
	},

	z: {
		get: function () {
			return this.transform.z;
		},
		set: function (value) {
			this.transform.z = value;
		}
	},

	width: {
		get: function() {
			return this.transform.width;
		},
		set: function(value) {
			this.transform.width = value;
		}
	},

	height: {
		get: function() {
			return this.transform.height;
		},
		set: function(value) {
			this.transform.height = value;
		}
	},

	angleInRadians: {
		get: function () {
			return this.transform.angleInRadians;
		},
		set: function (value) {
			this.transform.angleInRadians = value;
		}
	},

	rotation: {
		// backwards compatibility with Phaser.Sprite/Image/etc
		// PJBNOTE: TODO: might be worth renaming angleInRadians to rotation throughout the whole renderer... beware of conflicts though!
		get: function () {
			return this.transform.angleInRadians;
		},
		set: function (value) {
			this.transform.angleInRadians = value;
		}
	},

	fullScreen: {
		get: function() {
			return this.image.fullScreen;
		},
		set: function(value) {
			this.image.fullScreen = value;
		}
	},

	tiling: {
		get: function() {
			return this.image.tiling;
		},
		set: function(value) {
			this.image.tiling = value;
		}
	},

	cellFrame: {
		get: function() {
			return this.image.cellFrame;
		},
		set: function(value) {
			this.image.cellFrame = value;
		}
	},

	position: {
		get: function() {
			return this._position;
		},

		set: function(_pos) {
			this._position.x = this.transform.x = _pos.x;
			this._position.y = this.transform.y = _pos.y;
			this.transform.updateTransform();
		}

	}
});

