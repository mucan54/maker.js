namespace MakerJs.models {

    export class Octagon implements IModel {
        public paths: IPathMap = {};

        constructor(sideLength: number) {
            const numberOfSides = 8;
            const angleToCorner = Math.PI / numberOfSides;
            const radius = sideLength / (2 * Math.sin(angleToCorner));
            const firstCornerAngleInDegrees = 22.5;

            this.paths = new models.Polygon(numberOfSides, radius, firstCornerAngleInDegrees).paths;
        }
    }

    (<IKit>Octagon).metaParameters = [
        { title: "Side Length", type: "range", min: 1, max: 100, value: 20 }
    ];
}