/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Smoothed component allows a Game Object to control anti-aliasing of an image based texture.
*
* @class
*/
Phaser.Component.Smoothed = function () {};

Phaser.Component.Smoothed.prototype = {

    /**
    * Enable or disable texture smoothing for this Game Object.
    * 
    * It only takes effect if the Game Object is using an image based texture.
    * 
    * Smoothing is enabled by default.
    *
    * @property {boolean} smoothed
    */
    smoothed: {

        get: function () {

            // PJBNOTE: new renderer does not support smoothing yet, and does not possess the baseTexture member in pbSurface
            return 0;
            //return !this.texture.baseTexture.scaleMode;

        },

        set: function (value) {

            if (value)
            {
                if (this.texture)
                {
                    // PJBNOTE: new renderer does not support smoothing yet, and does not possess the baseTexture member in pbSurface
                    // this.texture.baseTexture.scaleMode = 0;
                }
            }
            else
            {
                if (this.texture)
                {
                    // PJBNOTE: new renderer does not support smoothing yet, and does not possess the baseTexture member in pbSurface
                    // this.texture.baseTexture.scaleMode = 1;
                }
            }
        }

    }

};
