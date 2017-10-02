
let validAssetNames         =   {};
validAssetNames.background  =   {tag:'background', path:'phaser'};
validAssetNames.hexagon     =   {tag:'hexagon', path:'dirt2'};
validAssetNames.marker      =   {tag:'marker', path:'marker'};
validAssetNames.hexMarker   =   {tag:'hexMarker', path:'hexMarker'};
validAssetNames.cube        =   {tag:'cube', path:'cube'};
validAssetNames.redCube     =   {tag:'redCube', path:'redCube'};
validAssetNames.diamond     =   {tag:'diamond', path:'diamond'};
validAssetNames.sphere      =   {tag:'sphere', path:'sphere'};
validAssetNames.triangle    =   {tag:'triangle', path:'triangle'};

AssetLoader = function() {
    this.loadAssets = function(game) {
        Object.keys(validAssetNames).forEach((key) => {
            console.log('key: '+JSON.stringify(key));
            let asset = validAssetNames[key];
            game.load.image(asset.tag, 'assets/'+asset.path+'.png');
        });
    };
};