/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*
* PJBNOTE: copied directly from PIXI for use with Phaser and the new renderer (it does not have any PIXI dependencies as written)
* PJBNOTE: I would like to use "Phaser.CanvasPool" but that's already being used in a physics file... using the pb prefix until we sort that all out
* 
*/

/**
* The pbCanvasPool is a global static object that allows Phaser to pool canvas DOM elements.
*
* @class pbCanvasPool
* @static
*/
var pbCanvasPool = {

    /**
    * Creates a new Canvas DOM element, or pulls one from the pool if free.
    * 
    * @method create
    * @static
    * @param parent {any} The parent of the canvas element.
    * @param width {number} The width of the canvas element.
    * @param height {number} The height of the canvas element.
    * @return {HTMLCanvasElement} The canvas element.
    */
    create: function (parent, width, height) {

        var idx = pbCanvasPool.getFirst();
        var canvas;

        if (idx === -1)
        {
            var container = {
                parent: parent,
                canvas: document.createElement('canvas')
            };

            pbCanvasPool.pool.push(container);

            canvas = container.canvas;
        }
        else
        {
            pbCanvasPool.pool[idx].parent = parent;

            canvas = pbCanvasPool.pool[idx].canvas;
        }

        if (width !== undefined)
        {
            canvas.width = width;
            canvas.height = height;
        }

        return canvas;

    },

    /**
    * Gets the first free canvas index from the pool.
    * 
    * @method getFirst
    * @static
    * @return {number}
    */
    getFirst: function () {

        var pool = pbCanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === null)
            {
                return i;
            }
        }

        return -1;

    },

    /**
    * Removes the parent from a canvas element from the pool, freeing it up for re-use.
    * 
    * @method remove
    * @param parent {any} The parent of the canvas element.
    * @static
    */
    remove: function (parent) {

        var pool = pbCanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === parent)
            {
                pool[i].parent = null;
            }
        }

    },

    /**
    * Removes the parent from a canvas element from the pool, freeing it up for re-use.
    * 
    * @method removeByCanvas
    * @param canvas {HTMLCanvasElement} The canvas element to remove
    * @static
    */
    removeByCanvas: function (canvas) {

        var pool = pbCanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].canvas === canvas)
            {
                pool[i].parent = null;
            }
        }

    },

    /**
    * Gets the total number of used canvas elements in the pool.
    * 
    * @method getTotal
    * @static
    * @return {number} The number of in-use (parented) canvas elements in the pool.
    */
    getTotal: function () {

        var pool = pbCanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent !== null)
            {
                c++;
            }
        }

        return c;

    },

    /**
    * Gets the total number of free canvas elements in the pool.
    * 
    * @method getFree
    * @static
    * @return {number} The number of free (un-parented) canvas elements in the pool.
    */
    getFree: function () {

        var pool = pbCanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === null)
            {
                c++;
            }
        }

        return c;

    }

};

/**
 * The pool into which the canvas dom elements are placed.
 *
 * @property pool
 * @type Array
 * @static
 */
pbCanvasPool.pool = [];
