/**
 *
 * BeamBaseGraphics - a drawing API to wrap the canvas, webGL, and anything else we end up with
 *
 *
 */



function BeamBaseGraphics()
{
	this.width = 0;
	this.height = 0;

	this.fillColorString = "#000"; // fill color as a css format color string, # prefixed, rgb(), rgba() or hsl()
	this.fillColorValue = 0; // fill color as a Number
	this.fillColorRGBA = {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	};
	this.lineColorString = "#000"; // line color as a css format color string, # prefixed, rgb(), rgba() or hsl()
	this.lineColorValue = 0; // line color as a Number
	this.lineColorRGBA = {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	};
}


BeamBaseGraphics.prototype.create = function( _canvas )
{
	alert( "ERROR: the selected graphic mode does not extend create from BeamBaseGraphics!" );
};


BeamBaseGraphics.prototype.destroy = function()
{
	console.log( "BeamBaseGraphics.destroy" );
	this.reset();
};


BeamBaseGraphics.prototype.fillStyle = function( color )
{
	if ( typeof color === "number" )
	{
		this.fillColorValue = color;
		this.fillColorString = this.colorNumberToString( color );
		this.fillColorRGBA = this.colorStringToRGBA( this.fillColorString );
	}
	else if ( typeof color === "string" )
	{
		this.fillColorString = color;
		this.fillColorValue = this.colorStringToNumber( color );
		this.fillColorRGBA = this.colorStringToRGBA( this.fillColorString );
	}
};


BeamBaseGraphics.prototype.colorNumberToString = function( colorValue )
{
	return '#' + ( '00000' + ( colorValue | 0 ).toString( 16 ) ).substr( -6 );
};


BeamBaseGraphics.prototype.colorStringToNumber = function( colorString )
{
	return window.parseInt( colorString.slice( 1 ), 16 );
};


BeamBaseGraphics.prototype.colorStringToRGBA = function( hex )
{
	if ( hex.charAt( 0 ) === '#' )
	{
		hex = hex.slice( 1 );
	}

	if ( hex.length === 3 ) // shorthand form (#F26)
	{
		return {
			r: parseInt( hex.charAt( 0 ) + hex.charAt( 0 ), 16 ) / 255,
			g: parseInt( hex.charAt( 1 ) + hex.charAt( 1 ), 16 ) / 255,
			b: parseInt( hex.charAt( 2 ) + hex.charAt( 2 ), 16 ) / 255,
			a: 1.0
		};
	}
	else if ( hex.length === 6 ) // no alpha form (#FE246A)
	{
		return {
			r: parseInt( hex.slice( 0, 2 ), 16 ) / 255,
			g: parseInt( hex.slice( 2, 4 ), 16 ) / 255,
			b: parseInt( hex.slice( 4, 6 ), 16 ) / 255,
			a: 1.0
		};
	}
	else
	{
		return {
			r: parseInt( hex.slice( 0, 2 ), 16 ) / 255,
			g: parseInt( hex.slice( 2, 4 ), 16 ) / 255,
			b: parseInt( hex.slice( 4, 6 ), 16 ) / 255,
			a: parseInt( hex.slice( 6, 8 ), 16 ) / 255
		};
	}
};


/**
 * The graphics drawing interface dummy functions, these must all be overridden (or unused).
 */


BeamBaseGraphics.prototype.preRender = function()
{
	alert( "ERROR: the selected graphic mode does not extend preRender from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.drawImage = function( _x, _y, _z, _surface, _cellFrame, _angle, _scale )
{
	alert( "ERROR: the selected graphic mode does not extend drawImage from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.drawImageWithTransform = function( _textureNumber, _image, _transform, _z_order )
{
	alert( "ERROR: the selected graphic mode does not extend drawImageWithTransform from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitDrawImages = function( _list, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitDrawImages from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.batchDrawImages = function( _list, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend batchDrawImages from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.rawBatchDrawImages = function( _list )
{
	alert( "ERROR: the selected graphic mode does not extend rawBatchDrawImages from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.reset = function()
{
	alert( "ERROR: the selected graphic mode does not extend reset from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.setBackgroundColor = function( color )
{
	alert( "ERROR: the selected graphic mode does not extend setBackgroundColor from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.scissor = function( _x, _y, _width, _height )
{
	alert( "ERROR: the selected graphic mode does not extend scissor from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.drawRect = function( x, y, wide, high, color )
{
	alert( "ERROR: the selected graphic mode does not extend drawRect from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.beginFill = function( _fillColor )
{
	alert( "ERROR: the selected graphic mode does not extend beginFill from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.fillStyle = function( _fillColor, _lineColor )
{
	alert( "ERROR: the selected graphic mode does not extend fillStyle from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.fillRect = function( x, y, wide, high, color, targetWidth, targetHeight )
{
	alert( "ERROR: the selected graphic mode does not extend fillRect from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitSimpleDrawImages = function( _list, _listLength, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitSimpleDrawImages from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitSimpleDrawAnimImages = function( _list, _listLength, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitSimpleDrawAnimImages from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitListDirect = function( _list, _listLength, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitListDirect from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitDrawImagesPoint = function( _list, _listLength, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitDrawImagesPoint from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.blitDrawImagesPointAnim = function( _list, _listLength, _surface )
{
	alert( "ERROR: the selected graphic mode does not extend blitDrawImagesPointAnim from BeamBaseGraphics!" );
};

BeamBaseGraphics.prototype.drawCanvasWithTransform = function( _canvas, _dirty, _transform, _z )
{
	alert( "ERROR: the selected graphic mode does not extend drawCanvasWithTransform from BeamBaseGraphics!" );
};