require.config({
  shim: {
    'Phaser': {
      exports: 'Phaser'
    }
  },
  insertRequire: ['index.js']
});