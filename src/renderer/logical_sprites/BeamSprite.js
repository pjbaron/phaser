/**
 * 
 * BeamSprite - wrapper to bind BeamSurface, pbImage and BeamTransformObject together to create a simple to use Sprite object
 * 
 */



function BeamSprite()
{
	this.surface = null;
	this.image = null;
    this.transform = new BeamTransformObject();
    this.anchor = null;
    this.scale = null;
    this.children = null;
    this.contains = null;
    this._position = null;
}


BeamSprite.prototype.constructor = BeamSprite;


BeamSprite.prototype.createWithKey = function(game, _x, _y, _key)
{
	// get the texture object from the textures dictionary using 'key'
	if (_key instanceof String || typeof _key == "string")
	{
		var textureObject = game.cache.getImage(_key, true);
		if (textureObject.base instanceof BeamSurface)
		{
			this.surface = textureObject.base;
		}
		else
		{
			this.surface = new BeamSurface();
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

		this.surface = new BeamSurface();
		this.surface.createSingle(imageData);

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
		this.image.fromCanvas = _key.canvas;
	}
	else if (_key instanceof BeamSurface)
	{
		this.surface = _key;

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
//		this.image.fromCanvas = _key.canvas;
	}
	else if (_key)
	{
		// _key is a new canvas, create a surface the same size
// TODO: need to wrap the canvas with a BeamSurface so it's accessible to everything else... try adding the canvas contents to the Cache so that LoadTexture (from Core.init) can see it
		var ctx = _key.getContext("2d");
		var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

		this.surface = new BeamSurface();
		this.surface.createSingle(imageData);

		// create an image holder and attach the surface
		this.image = new imageClass();
		this.image.create(this.surface);
		this.image.fromCanvas = _key;
	}
	else
	{
		console.log("ERROR: null key provided to BeamSprite.createWithKey...");
	}

	// create a transform object for the image
	this._position = new Phaser.Point(_x, _y);
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend BeamSprite can access properties of my member objects
	if ( this.image )
	{
		this.anchor = this.image.anchor;
	}
	else
	{
		this.anchor = new Phaser.Point(0.5, 0.5);
	}
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;
};


BeamSprite.prototype.createGPU = function(_x, _y, _texture, _layer)
{
	// create an image holder and attach the surface
	this.image = new imageClass();
	// _surface, _cellFrame, _anchorX, _anchorY, _tiling, _fullScreen
	this.image.create(null);
	this.image.onGPU = _texture;

	// create a transform object for the image
	this._position = new Phaser.Point(_x, _y);
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend BeamSprite can access properties of my member objects
	this.anchor = this.image.anchor;
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;
};


// BeamSprite.prototype.createWithTexture = function(_x, _y, _texture)
// {
//     // get the texture object from the textures dictionary using 'key'
//     this.textureObject = textures.getFirst(_key);
//     // set up easy access to the surface
//     this.surface = this.textureObject.surface;
//     // create an image holder and attach the surface
//     this.image = new imageClass();
//     this.image.create(this.surface);
//     // create a transform object for the image
//     this.transform = new BeamTransformObject();
//     this.transform.create(this.image, _x, _y);
// };


BeamSprite.prototype.destroy = function()
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


BeamSprite.prototype.resize = function( _key )
{
	if (_key instanceof HTMLCanvasElement)
	{
		if (this.transform.width != _key.width || this.transform.height != _key.height)
		{
			// bullet-proofing, getImageData will crash if presented with a zero dimension
			if (_key.width === 0) _key.width = 1;
			if (_key.height === 0) _key.height = 1;

			// debug only
			console.log("BeamSprite.resize to " + _key.width + "x" + _key.height);

			// get the image data from the canvas
			var ctx = _key.getContext("2d");
			var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

			// create a new BeamSurface using the new imageData
			this.surface = new BeamSurface();
			this.surface.createSingle(imageData);

			// update the canvas reference held in the image
			this.image.fromCanvas = _key;

			// make sure the transform object has the correct dimensions for the new surface
			this.transform.width = this.image.surface.cellSourceSize[this.image.cellFrame].wide;
			this.transform.height = this.image.surface.cellSourceSize[this.image.cellFrame].high;
		}
	}
};


BeamSprite.prototype.getBounds = function()
{
	return this.transform.bounds;
};


function MyPoint(_pos, _transform)
{
	// keep reference to the position we're wrapping and the transform we want to update
	this._position = _pos;
	this._transform = _transform;
}

MyPoint.prototype = Object.create(MyPoint);
MyPoint.prototype.constructor = MyPoint;

MyPoint.prototype.set = function(_x, _y)
{
	// adjust the position we are wrapping
	this._position.x = this._transform.x = _x;
	this._position.y = this._transform.y = _y;
	this._transform.updateTransform();
};


Object.defineProperties(BeamSprite.prototype, {

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

	parent: {
		get: function() {
			return this.transform.parent;
		},
		set: function(value) {
			this.transform.parent = value;
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
		get: function()
		{
			return new MyPoint(this._position, this.transform);
		},

		set: function(_pos)
		{
			this._position.x = this.transform.x = _pos.x;
			this._position.y = this.transform.y = _pos.y;
			this.transform.updateTransform();
		}

	},

	visible: {
		get: function()
		{
			return this.transform.visible;
		},

		set: function(_visible)
		{
			this.transform.visible = _visible;
		}
	}
});



