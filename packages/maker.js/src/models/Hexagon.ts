namespace MakerJs.models {

    export class Hexagon implements IModel {
        public paths: IPathMap = {};

        constructor(sideLength: number) {
            const radius = sideLength / Math.sin(Math.PI / 6); // Calculate the radius from side length
            this.paths = new models.Polygon(6, radius).paths;
        }
    }

    (<IKit>Hexagon).metaParameters = [
        { title: "Side Length", type: "range", unit: "float", min: 1, max: 100, value: 50 }
    ];

}
