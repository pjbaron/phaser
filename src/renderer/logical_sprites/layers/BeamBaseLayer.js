/**
 *
 * BeamBaseLayer - Base class for Layers, contains one layer of multiple BeamTransformObject objects.
 * Extends BeamTransformObject
 * 
 */


function BeamBaseLayer()
{
	this.superCall(BeamBaseLayer, 'constructor');

	this.list = null;
	this.parent = null;
	this.phaserRender = null;
	this.clip = null;
}

// BeamBaseLayer extends from the BeamTransformObject prototype chain
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
BeamBaseLayer.prototype = new BeamTransformObject();
BeamBaseLayer.prototype.constructor = BeamBaseLayer;
BeamBaseLayer.prototype.__super__ = BeamTransformObject;


BeamBaseLayer.prototype.create = function(_parent, _renderer, _x, _y, _z, _angleInRadians, _scaleX, _scaleY)
{
	// console.log("BeamBaseLayer.create", _x, _y);
	
	// call the BeamTransformObject create for this BeamBaseLayer
	this.superCall(BeamBaseLayer, 'create', null, _x, _y, _z, _angleInRadians, _scaleX, _scaleY);

	// TODO: add pass-through option so that layers can choose not to inherit their parent's transforms and will use the BeamPhaserRender.rootLayer transform instead
	// TODO: BeamBaseLayer is rotating around it's top-left corner (because there's no width/height and no anchor point??)

	this.phaserRender = _renderer;

	this.parent = _parent;
	this.list = [];
};


BeamBaseLayer.prototype.setClipping = function(_x, _y, _width, _height)
{
	this.clip = new BeamRectangle(_x, _y, _width, _height);
};


BeamBaseLayer.prototype.destroy = function()
{
	// call the BeamTransformObject destroy for this BeamBaseLayer
	this.superCall(BeamBaseLayer, 'destroy');

	this.clip = null;

	this.phaserRender = null;

	if (this.parent && this.parent.list)
	{
		var i = this.parent.list.indexof(this);
		if (i != -1)
			this.parent.list.splice(i, 1);
	}
	this.parent = null;
	this.list = null;
};


BeamBaseLayer.prototype.render = function(_drawList)
{
	// console.log("BeamBaseLayer.update");
	// call the BeamTransformObject update for this BeamBaseLayer to access the child hierarchy
	this.superCall(BeamBaseLayer, 'render', _drawList);
};


BeamBaseLayer.prototype.draw = function(_list)
{
	var obj = _list[0];
	var srf = obj.image.surface;
	
	// debug sprite count
	BeamPhaserRender.sprCountDbg += _list.length;

	if (_list.length === 1)
	{
		if (obj.image.onGPU)
		{
			BeamPhaserRender.renderer.graphics.drawTextureWithTransform( obj.image.onGPU, obj.transform, obj.z_order, obj.image.anchor );
		}
		else if (srf.rttTexture)
		{
			BeamPhaserRender.renderer.graphics.drawTextureWithTransform( srf.rttTexture, obj.transform, obj.z_order, { x:obj.image.anchor.x, y:1.0 - obj.image.anchor.y } );
		}
		else if (obj.image.isModeZ)
		{
			BeamPhaserRender.renderer.graphics.drawModeZ( 0, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.is3D)
		{
			BeamPhaserRender.renderer.graphics.drawImageWithTransform3D( 0, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.toTexture != -1)
		{
			// TODO: fix hard-wired width,height
			BeamPhaserRender.renderer.graphics.drawImageToTextureWithTransform( 0, obj.image.toTexture, 256, 256, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.fromCanvas)
		{
			BeamPhaserRender.renderer.graphics.drawCanvasWithTransform( obj.image.fromCanvas, true, obj.transform, obj.z_order, obj.image.anchor );
		}
		else
		{
			// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
			BeamPhaserRender.renderer.graphics.drawImageWithTransform( 0, obj.image, obj.transform, obj.z_order );
		}
	}
	else if (obj.image.isParticle)
	{
		// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
		BeamPhaserRender.renderer.graphics.blitDrawImages( 0, _list, obj.image.surface );
	}
	else
	{
		if (obj.image.onGPU)
		{
			// TODO: double check that this is necessary... might be possible to batch draw them with some minor cleverness
			// can't batch draw when onGPU, so iterate the list to draw one at a time
			for(var i = 0, l = _list.length; i < l; i++)
			{
				obj = _list[i];
				BeamPhaserRender.renderer.graphics.drawTextureWithTransform( obj.image.onGPU, obj.transform, obj.z_order, obj.image.anchor );
			}
		}
		else if (srf.rttTexture)
		{
			BeamPhaserRender.renderer.graphics.rawBatchDrawTextures( _list );
		}
		else
		{
			// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
			BeamPhaserRender.renderer.graphics.rawBatchDrawImages( 0, _list );
		}
	}
};


/**
 * override the BeamTransformObject addChild function to handle case where a BeamBaseLayer is added to a BeamBaseLayer
 * in that case it should go into list instead of children in order to provide the correct order of processing
 *
 * @param {[type]} _child [description]
 */
BeamBaseLayer.prototype.addChild = function( _child )
{
	// console.log("BeamBaseLayer.addChild", this.list.length);

	// TODO: debug only, catches hard to track error that can propagate down through multiple layers and sprites hierarchies
	if (_child === undefined || _child === null)
		alert("ERROR: BeamBaseLayer.addChild received an invalid _child", _child);

	if ((_child instanceof Phaser.Group) || (_child instanceof BeamBaseLayer) || (_child instanceof BeamCanvasLayer) || (_child instanceof BeamWebGlLayer) || (_child instanceof BeamSimpleLayer))
	{
		this.list.push( _child );
		_child.parent = this;
	}
	else
	{
		// call the superCall.addChild function
		this.superCall(BeamBaseLayer, 'addChild', _child);
	}
};


BeamBaseLayer.prototype.removeChild = function( _child )
{
	// console.log("BeamBaseLayer.removeChild", this.list.length);

	if ((_child instanceof Phaser.Group) || (_child instanceof BeamBaseLayer) || (_child instanceof BeamCanvasLayer) || (_child instanceof BeamWebGlLayer) || (_child instanceof BeamSimpleLayer))
	{
		var index = this.findListIndex(_child);
		this.removeFromListAt(index);
	}
	else
	{
		// call the superCall.removeChild function
		this.superCall(BeamBaseLayer, 'removeChild', _child);
	}
};


BeamBaseLayer.prototype.findListIndex = function(child)
{
    for(var i = 0, l = this.list.length; i < l; i++)
    {
        if (this.list[i] == child)
        {
            return i;
        }
    }
    return -1;
};


BeamBaseLayer.prototype.removeFromListAt = function(index)
{
    if (index >= 0 && index < this.list.length)
    {
        this.list.splice(index, 1);
    }
};


BeamBaseLayer.prototype.addToListAt = function(child, index)
{
    if (index >= 0)
    {
        if (index > this.list.length)
        {
            index = this.list.length;
        }

        this.list.splice(index, 0, child);
    }
};


BeamBaseLayer.prototype.setListDepth = function(child, depth)
{
    var i = this.findListIndex(child);
    if (i != -1 && i != depth)
    {
        this.removeFromListAt(i);
        this.addToListAt(child, depth);
    }
};
