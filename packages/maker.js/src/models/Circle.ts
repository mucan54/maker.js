
namespace MakerJs.models {

    export class Circle implements IModel {
        public paths: IPathMap = {};

        constructor(diameter: number) {
            this.paths = new MakerJs.models.Circle(diameter / 2).paths;
        }
    }

    (<IKit>Circle).metaParameters = [
        { title: "Diameter", type: "range", min: 1, max: 100, value: 50 }
    ];

}
