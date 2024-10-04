
namespace MakerJs.models {

    export class Octagon implements IModel {
        public paths: IPathMap = {};

        constructor(sideLength: number) {
            this.paths = new MakerJs.models.Polygon(8, sideLength).paths;
        }
    }

    (<IKit>Octagon).metaParameters = [
        { title: "Side Length", type: "range", min: 1, max: 100, value: 50 }
    ];

}
