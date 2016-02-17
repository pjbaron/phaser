/**
 *
 * Surface holder with a single BeamSurface and a cellFrame index for the current animation cell.
 * 
 * This information cannot be stored in BeamSurface (they are reused so the cellFrame needs to be unique)
 * and should not be in BeamTransformObject (it's a logical transform object with an optional image attached).
 *
 * These objects will usually be one per BeamTransformObject, but can be shared safely if a large number of BeamTransformObject
 * objects will animate entirely in sync (or not at all).
 * Be careful not to update the cellFrame in every BeamTransformObject that shares it though!
 *
 */


function BeamCanvasImage()
{
	// TODO: superCall call BeamBaseImage instead of repeating code
	this.surface = null;
	this.cellFrame = 0;
	this.gpuTexture = null;
	this.corners = null;
	this.fullScreen = false;
	this.tiling = false;
	this.isParticle = false;
}


// BeamCanvasImage extends from the BeamBaseImage prototype chain
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
BeamCanvasImage.prototype = new BeamBaseImage();
BeamCanvasImage.prototype.constructor = BeamCanvasImage;
BeamCanvasImage.prototype.__super__ = BeamBaseImage;


BeamCanvasImage.prototype.draw = function(_list, _transform, _z_order)
{
	_list.push(  { surface: this.surface, image: this, transform: _transform, z_order: _z_order } );
};


BeamCanvasImage.prototype.simpleDraw = function(_list, _x, _y)
{
	_list.push(  { surface: this.surface, image: this, x: _x, y: _y } );
};

