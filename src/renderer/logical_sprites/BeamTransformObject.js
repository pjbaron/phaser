/**
 *
 * A view-space transform for a sprite or layer, with an optional pbImage attached.
 * 
 */


function BeamTransformObject()
{
	this.alive = false;
	this.visible = false;
	this.x = 0;
	this.y = 0;
	this.z = 1;
	this.rx = 0;
	this.ry = 0;
	this.rz = this.angleInRadians = 0;
	this.scale = null;
	this.scaleZ = 0;
	this.image = null;
	this.children = null;
	this.parent = null;
	this.transform = null;
	this.width = 0;
	this.height = 0;
	this.bounds = null;
}


/**
 * [create description]
 *
 * @param  {[type]} _image          [description]
 * @param  {[type]} _x              [description]
 * @param  {[type]} _y              [description]
 * @param  {Number [0..1]} _z - depth to draw this image at, 0 is in front, 1 is at the back
 * @param  {[type]} _angleInRadians [description]
 * @param  {[type]} _scaleX         [description]
 * @param  {[type]} _scaleY         [description]
 *
 * @return {[type]}                 [description]
 */
BeamTransformObject.prototype.create = function(_image, _x, _y, _z, _angleInRadians, _scaleX, _scaleY)
{
	// console.log("BeamTransformObject.create");

	if (_image === undefined) _image = null;
	if (_x === undefined) _x = 0.0;
	if (_y === undefined) _y = 0.0;
	if (_z === undefined) _z = 1.0;
	if (_angleInRadians === undefined) _angleInRadians = 0;
	if (_scaleX === undefined) _scaleX = 1.0;
	if (_scaleY === undefined) _scaleY = 1.0;

	this.image = _image;

	this.parent = null;
	this.children = [];
	this.alive = true;
	this.visible = true;

	this.x = _x;
	this.y = _y;
	this.z = _z;
	this.angleInRadians = _angleInRadians;
	this.scale = new Phaser.Point(_scaleX, _scaleY);
	if (this.image)
	{
		this.width = this.image.surface.cellSourceSize[this.image.cellFrame].wide;
		this.height = this.image.surface.cellSourceSize[this.image.cellFrame].high;
	}

	this.transform = BeamMatrix3.makeTransform(this.x, this.y, this.angleInRadians, this.scale.x, this.scale.y);
	this.bounds = null;
};


BeamTransformObject.prototype.create3D = function(_image, _x, _y, _z, _rx, _ry, _rz, _scaleX, _scaleY, _scaleZ)
{
	// console.log("BeamTransformObject.create3D");

	if (_image === undefined) _image = null;

	this.image = _image;

	this.parent = null;
	this.children = [];
	this.alive = true;
	this.visible = true;

	this.x = _x;
	this.y = _y;
	this.z = _z;
	this.rx = _rx;
	this.ry = _ry;
	this.rz = _rz;
	this.scaleX = _scaleX;
	this.scaleY = _scaleY;
	this.scaleZ = _scaleZ;

	this.transform = BeamMatrix4.makeTransform(_x, _y, _z, _rx, _ry, _rz, _scaleX, _scaleY, _scaleZ);
	this.bounds = null;
};


BeamTransformObject.prototype.destroy = function( destroyChildren )
{
	var c;

	if ( destroyChildren )
	{
		// destroy all my children too
		for(c = this.children.length - 1; c >= 0; --c)
			this.children[c].destroy();
	}
	else
	{
		while(this.children.length)
			this.removeChild(this.children[this.children.length - 1]);
	}
	this.children = null;

	// remove me from my parent
	if (this.parent)
	{
		if (this.parent.removeChild === undefined)
			alert("Invalid parent type for a BeamTransformObject!\n" + this.parent.constructor.name);
		this.parent.removeChild(this);
	}
	this.parent = null;

	this.image = null;
	this.transform = null;
};


BeamTransformObject.prototype.update = function(_drawDictionary)
{
	if (this.image && this.image.is3D)
		return this.update3D(_drawDictionary);
	return this.update2D(_drawDictionary);
};


BeamTransformObject.prototype.update2D = function(_drawDictionary)
{
	// console.log("BeamTransformObject.update");

	if (!this.alive)
		return true;

	BeamMatrix3.setTransform(this.transform, this.x, this.y, this.angleInRadians, this.scale.x, this.scale.y);

	// multiply with the transform matrix from my parent
	if (this.parent && this.parent.transform)
		BeamMatrix3.setFastMultiply(this.transform, this.parent.transform);
	
	// calculate the bounding rectangle for this object as it is drawn on screen
	this.calculateBounds();

	// draw if this transform object has an image
	if (this.image && this.visible)
		this.image.draw(_drawDictionary, this.transform, this.z);

	// for all of my child transform objects
	var c = this.children.length;
	while(c--)
	{
		var child = this.children[c];

		if (child.visible)
		{
			// update this child
			if (child instanceof BeamTransformObject)
			{
				if (!child.update(_drawDictionary))
				{
					child.destroy();
					this.removeChildAt(c);
				}
			}
			else if ((child instanceof Phaser.Image) || (child instanceof Phaser.Sprite) || (child instanceof Phaser.TileSprite))
			{
				// call all three component Core.update functions
				//child.preUpdate();
				// recurse the display hierarchy
				if (!BeamTransformObject.prototype.update.call(child.transform, _drawDictionary))
				{
					BeamTransformObject.prototype.destroy.call(child.transform);
					BeamTransformObject.prototype.removeChildAt.call(child);
				}
				//child.update();
				//child.postUpdate();
			}
		}
	}

	return true;
};


BeamTransformObject.prototype.update3D = function(_drawDictionary)
{
	// console.log("BeamTransformObject.update3D");

	if (!this.alive)
		return true;

	// set my own transform matrix
	BeamMatrix4.setTransform(this.transform, this.x, this.y, this.z, this.rx, this.ry, this.rz, this.scale.x, this.scale.y, this.scaleZ);
	// multiply with the transform matrix from my parent
	if (this.parent && this.parent.transform)
	{
		// parent layer might not be using 3D, convert it's 2D transformation into 3D
		if (this.parent.transform.length == 9)
			BeamMatrix4.setFastMultiply3(this.transform, this.parent.transform);
		else
			BeamMatrix4.setFastMultiply(this.transform, this.parent.transform);
	}
	
	// calculate the bounding rectangle for this object as it is drawn on screen
	this.calculateBounds();

	// draw if this transform object has an image
	if (this.image)
		this.image.draw(_drawDictionary, this.transform, this.z);

	// for all of my child transform objects
	var c = this.children.length;
	while(c--)
	{
		var child = this.children[c];

		// update this child
		if (child instanceof BeamTransformObject)
		{
			if (!child.update(_drawDictionary))
			{
				child.destroy();
				this.removeChildAt(c);
			}
		}
		else if (child instanceof Phaser.Image)
		{
			if (!BeamTransformObject.prototype.update.call(child.transform, _drawDictionary))
			{
				BeamTransformObject.prototype.destroy.call(child.transform);
				BeamTransformObject.prototype.removeChildAt.call(child);
			}
		}
	}

	return true;
};


BeamTransformObject.prototype._enclosingAABB = function(points, rect)
{
	var minx = Number.POSITIVE_INFINITY, miny = Number.POSITIVE_INFINITY;
	var maxx = Number.NEGATIVE_INFINITY, maxy = Number.NEGATIVE_INFINITY;

	for(var i = 0, l = points.length; i < l; i++)
	{
		if (points[i].x < minx)
		{
			minx = points[i].x;	
		}
		if (points[i].x > maxx)
		{
			maxx = points[i].x;
		}
		if (points[i].y < miny)
		{
			miny = points[i].y;
		}
		if (points[i].y > maxy)
		{
			maxy = points[i].y;
		}
	}

	rect.setTo(minx, miny, maxx - minx, maxy - miny);
};


BeamTransformObject.prototype.calculateBounds = function()
{
	if (!this.bounds)
	{
		// if the object doesn't have an image, it still has a location with zero dimensions
		this.bounds = new Phaser.Rectangle(this.x, this.y, 0, 0);
	}

	if (this.image)
	{
		// get size of image
		var size = this.image.getSize();
		// calculate extents using the image anchor point
		var lft = -size.wide * this.image.anchor.x;
		var top = -size.high * this.image.anchor.y;
		var rgt = lft + size.wide;
		var bot = top + size.high;

		// transform the corners using the matrix
		var p = [];
		p.push( BeamMatrix3.transformPoint(lft, top, this.transform) );
		p.push( BeamMatrix3.transformPoint(rgt, top, this.transform) );
		p.push( BeamMatrix3.transformPoint(rgt, bot, this.transform) );
		p.push( BeamMatrix3.transformPoint(lft, bot, this.transform) );

		// calculate AABB to enclose these four corners
		this._enclosingAABB(p, this.bounds);
	}
};


BeamTransformObject.prototype.kill = function()
{
	this.alive = false;
};


BeamTransformObject.prototype.revive = function()
{
	this.alive = true;
};


BeamTransformObject.prototype.addChild = function(_child)
{
	// console.log("BeamTransformObject.addChild", this.children.length);
	
	this.children.push(_child);
	_child.parent = this;
};


BeamTransformObject.prototype.addChildAt = function(_child, _index)
{
	if (_index <= this.children.length)
	{
		this.children.splice(_index, 0, _child);
		_child.parent = this;
	}
	//else // TODO: error or warning!
};


BeamTransformObject.prototype.removeChild = function(_child)
{
	var index = this.children.indexOf(_child);
	if (index != -1)
	{
		this.removeChildAt(index);
	}
	// else // TODO: error or warning!
};


BeamTransformObject.prototype.removeChildAt = function(_index)
{
	if (this.children.length <= _index) return;
	this.children[_index].parent = null;
	this.children.splice(_index, 1);
};


// update the matrix transform using the current parameter values
// this function should be called after directly adjusting any of x,y,angleInRadians or scale
BeamTransformObject.prototype.updateTransform = function()
{
	this.transform = BeamMatrix3.makeTransform(this.x, this.y, this.angleInRadians, this.scale.x, this.scale.y);
};


// allow this class to be extended
// permits multiple levels of inheritance 	http://jsfiddle.net/ZWZP6/2/  
// improvement over original answer at 		http://stackoverflow.com/questions/7300552/calling-overridden-methods-in-javascript
BeamTransformObject.prototype.superCall = function(clazz, functionName)
{
	// console.log("BeamTransformObject.superCall", functionName);
	var args = Array.prototype.slice.call(arguments, 2);
	clazz.prototype.__super__.prototype[functionName].apply(this, args);
};


BeamTransformObject.prototype.contains = function(_point)
{
	if (this.image)
	{
		var px = _point.x - this.x;
		var py = _point.y - this.y;

		var size = this.image.getSize();
		var wide = size.wide * this.scale.x;
		var x1 = -wide * this.image.anchor.x;

		if (px >= x1 && px < x1 + wide)
		{
			var high = size.high * this.scale.y;
		    var y1 = -high * this.image.anchor.y;

		    if (py >= y1 && py < y1 + high)
		    {
		        return true;
		    }
		}
	}
	return false;
};
