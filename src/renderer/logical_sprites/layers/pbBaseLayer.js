/**
 *
 * pbBaseLayer - Base class for Layers, contains one layer of multiple pbTransformObject objects.
 * Extends pbTransformObject
 * 
 */


function pbBaseLayer()
{
	this.superCall(pbBaseLayer, 'constructor');

	this.list = null;
	this.parent = null;
	this.phaserRender = null;
	this.clip = null;
}

// pbBaseLayer extends from the pbTransformObject prototype chain
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
pbBaseLayer.prototype = new pbTransformObject();
pbBaseLayer.prototype.constructor = pbBaseLayer;
pbBaseLayer.prototype.__super__ = pbTransformObject;


pbBaseLayer.prototype.create = function(_parent, _renderer, _x, _y, _z, _angleInRadians, _scaleX, _scaleY)
{
	// console.log("pbBaseLayer.create", _x, _y);
	
	// call the pbTransformObject create for this pbBaseLayer
	this.superCall(pbBaseLayer, 'create', null, _x, _y, _z, _angleInRadians, _scaleX, _scaleY);

	// TODO: add pass-through option so that layers can choose not to inherit their parent's transforms and will use the pbPhaserRender.rootLayer transform instead
	// TODO: pbBaseLayer is rotating around it's top-left corner (because there's no width/height and no anchor point??)

	this.phaserRender = _renderer;

	this.parent = _parent;
	this.list = [];
};


pbBaseLayer.prototype.setClipping = function(_x, _y, _width, _height)
{
	this.clip = new pbRectangle(_x, _y, _width, _height);
};


pbBaseLayer.prototype.destroy = function()
{
	// call the pbTransformObject destroy for this pbBaseLayer
	this.superCall(pbBaseLayer, 'destroy');

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


pbBaseLayer.prototype.render = function(_drawList)
{
	// console.log("pbBaseLayer.update");
	// call the pbTransformObject update for this pbBaseLayer to access the child hierarchy
	this.superCall(pbBaseLayer, 'render', _drawList);
};


pbBaseLayer.prototype.draw = function(_list)
{
	var obj = _list[0];
	var srf = obj.image.surface;
	
	// debug sprite count
	pbPhaserRender.sprCountDbg += _list.length;

	if (_list.length === 1)
	{
		if (obj.image.onGPU)
		{
			pbPhaserRender.renderer.graphics.drawTextureWithTransform( obj.image.onGPU, obj.transform, obj.z_order, { x:obj.image.anchorX, y:obj.image.anchorY } );
		}
		else if (srf.rttTexture)
		{
			// TODO: fix hard-wired anchorX, anchorY
			pbPhaserRender.renderer.graphics.drawTextureWithTransform( srf.rttTexture, obj.transform, obj.z_order, { x:0.5, y:1.0 } );
		}
		else if (obj.image.isModeZ)
		{
			pbPhaserRender.renderer.graphics.drawModeZ( 0, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.is3D)
		{
			pbPhaserRender.renderer.graphics.drawImageWithTransform3D( 0, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.toTexture != -1)
		{
			// TODO: fix hard-wired width,height
			pbPhaserRender.renderer.graphics.drawImageToTextureWithTransform( 0, obj.image.toTexture, 256, 256, obj.image, obj.transform, obj.z_order );
		}
		else if (obj.image.fromCanvas)
		{
			pbPhaserRender.renderer.graphics.drawCanvasWithTransform( obj.image.fromCanvas, true, obj.transform, obj.z_order, obj.image.anchor );
		}
		else
		{
			// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
			pbPhaserRender.renderer.graphics.drawImageWithTransform( 0, obj.image, obj.transform, obj.z_order );
		}
	}
	else if (obj.image.isParticle)
	{
		// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
		pbPhaserRender.renderer.graphics.blitDrawImages( 0, _list, obj.image.surface );
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
				pbPhaserRender.renderer.graphics.drawTextureWithTransform( obj.image.onGPU, obj.transform, obj.z_order, { x:obj.image.anchorX, y:obj.image.anchorY } );
			}
		}
		else if (srf.rttTexture)
		{
			pbPhaserRender.renderer.graphics.rawBatchDrawTextures( _list );
		}
		else
		{
			// NOTE: use of TEXTURE0 is hard-wired for general sprite drawing
			pbPhaserRender.renderer.graphics.rawBatchDrawImages( 0, _list );
		}
	}
};


/**
 * override the pbTransformObject addChild function to handle case where a pbBaseLayer is added to a pbBaseLayer
 * in that case it should go into list instead of children in order to provide the correct order of processing
 *
 * @param {[type]} _child [description]
 */
pbBaseLayer.prototype.addChild = function( _child )
{
	// console.log("pbBaseLayer.addChild", this.list.length);

	// TODO: debug only, catches hard to track error that can propagate down through multiple layers and sprites hierarchies
	if (_child === undefined || _child === null)
		alert("ERROR: pbBaseLayer.addChild received an invalid _child", _child);

	if ((_child instanceof Phaser.Group) || (_child instanceof pbBaseLayer) || (_child instanceof pbCanvasLayer) || (_child instanceof pbWebGlLayer) || (_child instanceof pbSimpleLayer))
	{
		this.list.push( _child );
		_child.parent = this;
	}
	else
	{
		// call the superCall.addChild function
		this.superCall(pbBaseLayer, 'addChild', _child);
	}
};


pbBaseLayer.prototype.removeChild = function( _child )
{
	// console.log("pbBaseLayer.removeChild", this.list.length);

	if ((_child instanceof pbBaseLayer) || (_child instanceof pbCanvasLayer) || (_child instanceof pbWebGlLayer) || (_child instanceof pbSimpleLayer))
	{
		var index = this.findListIndex(_child);
		this.removeFromListAt(index);
	}
	else
	{
		// call the superCall.removeChild function
		this.superCall(pbBaseLayer, 'removeChild', _child);
	}
};


pbBaseLayer.prototype.findListIndex = function(child)
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


pbBaseLayer.prototype.removeFromListAt = function(index)
{
    if (index >= 0 && index < this.list.length)
    {
        this.list.splice(index, 1);
    }
};


pbBaseLayer.prototype.addToListAt = function(child, index)
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


pbBaseLayer.prototype.setListDepth = function(child, depth)
{
    var i = this.findListIndex(child);
    if (i != -1 && i != depth)
    {
        this.removeFromListAt(i);
        this.addToListAt(child, depth);
    }
};
