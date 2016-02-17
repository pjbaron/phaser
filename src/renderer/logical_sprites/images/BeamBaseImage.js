/**
 *
 * Surface holder with a single BeamSurface and a cellFrame index for the current animation cell.
 * 
 * This information cannot be stored in BeamSurface (they are reused so the cellFrame needs to be unique)
 * and should not be in BeamTransformObject (it's a logical transform object with an optional image attached).
 *
 * These objects will usually be one per BeamTransformObject, but can safely be shared if a large number of BeamTransformObject
 * objects will animate entirely in sync.  Be careful not to update the cellFrame in every BeamTransformObject though!
 *
 */


function BeamBaseImage()
{
	this.surface = null;
	this.cellFrame = 0;
	this.gpuTexture = null;
	this.corners = null;
	this.anchor = null;
	this.fullScreen = false;
	this.tiling = false;
	this.isParticle = false;
}


BeamBaseImage.prototype.create = function(_surface, _cellFrame, _anchorX, _anchorY, _tiling, _fullScreen)
{
	if (_cellFrame === undefined || _cellFrame === null) _cellFrame = 0;
	if (_anchorX === undefined || _anchorX === null) _anchorX = 0.0;
	if (_anchorY === undefined || _anchorY === null) _anchorY = 0.0;
	if (_tiling === undefined || _tiling === null) _tiling = false;
	if (_fullScreen === undefined || _fullScreen === null) _fullScreen = false;

	this.surface = _surface;
	this.cellFrame = _cellFrame;
	this.gpuTexture = null;
	this.corners = null;
	this.anchor = new Phaser.Point(_anchorX, _anchorY);
	this.fullScreen = _fullScreen;
	this.tiling = _tiling;		// TODO: move to BeamSurface?? batch processing will be all or nothing so shared surface can't switch 'tiling' state on & off per BeamBaseImage
	this.isParticle = false;
};


BeamBaseImage.prototype.destroy = function()
{
	this.surface = null;
	this.gpuTexture = null;
	this.corners = null;
};


BeamBaseImage.prototype.setCorners = function(ltx, lty, rtx, rty, lbx, lby, rbx, rby)
{
	alert("ERROR: render mode '", BeamPhaserRender.useRenderer, "' does not support setCorners!");
};


BeamBaseImage.prototype.getSize = function()
{
	if (!this.surface)
	{
		return null;
	}
	return this.surface.cellSourceSize[this.cellFrame];
};


// allow this class to be extended
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
BeamBaseImage.prototype.superCall = function(clazz, functionName)
{
	//console.log("BeamBaseImage.superCall", functionName);
	var args = Array.prototype.slice.call(arguments, 2);
	clazz.prototype.__super__.prototype[functionName].apply(this, args);
};

