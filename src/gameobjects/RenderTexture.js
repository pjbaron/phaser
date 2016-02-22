/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// PJBNOTE: this seems to be directly equivalent to something I've been calling RTT (render-to-texture) in the new renderer
// PJBNOTE: unless it adds some new features, the entire class should be deprecated.  Otherwise it may need to extend pbImage and redirect the draw methods
// PJBNOTE: to the special purpose rtt functions in BeamWebGl.js

/**
* A RenderTexture is a special texture that allows any displayObject to be rendered to it. It allows you to take many complex objects and
* render them down into a single quad (on WebGL) which can then be used to texture other display objects with. A way of generating textures at run-time.
* 
* @class Phaser.RenderTexture
* @constructor
* @extends PIXI.RenderTexture
* @param {Phaser.Game} game - Current game instance.
* @param {string} key - Internal Phaser reference key for the render texture.
* @param {number} [width=100] - The width of the render texture.
* @param {number} [height=100] - The height of the render texture.
* @param {string} [key=''] - The key of the RenderTexture in the Cache, if stored there.
* @param {number} [scaleMode=Phaser.scaleModes.DEFAULT] - One of the Phaser.scaleModes consts.
* @param {number} [resolution=1] - The resolution of the texture being generated.
*/
Phaser.RenderTexture = function (game, width, height, key, scaleMode, resolution) {

    if (key === undefined) { key = ''; }
    if (scaleMode === undefined) { scaleMode = Phaser.scaleModes.DEFAULT; }
    if (resolution === undefined) { resolution = 1; }

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {string} key - The key of the RenderTexture in the Cache, if stored there.
    */
    this.key = key;

    /**
    * @property {number} type - Base Phaser object type.
    */
    this.type = Phaser.RENDERTEXTURE;

    /**
    * @property {PIXI.Matrix} matrix - The matrix that is applied when display objects are rendered to this RenderTexture.
    */
// PJBNOTE: see if PIXI.Matrix is 2d or 3d (3 or 4 column homogenous) and use the appropriate version of pbMatrix... check all parameters and method calls
//    this.matrix = new PIXI.Matrix();

    // create a Render-to-Texture of the correct size
    this.rttTextureRegister = 3;
    this.rttTexture = BeamWebGlTextures.initTexture( this.rttTextureRegister, width, height);
    // create a render buffer to match the rtt
    this.rttRenderbuffer = BeamWebGlTextures.initDepth( this.rttTexture );
    // create a framebuffer to reference the texture and render buffer
    this.rttFramebuffer = BeamWebGlTextures.initFramebuffer( this.rttTexture, this.rttRenderbuffer );
    // create a surface to hold the rtt and allow it to be used by this Phaser.Image
    this.rttSurface = new BeamSurface();
    this.rttSurface.createSingle( null, this.rttTexture, this.rttTextureRegister );

    // game, x, y, key, frame
    Phaser.Image.call( this, this.game, 0, 0, this );
    //this.render = Phaser.RenderTexture.prototype.render;

};

Phaser.RenderTexture.prototype = Object.create(Phaser.Image.prototype);
Phaser.RenderTexture.prototype.constructor = Phaser.RenderTexture;

/**
* This function will draw the display object to the RenderTexture at the given coordinates.
*
* When the display object is drawn it takes into account scale and rotation.
*
* If you don't want those then use RenderTexture.renderRawXY instead.
*
* @method Phaser.RenderTexture.prototype.renderXY
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {number} x - The x position to render the object at.
* @param {number} y - The y position to render the object at.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.renderXY = function (displayObject, x, y, clear) {

    displayObject.updateTransform();

    // PJBNOTE: worldTransform was a PIXI property, critical fix needed here
    // this._tempMatrix.copyFrom(displayObject.worldTransform);
    // this._tempMatrix.tx = x;
    // this._tempMatrix.ty = y;

// PJBNOTE: deprecated class?  even if not, the new renderer redirects such drawing calls through an intermediary layer automatically
    // if (this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.renderWebGL(displayObject, this._tempMatrix, clear);
    }
    // else
    // {
    //     this.renderCanvas(displayObject, this._tempMatrix, clear);
    // }

};

/**
* This function will draw the display object to the RenderTexture at the given coordinates.
*
* When the display object is drawn it doesn't take into account scale, rotation or translation.
*
* If you need those then use RenderTexture.renderXY instead.
*
* @method Phaser.RenderTexture.prototype.renderRawXY
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {number} x - The x position to render the object at.
* @param {number} y - The y position to render the object at.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.renderRawXY = function (displayObject, x, y, clear) {

    var srcImage = displayObject.image;
    var transform = BeamMatrix3.makeTransform( x, y, 0, 1, 1);  //this.rttTexture.width/displayObject.width, BeamPhaserRender.height/displayObject.height);

    // TODO: draw the displayObject into the rttTexture at the given offset
    // _surface, _textureWide, _textureHigh, _dstTextureRegister
    //BeamPhaserRender.renderer.graphics.textures.drawSurfaceToExistingTexture(this.rttTexture, this.rttRenderbuffer, displayObject.surface, this.rttTexture.width, this.rttTexture.height, this.rttTextureRegister);

// PJBNOTE: TODO: webgl specific stuff here needs to redirect through 'BeamPhaserRender.renderer.graphics' so it will work with canvas too
    // draw the loaded image into the render-to-texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rttRenderbuffer);

    // TODO: setting the viewport to the texture size means everything has to be scaled up to compensate... try to find another way
    //gl.viewport(0, 0, this.rttTexture.width, this.rttTexture.height);

    //BeamPhaserRender.renderer.graphics.drawTextureWithTransform( srcTexture, transform, 1.0, null );
    BeamPhaserRender.renderer.graphics.drawImageWithTransform( 2, srcImage, transform, 1.0 );

    // cancel the framebuffer so that the rest of the drawing goes to the display
    BeamWebGlTextures.cancelFramebuffer();
};

/**
* This function will draw the display object to the RenderTexture.
*
* In versions of Phaser prior to 2.4.0 the second parameter was a Phaser.Point object. 
* This is now a Matrix allowing you much more control over how the Display Object is rendered.
* If you need to replicate the earlier behavior please use Phaser.RenderTexture.renderXY instead.
*
* If you wish for the displayObject to be rendered taking its current scale, rotation and translation into account then either
* pass `null`, leave it undefined or pass `displayObject.worldTransform` as the matrix value.
*
* @method Phaser.RenderTexture.prototype.render
* @param {Phaser.Sprite|Phaser.Image|Phaser.Text|Phaser.BitmapText|Phaser.Group} displayObject - The display object to render to this texture.
* @param {Phaser.Matrix} [matrix] - Optional matrix to apply to the display object before rendering. If null or undefined it will use the worldTransform matrix of the given display object.
* @param {boolean} [clear=false] - If true the texture will be cleared before the display object is drawn.
*/
Phaser.RenderTexture.prototype.render = function (displayObject, matrix, clear) {

    // if (matrix === undefined || matrix === null)
    // {
    // PJBNOTE: worldTransform was a PIXI property, critical fix needed here
        // this._tempMatrix.copyFrom(displayObject.worldTransform);
    // }
    // else
    // {
    //     this._tempMatrix.copyFrom(matrix);
    // }

// PJBNOTE: deprecated class?  even if not, the new renderer redirects such drawing calls through an intermediary layer automatically
    // if (this.renderer.type === PIXI.WEBGL_RENDERER)
    // {
    //     this.renderWebGL(displayObject, this._tempMatrix, clear);
    // }
    // else
    // {
    //     this.renderCanvas(displayObject, this._tempMatrix, clear);
    // }

};



Phaser.RenderTexture.prototype.clear = function()
{
// PJBNOTE: TODO: webgl specific stuff here needs to redirect through 'BeamPhaserRender.renderer.graphics' so it will work with canvas too
    // draw the loaded image into the render-to-texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rttFramebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, this.rttRenderbuffer);

    gl.disable( gl.SCISSOR_TEST );
    gl.viewport( 0, 0, this.rttTexture.width, this.rttTexture.height);
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
};


/**
 * postUpdate - switch the frame buffer back to default drawing after drawing to the rtt texture
 *
 */
Phaser.RenderTexture.prototype.postUpdate = function()
{
    // don't render to texture any more, render to the display instead
    BeamWebGlTextures.cancelFramebuffer();

    // draw the rtttexture to the display
    // _texture, _transform, _z
    BeamPhaserRender.renderer.graphics.drawTextureWithTransform( this.rttTexture, this.transform, 1.0 );
};
