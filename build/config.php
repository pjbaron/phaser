<?php
    if (!isset($path))
    {
        $path = '..';
    }

    if (!isset($p2))
    {
        $p2 = true;
    }

    if (!isset($box2d))
    {
        $box2d = false;
    }

    if (!isset($ninja))
    {
        $ninja = false;
    }

    if (!isset($arcade))
    {
        $arcade = true;
    }

    if ($p2)
    {
        echo "    <script src=\"$path/src/physics/p2/p2.js\"></script>";
    }

    if ($box2d)
    {
        echo "    <script src=\"$box2dpath/box2d-html5.js\"></script>";
    }

    echo <<<EOL

    <script src="$path/src/renderer/lib/dat.gui.js"></script>
    <script src="$path/src/renderer/lib/stats.js"></script>
    <script src="$path/src/renderer/lib/jszip.js"></script>

    <script src="$path/src/renderer/data_structures/pbMatrix3.js"></script>
    <script src="$path/src/renderer/data_structures/pbMatrix4.js"></script>
    <script src="$path/src/renderer/data_structures/pbRectangle.js"></script>
    <script src="$path/src/renderer/data_structures/pbDictionary.js"></script>

    <script src="$path/src/renderer/root/pbPhaserRender.js"></script>
    <script src="$path/src/renderer/root/pbRenderer.js"></script>
    <script src="$path/src/renderer/root/pbRootTimer.js"></script>

    <script src="$path/src/renderer/textures/pbSurface.js"></script>
    <script src="$path/src/renderer/textures/pbTextures.js"></script>
    <script src="$path/src/renderer/textures/webgl/pbWebGlTextures.js"></script>

    <script src="$path/src/renderer/logical_sprites/pbSprite.js"></script>
    <script src="$path/src/renderer/logical_sprites/pbTransformObject.js"></script>
    <script src="$path/src/renderer/logical_sprites/layers/pbBaseLayer.js"></script>
    <script src="$path/src/renderer/logical_sprites/layers/pbSimpleLayer.js"></script>
    <script src="$path/src/renderer/logical_sprites/layers/canvas/pbCanvasLayer.js"></script>
    <script src="$path/src/renderer/logical_sprites/layers/webgl/pbWebGlLayer.js"></script>
    <script src="$path/src/renderer/logical_sprites/images/pbBaseImage.js"></script>
    <script src="$path/src/renderer/logical_sprites/images/canvas/pbCanvasImage.js"></script>
    <script src="$path/src/renderer/logical_sprites/images/webgl/pbWebGlImage.js"></script>

    <script src="$path/src/renderer/renderers/pbBaseGraphics.js"></script>
    <script src="$path/src/renderer/renderers/canvas/pbCanvas.js"></script>
    <script src="$path/src/renderer/renderers/webgl/pbWebGl.js"></script>
    <script src="$path/src/renderer/renderers/webgl/pbWebGlDrawImageSingle.js"></script>
    <script src="$path/src/renderer/renderers/webgl/pbWebGlDrawTextureSingle.js"></script>
    <script src="$path/src/renderer/renderers/webgl/pbWebGlDrawBatch.js"></script>
    <script src="$path/src/renderer/renderers/webgl/shaders/pbWebGlShaders.js"></script>
    
    <script src="$path/src/renderer/file_handling/pbLoader.js"></script>

    <script src="$path/src/renderer/features/pbText.js"></script>
    <script src="$path/src/renderer/features/pbTiles.js"></script>
    <script src="$path/src/renderer/features/pbButtons.js"></script>

    <script src="$path/src/renderer/creature/gl-matrix-min.js"></script>
    <script src="$path/src/renderer/creature/CreatureMeshBone.js"></script>
    <script src="$path/src/renderer/creature/CreaturePhaser3JSRenderer.js"></script>
    <script src="$path/src/renderer/creature/pbCreatureHandler.js"></script>
    <script src="$path/src/renderer/creature/pbCreatureAssist.js"></script>



    <script src="$path/src/Phaser.js"></script>
    <script src="$path/src/utils/Utils.js"></script>

    <script src="$path/src/geom/Circle.js"></script>
    <script src="$path/src/geom/Point.js"></script>
    <script src="$path/src/geom/Rectangle.js"></script>
    <script src="$path/src/geom/Line.js"></script>
    <script src="$path/src/geom/Ellipse.js"></script>
    <script src="$path/src/geom/Polygon.js"></script>

    <script src="$path/src/core/Camera.js"></script>
    <script src="$path/src/core/State.js"></script>
    <script src="$path/src/core/StateManager.js"></script>
    <script src="$path/src/core/ArrayList.js"></script>
    <script src="$path/src/core/LinkedList.js"></script>
    <script src="$path/src/core/Signal.js"></script>
    <script src="$path/src/core/SignalBinding.js"></script>
    <script src="$path/src/core/Filter.js"></script>
    <script src="$path/src/core/Plugin.js"></script>
    <script src="$path/src/core/PluginManager.js"></script>
    <script src="$path/src/core/Stage.js"></script>
    <script src="$path/src/core/Group.js"></script>
    <script src="$path/src/core/World.js"></script>
    <script src="$path/src/core/Game.js"></script>
    <script src="$path/src/core/FlexGrid.js"></script>
    <script src="$path/src/core/FlexLayer.js"></script>
    <script src="$path/src/core/ScaleManager.js"></script>

    <script src="$path/src/input/Input.js"></script>
    <script src="$path/src/input/Key.js"></script>
    <script src="$path/src/input/Keyboard.js"></script>
    <script src="$path/src/input/Mouse.js"></script>
    <script src="$path/src/input/MSPointer.js"></script>
    <script src="$path/src/input/Pointer.js"></script>
    <script src="$path/src/input/Touch.js"></script>
    <script src="$path/src/input/Gamepad.js"></script>
    <script src="$path/src/input/SinglePad.js"></script>
    <script src="$path/src/input/GamepadButton.js"></script>
    <script src="$path/src/input/InputHandler.js"></script>

    <script src="$path/src/gameobjects/Events.js"></script>
    <script src="$path/src/gameobjects/GameObjectCreator.js"></script>
    <script src="$path/src/gameobjects/GameObjectFactory.js"></script>
    <script src="$path/src/gameobjects/BitmapData.js"></script>
    <script src="$path/src/gameobjects/Sprite.js"></script>
    <script src="$path/src/gameobjects/Image.js"></script>
    <script src="$path/src/gameobjects/TileSprite.js"></script>
    <script src="$path/src/gameobjects/Text.js"></script>
    <script src="$path/src/gameobjects/BitmapText.js"></script>
    <script src="$path/src/gameobjects/Button.js"></script>
    <script src="$path/src/gameobjects/Graphics.js"></script>
    <script src="$path/src/gameobjects/RenderTexture.js"></script>
    <script src="$path/src/gameobjects/SpriteBatch.js"></script>
    <script src="$path/src/gameobjects/RetroFont.js"></script>
    <script src="$path/src/gameobjects/Particle.js"></script>
    <script src="$path/src/gameobjects/Rope.js"></script>

    <script src="$path/src/system/DOM.js"></script>
    <script src="$path/src/system/Canvas.js"></script>
    <script src="$path/src/system/Device.js"></script>
    <script src="$path/src/system/RequestAnimationFrame.js"></script>

    <script src="$path/src/math/Math.js"></script>
    <script src="$path/src/math/RandomDataGenerator.js"></script>
    <script src="$path/src/math/QuadTree.js"></script>

    <script src="$path/src/net/Net.js"></script>

    <script src="$path/src/tween/TweenManager.js"></script>
    <script src="$path/src/tween/Tween.js"></script>
    <script src="$path/src/tween/Easing.js"></script>

    <script src="$path/src/time/Time.js"></script>
    <script src="$path/src/time/Timer.js"></script>
    <script src="$path/src/time/TimerEvent.js"></script>

    <script src="$path/src/animation/AnimationManager.js"></script>
    <script src="$path/src/animation/Animation.js"></script>
    <script src="$path/src/animation/Frame.js"></script>
    <script src="$path/src/animation/FrameData.js"></script>
    <script src="$path/src/animation/AnimationParser.js"></script>

    <script src="$path/src/loader/Cache.js"></script>
    <script src="$path/src/loader/Loader.js"></script>
    <script src="$path/src/loader/LoaderParser.js"></script>

    <script src="$path/src/sound/AudioSprite.js"></script>
    <script src="$path/src/sound/Sound.js"></script>
    <script src="$path/src/sound/SoundManager.js"></script>

    <script src="$path/src/utils/Debug.js"></script>
    <script src="$path/src/utils/Color.js"></script>

    <script src="$path/src/physics/Physics.js"></script>

    <script src="$path/src/particles/Particles.js"></script>
    <script src="$path/src/particles/arcade/ArcadeParticles.js"></script>
    <script src="$path/src/particles/arcade/Emitter.js"></script>

    <script src="$path/src/tilemap/Tile.js"></script>
    <script src="$path/src/tilemap/Tilemap.js"></script>
    <script src="$path/src/tilemap/TilemapLayer.js"></script>
    <script src="$path/src/tilemap/TilemapParser.js"></script>
    <script src="$path/src/tilemap/Tileset.js"></script>
EOL;

    if ($arcade)
    {
        echo <<<EOL

    <script src="$path/src/physics/arcade/World.js"></script>
    <script src="$path/src/physics/arcade/Body.js"></script>
EOL;
    }


    if ($p2)
    {
        echo <<<EOL

    <script src="$path/src/physics/p2/World.js"></script>
    <script src="$path/src/physics/p2/FixtureList.js"></script>
    <script src="$path/src/physics/p2/PointProxy.js"></script>
    <script src="$path/src/physics/p2/InversePointProxy.js"></script>
    <script src="$path/src/physics/p2/Body.js"></script>
    <script src="$path/src/physics/p2/BodyDebug.js"></script>
    <script src="$path/src/physics/p2/Spring.js"></script>
    <script src="$path/src/physics/p2/RotationalSpring.js"></script>
    <script src="$path/src/physics/p2/Material.js"></script>
    <script src="$path/src/physics/p2/ContactMaterial.js"></script>
    <script src="$path/src/physics/p2/CollisionGroup.js"></script>
    <script src="$path/src/physics/p2/DistanceConstraint.js"></script>
    <script src="$path/src/physics/p2/GearConstraint.js"></script>
    <script src="$path/src/physics/p2/LockConstraint.js"></script>
    <script src="$path/src/physics/p2/PrismaticConstraint.js"></script>
    <script src="$path/src/physics/p2/RevoluteConstraint.js"></script>
EOL;
    }

    if ($ninja)
    {
        echo <<<EOL

    <script src="$path/src/physics/arcade/World.js"></script>
    <script src="$path/src/physics/arcade/Body.js"></script>

    <script src="$path/src/physics/ninja/World.js"></script>
    <script src="$path/src/physics/ninja/Body.js"></script>
    <script src="$path/src/physics/ninja/AABB.js"></script>
    <script src="$path/src/physics/ninja/Tile.js"></script>
    <script src="$path/src/physics/ninja/Circle.js"></script>
EOL;
    }

    if ($box2d)
    {
        echo <<<EOL

    <script src="$box2dpath/World.js"></script>
    <script src="$box2dpath/Body.js"></script>
    <script src="$box2dpath/PointProxy.js"></script>
    <script src="$box2dpath/DefaultDebugDraw.js"></script>
    <script src="$box2dpath/DefaultContactListener.js"></script>
    <script src="$box2dpath/Polygon.js"></script>
EOL;
    }

    if (isset($custom))
    {
        for ($i = 0; $i < count($custom); $i++)
        {
            echo '    <script src="' . $custom[$i] . '"></script>' . "\n";
        }
    }
?>