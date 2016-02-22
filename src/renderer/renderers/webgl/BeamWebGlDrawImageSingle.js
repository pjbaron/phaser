/**
 * pbWebGlDrawImageSingle
 *
 * Contains methods for BeamWebGl which draw a single ImageData or BeamSurface sprite to the webGl display buffer
 *
 */


// single image instances from BeamWebGlLayer
BeamWebGl.prototype.drawImageWithTransform = function( _srcTextureRegister, _image, _transform, _z )
{
	this.shaders.setProgram(this.shaders.imageShaderProgram, _srcTextureRegister);

	if (!this.positionBuffer)
	{
		this.prepareBuffer();
	}

	var surface = _image.surface;
	if (this.textures.prepare( surface.imageData, _image.tiling, surface.isNPOT, _srcTextureRegister ))
	{
		this.shaders.prepare(_srcTextureRegister);
	}

	// split off a small part of the big buffer, for a single display object
	var buffer = this.drawingArray.subarray(0, 16);

	// set up the animation frame
	var cell = Math.floor(_image.cellFrame);

	// protect against invalid cellFrame values
	if ( cell >= 0 && cell < surface.cellTextureBounds.length )
	{
		var rect = surface.cellTextureBounds[cell];

		var wide, high, oWide, oHigh;
		if (_image.fullScreen)
		{
			rect.width = gl.drawingBufferWidth / surface.cellSourceSize[cell].wide;
			rect.height = gl.drawingBufferHeight / surface.cellSourceSize[cell].high;
			oWide = wide = gl.drawingBufferWidth;
			oHigh = high = gl.drawingBufferHeight;
		}
		else
		{
			// width, height (of source frame in source texture)
			wide = surface.cellSourceSize[cell].wide;
			high = surface.cellSourceSize[cell].high;
			oWide = surface.srcSize[cell].wide;
			oHigh = surface.srcSize[cell].high;
		}

		var off = { x:0, y:0 };
		if (surface.cellOffsets)
		{
			off = surface.cellOffsets[cell];
		}

		// screen destination position
		// l, b,		0,1
		// l, t,		4,5
		// r, b,		8,9
		// r, t,		12,13
		var l = -oWide * _image.anchor.x + off.x;
		var r = wide + l;
		var t = -oHigh * _image.anchor.y + off.y;
		var b = high + t;
		if (_image.corners)
		{
			var cnr = _image.corners;
			// object has corner offets (skewing/perspective etc)
			buffer[ 0 ] = cnr.lbx * l; buffer[ 1 ] = cnr.lby * b;
			buffer[ 4 ] = cnr.ltx * l; buffer[ 5 ] = cnr.lty * t;
			buffer[ 8 ] = cnr.rbx * r; buffer[ 9 ] = cnr.rby * b;
			buffer[ 12] = cnr.rtx * r; buffer[ 13] = cnr.rty * t;
		}
		else
		{
			buffer[ 0 ] = buffer[ 4 ] = l;
			buffer[ 1 ] = buffer[ 9 ] = b;
			buffer[ 8 ] = buffer[ 12] = r;
			buffer[ 5 ] = buffer[ 13] = t;
		}

		// texture source position
		// x, b,		2,3
		// x, y,		6,7
		// r, b,		10,11
		// r, y,		14,15
		buffer[ 2 ] = buffer[ 6 ] = rect.x;
		buffer[ 3 ] = buffer[ 11] = rect.y + rect.height;
		buffer[ 10] = buffer[ 14] = rect.x + rect.width;
		buffer[ 7 ] = buffer[ 15] = rect.y;

		// bind the source buffer
		gl.bindBuffer( gl.ARRAY_BUFFER, this.positionBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

		// bind the source texture
		gl.activeTexture(gl.TEXTURE0 + _srcTextureRegister);
		gl.bindTexture(gl.TEXTURE_2D, this.textures.currentSrcTexture);

		// send the transform matrix to the vector shader
		gl.uniformMatrix3fv( this.shaders.getUniform( "uModelMatrix" ), false, _transform );
		// set the depth value
		gl.uniform1f( this.shaders.getUniform( "uZ" ), _z );
		// point the position attribute at the last bound buffer
		gl.vertexAttribPointer( this.shaders.getAttribute( "aPosition" ), 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray(this.shaders.getAttribute( "aPosition" ));
		// draw the buffer: four vertices per quad, one quad
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
};


BeamWebGl.prototype.drawModeZ = function( _textureNumber, _image, _transform, _z )
{
	this.shaders.setProgram(this.shaders.modezShaderProgram, _textureNumber);

	var surface = _image.surface;
	if (this.textures.prepare( surface.imageData, _image.tiling, surface.isNPOT ))
	{
		this.prepareBuffer();
		this.shaders.prepare(_textureNumber);
	}

	// split off a small part of the big buffer, for a single display object
	var buffer = this.drawingArray.subarray(0, 16);

	// set up the animation frame
	var cell = Math.floor(_image.cellFrame);
	var rect = surface.cellTextureBounds[cell];

	var wide, high;
	if (_image.fullScreen)
	{
		rect.width = gl.drawingBufferWidth / surface.cellSourceSize[cell].wide;
		rect.height = gl.drawingBufferHeight / surface.cellSourceSize[cell].high;
		wide = gl.drawingBufferWidth;
		high = gl.drawingBufferHeight;
	}
	else
	{
		// width, height (of source frame)
		wide = surface.cellSourceSize[cell].wide;
		high = surface.cellSourceSize[cell].high;
	}

	// screen destination position
	// l, b,		0,1
	// l, t,		4,5
	// r, b,		8,9
	// r, t,		12,13
	var l, r, t, b;
	if (_image.corners)
	{
		var cnr = _image.corners;
		l = -wide * _image.anchor.x;
		r = wide + l;
		t = -high * _image.anchor.y;
		b = high + t;
		// object has corner offets (skewing/perspective etc)
		buffer[ 0 ] = cnr.lbx * l; buffer[ 1 ] = cnr.lby * b;
		buffer[ 4 ] = cnr.ltx * l; buffer[ 5 ] = cnr.lty * t;
		buffer[ 8 ] = cnr.rbx * r; buffer[ 9 ] = cnr.rby * b;
		buffer[ 12] = cnr.rtx * r; buffer[ 13] = cnr.rty * t;
	}
	else
	{
		l = -wide * _image.anchor.x;
		r = wide + l;
		t = -high * _image.anchor.y;
		b = high + t;
		buffer[ 0 ] = buffer[ 4 ] = l;
		buffer[ 1 ] = buffer[ 9 ] = b;
		buffer[ 8 ] = buffer[ 12] = r;
		buffer[ 5 ] = buffer[ 13] = t;
	}

	// texture source position
	// x, b,		2,3
	// x, y,		6,7
	// r, b,		10,11
	// r, y,		14,15
	buffer[ 2 ] = buffer[ 6 ] = rect.x;
	buffer[ 3 ] = buffer[ 11] = rect.y + rect.height;
	buffer[ 10] = buffer[ 14] = rect.x + rect.width;
	buffer[ 7 ] = buffer[ 15] = rect.y;

	gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

	// send the transform matrix to the vector shader
	gl.uniformMatrix3fv( this.shaders.getUniform( "uModelMatrix" ), false, _transform );

	// set the depth value
	gl.uniform1f( this.shaders.getUniform( "uZ" ), _z );

	// point the position attribute at the last bound buffer
	gl.vertexAttribPointer( this.shaders.getAttribute( "aPosition" ), 4, gl.FLOAT, false, 0, 0 );

//    var ut = this.shaders.getUniform( "uTime" );
//	if (ut) gl.uniform1f( ut, (BeamPhaserRender.frameCount % 100) / 100.0 );

	// four vertices per quad, one quad
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};


// single image instances from BeamWebGlLayer using a 3D projection
BeamWebGl.prototype.drawImageWithTransform3D = function( _textureNumber, _image, _transform, _z )
{
	this.shaders.setProgram(this.shaders.imageShaderProgram3D, _textureNumber);

	var surface = _image.surface;
	if (this.textures.prepare( surface.imageData, _image.tiling, surface.isNPOT ))
	{
		this.prepareBuffer();
		this.shaders.prepare(_textureNumber);
	}

	// split off a small part of the big buffer, for a single display object
	var buffer = this.drawingArray.subarray(0, 16);

	// set up the animation frame
	var cell = Math.floor(_image.cellFrame);
	var rect = surface.cellTextureBounds[cell];

	// width, height (of source frame)
	var wide = surface.cellSourceSize[cell].wide;
	var high = surface.cellSourceSize[cell].high;

	// screen destination position (aPosition.xy in vertex shader)
	// l, b,		0,1
	// l, t,		4,5
	// r, b,		8,9
	// r, t,		12,13
	var l = -wide * _image.anchor.x;
	var t = -high * _image.anchor.y;
	buffer[ 0 ] = buffer[ 4 ] = l;
	buffer[ 1 ] = buffer[ 9 ] = high + t;
	buffer[ 8 ] = buffer[ 12] = wide + l;
	buffer[ 5 ] = buffer[ 13] = t;

	// texture source position (aPosition.zw in vertex shader)
	// x, b,		2,3
	// x, y,		6,7
	// r, b,		10,11
	// r, y,		14,15
	buffer[ 2 ] = buffer[ 6 ] = rect.x;
	buffer[ 3 ] = buffer[ 11] = rect.y + rect.height;
	buffer[ 10] = buffer[ 14] = rect.x + rect.width;
	buffer[ 7 ] = buffer[ 15] = rect.y;

	gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

	// send the transform matrix to the vector shader
	gl.uniformMatrix4fv( this.shaders.getUniform( "uModelMatrix4" ), false, _transform );

	// point the position attribute at the last bound buffer
	gl.vertexAttribPointer( this.shaders.getAttribute( "aPosition" ), 4, gl.FLOAT, false, 0, 0 );

	// four vertices per quad, one quad
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};


// unused at present.  Draws a single image, sends the transform matrix as a uniform.
BeamWebGl.prototype.drawImage = function( _textureNumber, _x, _y, _z, _surface, _cellFrame, _angle, _scale )
{
	this.shaders.setProgram(this.shaders.imageShaderProgram, _textureNumber);

	if (this.textures.prepare( _surface.imageData, null, _surface.isNPOT ))
	{
		this.prepareBuffer();
		this.shaders.prepare(_textureNumber);
	}

	// split off a small part of the big buffer, for a single display object
	var buffer = this.drawingArray.subarray(0, 20);


	// set up the animation frame
	var cell = Math.floor(_cellFrame);
	// half width, half height (of source frame)
	var wide = _surface.cellSourceSize[cell].wide * 0.5;
	var high = _surface.cellSourceSize[cell].high * 0.5;
	var rect = _surface.cellTextureBounds[cell];

	// screen destination position
	// l, b,		0,1
	// l, t,		4,5
	// r, b,		8,9
	// r, t,		12,13
	buffer[ 0 ] = buffer[ 4 ] = -wide;
	buffer[ 1 ] = buffer[ 9 ] =  high;
	buffer[ 8 ] = buffer[ 12] =  wide;
	buffer[ 5 ] = buffer[ 13] = -high;

	// texture source position
	// 0, 0,		2,3
	// 0, 1,		6,7
	// 1, 0,		10,11
	// 1, 1,		14,15
	buffer[ 2 ] = buffer[ 6 ] = rect.x;
	buffer[ 3 ] = buffer[ 11] = rect.y + rect.height;
	buffer[ 10] = buffer[ 14] = rect.x + rect.width;
	buffer[ 7 ] = buffer[ 15] = rect.y;

	gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

	// TODO: most of these are semi-static, cache them
	var matrix = BeamMatrix3.makeTransform(_x, _y, _angle, _scale, _scale);

	// var translationMatrix = BeamMatrix3.makeTranslation(_x, _y);
	// var rotationMatrix = BeamMatrix3.makeRotation(_angle);
	// var scaleMatrix = BeamMatrix3.makeScale(_scale, _scale);

	// var matrix = BeamMatrix3.fastMultiply(rotationMatrix, scaleMatrix);
	// matrix = BeamMatrix3.fastMultiply(matrix, translationMatrix);

	// send the matrix to the vector shader
	gl.uniformMatrix3fv( this.shaders.getUniform( "uModelMatrix" ), false, matrix );

	// set the depth value
	gl.uniform1f( this.shaders.getUniform( "uZ" ), _z );

	// point the position attribute at the last bound buffer
	gl.vertexAttribPointer( this.shaders.getAttribute( "aPosition" ), 4, gl.FLOAT, false, 0, 0 );

	// four vertices per quad, one quad
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
};


// pbCanvasToGlDemo and pbGlToCanvasDemo.  Uses imageShaderProgram to draw after transfering the canvas data to gl.
BeamWebGl.prototype.drawCanvasWithTransform = function( _canvas, _dirty, _transform, _z, _anchor )
{
	this.shaders.setProgram(this.shaders.imageShaderProgram);

	if ( _dirty || !this.textures.currentSrcTexture || this.textures.currentSrcTexture.canvas !== _canvas )
	{
		// create a webGl texture from the canvas
		this.canvasTextureNumber = 0;
		this.textures.createTextureFromCanvas(this.canvasTextureNumber, _canvas);
		// set the fragment shader sampler to use TEXTURE0
		gl.uniform1i( this.shaders.getSampler(), this.canvasTextureNumber );
		// prepare the projection matrix in the vertex shader
		gl.uniformMatrix3fv( this.shaders.getUniform( "uProjectionMatrix" ), false, BeamMatrix3.makeProjection(gl.drawingBufferWidth, gl.drawingBufferHeight) );
	}

	// split off a small part of the big buffer, for a single display object
	var buffer = this.drawingArray.subarray(0, 16);

	// source rectangle
	var rect = new BeamRectangle(0, 0, 1, 1);

	// half width, half height (of source frame)
	var wide, high;
	wide = _canvas.width;
	high = _canvas.height;

	var anchorX, anchorY;
	if (_anchor)
	{
		anchorX = _anchor.x;
		anchorY = _anchor.y;
	}
	else
	{
		anchorX = 0.5;
		anchorY = 0.5;
	}

	// screen destination position
	// l, b,		0,1
	// l, t,		4,5
	// r, b,		8,9
	// r, t,		12,13
	var l = -wide * anchorX;
	var r = wide + l;
	var t = -high * anchorY;
	var b = high + t;
	buffer[ 0 ] = buffer[ 4 ] = l;
	buffer[ 1 ] = buffer[ 9 ] = b;
	buffer[ 8 ] = buffer[ 12] = r;
	buffer[ 5 ] = buffer[ 13] = t;

	// texture source position
	// x, b,		2,3
	// x, y,		6,7
	// r, b,		10,11
	// r, y,		14,15
	buffer[ 2 ] = buffer[ 6 ] = rect.x;
	buffer[ 3 ] = buffer[ 11] = rect.y + rect.height;
	buffer[ 10] = buffer[ 14] = rect.x + rect.width;
	buffer[ 7 ] = buffer[ 15] = rect.y;

	gl.bufferData( gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW );

	// send the transform matrix to the vector shader
	gl.uniformMatrix3fv( this.shaders.getUniform( "uModelMatrix" ), false, _transform );

	// set the depth value
	gl.uniform1f( this.shaders.getUniform( "uZ" ), _z );

	// point the position attribute at the last bound buffer
	gl.vertexAttribPointer( this.shaders.getAttribute( "aPosition" ), 4, gl.FLOAT, false, 0, 0 );

	// four vertices per quad, one quad
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	// clean up after draw (if we wait for GC then sometimes webgl will throw "context lost" errors!)
	if (this.textures.currentSrcTexture)
	{
		gl.deleteTexture(this.textures.currentSrcTexture);
	}
};


