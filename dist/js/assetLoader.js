
class AssetLoader {
    constructor() {
        this.validAssetNames = {};
        this.validAssetNames.background = {tag: 'background', path: 'phaser'};
        this.validAssetNames.hexagon = {tag: 'hexagon', path: 'dirt2'};
        this.validAssetNames.marker = {tag: 'marker', path: 'marker'};
        this.validAssetNames.hexMarker = {tag: 'hexMarker', path: 'hexMarker'};
        this.validAssetNames.cube = {tag: 'cube', path: 'cube'};
        this.validAssetNames.redCube = {tag: 'redCube', path: 'redCube'};
        this.validAssetNames.diamond = {tag: 'diamond', path: 'diamond'};
        this.validAssetNames.sphere = {tag: 'sphere', path: 'sphere'};
        this.validAssetNames.triangle = {tag: 'triangle', path: 'triangle'};
    }

    loadAssets(game) {
        Object.keys(this.validAssetNames).forEach((assetName) => {
            console.log('key: '+JSON.stringify(assetName));
            let asset = this.validAssetNames[assetName];

            game.load.image(asset.tag, 'assets/'+asset.path+'.png');
        });
    };
}