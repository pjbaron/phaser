/**
 *
 * pbPhaserRender - manager for the entire Phaser 3 rendering system
 * 
 */




// static globals

// globally useful
//pbPhaserRender.rootLayer = null;
pbPhaserRender.width = 0;
pbPhaserRender.height = 0;
pbPhaserRender.canvas = null;
pbPhaserRender.frameCount = 0;
pbPhaserRender.sprCountDbg = 0;
pbPhaserRender.useRenderer = 'none';

// sub-systems
pbPhaserRender.renderer = null;
pbPhaserRender.loader = null;
//pbPhaserRender.rootTimer = null;




function pbPhaserRender( _canvas )
{
	pbPhaserRender.canvas = _canvas;
	this.docId = _canvas.id;
	this.isBooted = false;
	pbPhaserRender.frameCount = 0;

	pbPhaserRender.width = 800;
	pbPhaserRender.height = 600;

	// canvas
//	pbPhaserRender.canvas = document.createElement('canvas');
//	pbPhaserRender.canvas.setAttribute('id', this.docId);
//	pbPhaserRender.canvas.setAttribute('width', pbPhaserRender.width);
//	pbPhaserRender.canvas.setAttribute('height', pbPhaserRender.height);
//	pbPhaserRender.canvas.setAttribute('style', 'border: none');
	// NOTE: canvas performance seems heavily dependent on the Node order of it's parent, it needs to be first!
	var guiContainer = document.getElementById('gui');    
	document.body.insertBefore(pbPhaserRender.canvas, guiContainer);
}


pbPhaserRender.prototype.create = function(_renderMode)
{
	console.log("pbPhaserRender create");

	// parameters
	this.renderMode = _renderMode;

	// globals
	//pbPhaserRender.rootLayer = null;

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
	pbPhaserRender.renderer = new pbRenderer( this );
	pbPhaserRender.renderer.create( this.renderMode, pbPhaserRender.canvas, this.gameContext );

	// create the pbPhaserRender.rootLayer container for all graphics
	//pbPhaserRender.rootLayer = new layerClass();
	//pbPhaserRender.rootLayer.create(null, pbPhaserRender.renderer, 0, 0, 0, 0, 1, 1);
};


// pbPhaserRender.prototype.boot = function()
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

	// console.log("pbRenderer boot");

	// document.removeEventListener('DOMContentLoaded', this._onBoot);
	// window.removeEventListener('load', this._onBoot);

	// // only boot once
	// this.isBooted = true;

	// start the update ticking
//	this.rootTimer = new pbRootTimer();
//	this.rootTimer.start(this.update, this);
// };


pbPhaserRender.prototype.destroy = function()
{
	console.log("pbPhaserRender.destroy");

//	if ( this.rootTimer )
//		this.rootTimer.destroy();
//	this.rootTimer = null;

	// if ( pbPhaserRender.rootLayer )
	// 	pbPhaserRender.rootLayer.destroy();
	// pbPhaserRender.rootLayer = null;

	if (pbPhaserRender.renderer)
		pbPhaserRender.renderer.destroy();
	pbPhaserRender.renderer = null;

	if (pbPhaserRender.loader)
		pbPhaserRender.loader.destroy();
	pbPhaserRender.loader = null;

//	if (pbPhaserRender.rootTimer)
//		pbPhaserRender.rootTimer.destroy();
//	pbPhaserRender.rootTimer = null;

	this.renderMode = null;
	this.bootCallback = null;
	this.updateCallback = null;
	this.gameContext = null;

	pbPhaserRender.canvas.parentNode.removeChild( pbPhaserRender.canvas );
	pbPhaserRender.canvas = null;
};


pbPhaserRender.prototype.preRender = function()
{
	// debug global to count how many sprites are being drawn each frame
	pbPhaserRender.sprCountDbg = 0;

	pbPhaserRender.frameCount++;
	pbPhaserRender.renderer.preUpdate();
};


pbPhaserRender.prototype.render = function(game)
{
	pbPhaserRender.renderer.update(game);
};


pbPhaserRender.prototype.postRender = function()
{
	pbPhaserRender.renderer.postUpdate();
};


/**
 * resize - resize the renderer and the game canvas
 *
 * @param  {[type]} _width  [description]
 * @param  {[type]} _height [description]
 *
 * @return {[type]}         [description]
 */
pbPhaserRender.prototype.resize = function( _width, _height )
{
	pbPhaserRender.width = _width;
	pbPhaserRender.height = _height;
	// TODO: did we want to change scaling?  If so use pbPhaserRender.canvas.style.width etc
	pbPhaserRender.canvas.width = pbPhaserRender.width;
	pbPhaserRender.canvas.height = pbPhaserRender.height;
};

