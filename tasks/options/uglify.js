
module.exports = {

    custom: {

        options: {
            sourceMap: '<%= sourcemap %>',
            sourceMapName: '<%= compile_dir %>/<%= filename %>.map',
            banner: '/* Phaser v<%= package.version %> - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */\n'
        },

        src: ['<%= concat.custom.dest %>'],
        dest: '<%= compile_dir %>/<%= filename %>.min.js'

    },

    creature: {

        options: {
            sourceMap: '<%= sourcemap %>',
            sourceMapName: '<%= compile_dir %>/creature.map',
            banner: '/* Phaser v<%= package.version %> Creature Build - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */\n'
        },

        src: ['<%= concat.creatureGlobalSplit.dest %>'],
        dest: '<%= compile_dir %>/creature.min.js'

    },

    p2: {

        options: {
            sourceMap: '<%= sourcemap %>',
            sourceMapName: '<%= compile_dir %>/p2.map',
            banner: '/* Phaser v<%= package.version %> P2.JS Build - http://phaser.io - @photonstorm - (c) 2015 Photon Storm Ltd. */\n'
        },

        src: ['<%= concat.p2GlobalSplit.dest %>'],
        dest: '<%= compile_dir %>/p2.min.js'

    }

};
