/**
 *
 * BeamPhaserRender - manager for the entire Phaser 3 rendering system
 * 
 */




// static globals

// globally useful
//BeamPhaserRender.rootLayer = null;
BeamPhaserRender.width = 0;
BeamPhaserRender.height = 0;
BeamPhaserRender.canvas = null;
BeamPhaserRender.frameCount = 0;
BeamPhaserRender.sprCountDbg = 0;
BeamPhaserRender.useRenderer = 'none';

// sub-systems
BeamPhaserRender.renderer = null;
BeamPhaserRender.loader = null;
//BeamPhaserRender.rootTimer = null;




function BeamPhaserRender( _canvas )
{
	BeamPhaserRender.canvas = _canvas;
	this.docId = _canvas.id;
	this.isBooted = false;
	BeamPhaserRender.frameCount = 0;

	BeamPhaserRender.width = 800;
	BeamPhaserRender.height = 600;

	// canvas
//	BeamPhaserRender.canvas = document.createElement('canvas');
//	BeamPhaserRender.canvas.setAttribute('id', this.docId);
//	BeamPhaserRender.canvas.setAttribute('width', BeamPhaserRender.width);
//	BeamPhaserRender.canvas.setAttribute('height', BeamPhaserRender.height);
//	BeamPhaserRender.canvas.setAttribute('style', 'border: none');
	// NOTE: canvas performance seems heavily dependent on the Node order of it's parent, it needs to be first!
	var guiContainer = document.getElementById('gui');    
	document.body.insertBefore(BeamPhaserRender.canvas, guiContainer);
}


BeamPhaserRender.prototype.create = function(_renderMode)
{
	console.log("BeamPhaserRender create");

	// parameters
	this.renderMode = _renderMode;

	// globals
	//BeamPhaserRender.rootLayer = null;

	// boot when the document is ready
	// var _this = this;
	// this._onBoot = function () {
	// 		return _this.boot();
	// 	};
	// if (document.readyState === 'complete' || document.readyState === 'interactive')
	// {
	// 	window.setTimeout(this._onBoot, 0);
	// }
	// else
	// {
	// 	document.addEventListener('DOMContentLoaded', this._onBoot, false);
	// 	window.addEventListener('load', this._onBoot, false);
	// }

	// create the renderer sub-system
	BeamPhaserRender.renderer = new BeamRenderer( this );
	BeamPhaserRender.renderer.create( this.renderMode, BeamPhaserRender.canvas, this.gameContext );

	// create the BeamPhaserRender.rootLayer container for all graphics
	//BeamPhaserRender.rootLayer = new layerClass();
	//BeamPhaserRender.rootLayer.create(null, BeamPhaserRender.renderer, 0, 0, 0, 0, 1, 1);
};


// BeamPhaserRender.prototype.boot = function()
// {
	// if (this.isBooted)
	// {
	// 	// only boot once
	// 	return;
	// }

	// if (!document.body)
	// {
	// 	// wait until the document.body is available, keep trying every 20 ms
	// 	window.setTimeout(this._onBoot, 20);
	// 	return;
	// }

	// console.log("BeamRenderer boot");

	// document.removeEventListener('DOMContentLoaded', this._onBoot);
	// window.removeEventListener('load', this._onBoot);

	// // only boot once
	// this.isBooted = true;

	// start the update ticking
//	this.rootTimer = new BeamRootTimer();
//	this.rootTimer.start(this.update, this);
// };


BeamPhaserRender.prototype.destroy = function()
{
	console.log("BeamPhaserRender.destroy");

//	if ( this.rootTimer )
//		this.rootTimer.destroy();
//	this.rootTimer = null;

	// if ( BeamPhaserRender.rootLayer )
	// 	BeamPhaserRender.rootLayer.destroy();
	// BeamPhaserRender.rootLayer = null;

	if (BeamPhaserRender.renderer)
		BeamPhaserRender.renderer.destroy();
	BeamPhaserRender.renderer = null;

	if (BeamPhaserRender.loader)
		BeamPhaserRender.loader.destroy();
	BeamPhaserRender.loader = null;

//	if (BeamPhaserRender.rootTimer)
//		BeamPhaserRender.rootTimer.destroy();
//	BeamPhaserRender.rootTimer = null;

	this.renderMode = null;
	this.bootCallback = null;
	this.updateCallback = null;
	this.gameContext = null;

	BeamPhaserRender.canvas.parentNode.removeChild( BeamPhaserRender.canvas );
	BeamPhaserRender.canvas = null;
};


BeamPhaserRender.prototype.preRender = function()
{
	// debug global to count how many sprites are being drawn each frame
	BeamPhaserRender.sprCountDbg = 0;

	BeamPhaserRender.frameCount++;
	BeamPhaserRender.renderer.preUpdate();
};


BeamPhaserRender.prototype.render = function(game)
{
	BeamPhaserRender.renderer.update(game);
};


BeamPhaserRender.prototype.postRender = function()
{
	BeamPhaserRender.renderer.postUpdate();
};


/**
 * resize - resize the renderer and the game canvas
 *
 * @param  {[type]} _width  [description]
 * @param  {[type]} _height [description]
 *
 * @return {[type]}         [description]
 */
BeamPhaserRender.prototype.resize = function( _width, _height )
{
	BeamPhaserRender.width = _width;
	BeamPhaserRender.height = _height;
	// TODO: did we want to change scaling?  If so use BeamPhaserRender.canvas.style.width etc
	BeamPhaserRender.canvas.width = BeamPhaserRender.width;
	BeamPhaserRender.canvas.height = BeamPhaserRender.height;
};

