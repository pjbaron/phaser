/**
 * 
 * pbSprite - wrapper to bind pbSurface, pbImage and pbTransformObject together to create a simple to use Sprite object
 * 
 */



function pbSprite()
{
	this.layer = null;
	this.surface = null;
	this.image = null;
    this.transform = new pbTransformObject();
    this.anchor = null;
    this.scale = null;
    this.children = null;
    this.contains = null;
}


pbSprite.prototype.constructor = pbSprite;


pbSprite.prototype.createWithKey = function(game, _x, _y, _key, _layer)
{
	this.layer = _layer || null;

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
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend pbSprite can access properties of my member objects
	this.anchor = this.image.anchor;
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;

	// if a layer is specified, add the new object as a child of it
	if (this.layer !== null)
	{
		this.layer.addChild(this.transform);
	}
};


pbSprite.prototype.createGPU = function(_x, _y, _texture, _layer)
{
	this.layer = _layer || null;

	// create an image holder and attach the surface
	this.image = new imageClass();
	// _surface, _cellFrame, _anchorX, _anchorY, _tiling, _fullScreen
	this.image.create(null);
	this.image.onGPU = _texture;

	// create a transform object for the image
	this.transform.create(this.image, _x, _y);

	// create references so that classes that extend pbSprite can access properties of my member objects
	this.anchor = this.image.anchor;
	this.scale = this.transform.scale;
	this.children = this.transform.children;
	this.contains = this.transform.contains;

	// if a layer is specified, add the new object as a child of it
	if (this.layer !== null)
	{
		this.layer.addChild(this.transform);
	}
};


// pbSprite.prototype.createWithTexture = function(_x, _y, _texture, _layer)
// {
//     this.layer = _layer || null;

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

//     // if a layer is specified, add the new object as a child of it
//     if (this.layer !== null)
//         this.layer.addChild(this.transform);
// };


pbSprite.prototype.destroy = function()
{
	if (this.layer)
	{
		this.layer.removeChild(this.transform);
	}
	this.layer = null;

	this.surface = null;

	if (this.image)
	{
		this.image.destroy();
	}
	this.image = null;
	
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
		if (this.width != _key.width || this.height != _key.height)
		{
			console.log("pbSprite.resize to " + _key.width + "x" + _key.height);

			var ctx = _key.getContext("2d");
			var imageData = ctx.getImageData(0, 0, _key.width, _key.height);

			this.surface = new pbSurface();
			this.surface.createSingle(imageData);

			// update the surface reference held in the image too
			this.image.surface = this.surface;
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
	}
});

