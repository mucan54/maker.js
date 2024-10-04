
namespace MakerJs.models {

    export class HalfCircle implements IModel {
        public paths: IPathMap = {};

        constructor(diameter: number) {
            this.paths = {
                base: new paths.Line([0, 0], [diameter, 0]),
                arc: new paths.Arc([diameter / 2, 0], diameter / 2, 0, 180)
            };
        }
    }

    (<IKit>HalfCircle).metaParameters = [
        { title: "Diameter", type: "range", min: 1, max: 100, value: 50 }
    ];

}
