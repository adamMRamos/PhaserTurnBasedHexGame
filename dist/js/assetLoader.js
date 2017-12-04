
class AssetLoader {
    constructor() {
        this.validAssetNames = {};
        this.validAssetNames.background = {tag: 'background', path: 'phaser'};
        this.validAssetNames.hexagon = {tag: 'hexagon', path: 'dirt2'};
        this.validAssetNames.marker = {tag: 'marker', path: 'marker'};
        this.validAssetNames.hexMarker = {tag: 'hexMarker', path: 'hexMarker'};
        this.validAssetNames.cube = {tag: 'cube', path: 'cube'};
        this.validAssetNames.red_cube = {tag: 'red_cube', path: 'red_cube'};
        this.validAssetNames.sphere = {tag: 'sphere', path: 'sphere'};
        this.validAssetNames.red_sphere = {tag: 'red_sphere', path: 'red_sphere'};
        this.validAssetNames.triangle = {tag: 'triangle', path: 'triangle'};
        this.validAssetNames.red_triangle = {tag: 'red_triangle', path: 'red_triangle'};
        this.validAssetNames.diamond = {tag: 'diamond', path: 'diamond'};
    }

    loadAssets(game) {
        Object.keys(this.validAssetNames).forEach((assetName) => {
            console.log('key: '+JSON.stringify(assetName));
            let asset = this.validAssetNames[assetName];

            game.load.image(asset.tag, 'assets/'+asset.path+'.png');
        });
    };
}