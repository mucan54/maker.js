
namespace MakerJs.models {

    export class Hexagon implements IModel {
        public paths: IPathMap = {};

        constructor(sideLength: number) {
            this.paths = new MakerJs.models.Polygon(6, sideLength).paths;
        }
    }

    (<IKit>Hexagon).metaParameters = [
        { title: "Side Length", type: "range", min: 1, max: 100, value: 50 }
    ];

}
