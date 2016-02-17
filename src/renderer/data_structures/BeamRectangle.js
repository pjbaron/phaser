/**
 * 
 * BeamRectangle - defines a rectangle and manipulates it
 *
 */



function BeamRectangle(x, y, width, height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

BeamRectangle.prototype.constructor = BeamRectangle;


BeamRectangle.prototype.contains = function(_x, _y)
{
	// include left edge, exclude right edge
	if (_x < this.x) return false;
	if (_y < this.y) return false;
	if (_x >= this.x + this.width) return false;
	if (_y >= this.y + this.height) return false;
	return true;
};

