/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// PJBNOTE: find out how similar the SpriteBatch class is to the new renderer's built in batching (via layers)... this whole class may be obsolete
// PJBNOTE: this may be more similar to the 'direct pipeline' of the BeamSimpleLayer which is optimised for even faster sprite batching

/**
* The SpriteBatch class is a really fast version of the DisplayObjectContainer built purely for speed, so use when you need a lot of sprites or particles.
* It's worth mentioning that by default sprite batches are used through-out the renderer, so you only really need to use a SpriteBatch if you have over
* 1000 sprites that all share the same texture (or texture atlas). It's also useful if running in Canvas mode and you have a lot of un-rotated or un-scaled
* Sprites as it skips all of the Canvas setTransform calls, which helps performance, especially on mobile devices.
*
* Please note that any Sprite that is part of a SpriteBatch will not have its bounds updated, so will fail checks such as outOfBounds.
*
* @class Phaser.SpriteBatch
* @extends Phaser.Group
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Phaser.Group|Phaser.Sprite|null} parent - The parent Group, DisplayObject or DisplayObjectContainer that this Group will be added to. If `undefined` or `null` it will use game.world.
* @param {string} [name=group] - A name for this Group. Not used internally but useful for debugging.
* @param {boolean} [addToStage=false] - If set to true this Group will be added directly to the Game.Stage instead of Game.World.
*/
Phaser.SpriteBatch = function (game, parent, name, addToStage) {

    if (parent === undefined || parent === null) { parent = game.world; }

// PJBNOTE: call super or merge features as discussed at the top of this class
//    PIXI.SpriteBatch.call(this);

    Phaser.Group.call(this, game, parent, name, addToStage);

    /**
    * @property {number} type - Internal Phaser Type value.
    * @protected
    */
    this.type = Phaser.SPRITEBATCH;

};

// PJBNOTE: CRITICAL CHANGE - need to decide how to handle this class (see comments at top)
//Phaser.SpriteBatch.prototype = Phaser.Utils.extend(true, Phaser.SpriteBatch.prototype, Phaser.Group.prototype, PIXI.SpriteBatch.prototype);

Phaser.SpriteBatch.prototype.constructor = Phaser.SpriteBatch;
