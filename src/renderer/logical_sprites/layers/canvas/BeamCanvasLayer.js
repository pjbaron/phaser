/**
 *
 * BeamCanvasLayer - Base class for Layers, contains one layer of multiple BeamTransformObject objects.
 *
 */


function BeamCanvasLayer()
{
	this.superCall(BeamCanvasLayer, 'constructor');
	// this.parent = null;
	// this.phaserRender = null;
	// this.clip = null;
	this.drawList = null;
}

// BeamCanvasLayer extends from the BeamBaseLayer prototype chain
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
BeamCanvasLayer.prototype = new BeamBaseLayer();
BeamCanvasLayer.prototype.constructor = BeamCanvasLayer;
BeamCanvasLayer.prototype.__super__ = BeamBaseLayer;



BeamCanvasLayer.prototype.update = function()
{
	// console.log("BeamCanvasLayer.update");
	this.drawList = [];

	// call the BeamBaseLayer update for this BeamCanvasLayer to access the child hierarchy
	this.superCall(BeamCanvasLayer, 'update', this.drawList);

	if (this.clip)
	{
		// apply clipping for this layer
		BeamPhaserRender.renderer.graphics.scissor(Math.floor(this.clip.x), Math.floor(this.clip.y), Math.ceil(this.clip.width), Math.ceil(this.clip.height));
	}
	else
	{
		// disable clipping for this layer
		BeamPhaserRender.renderer.graphics.scissor();
	}

	// draw all of the queued objects
	if (this.drawList && this.drawList.length > 0)
		this.draw(this.drawList);

	// call update for all members of this layer
	var i = this.list.length;
	while(i--)
	{
		var member = this.list[i];

		if (!member.update())
		{
			member.destroy();
			this.list.splice(i, 1);
		}
	}

	return true;
};
