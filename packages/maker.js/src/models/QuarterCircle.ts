
namespace MakerJs.models {

    export class QuarterCircle implements IModel {
        public paths: IPathMap = {};

        constructor(radius: number) {
            this.paths = {
                base: new paths.Line([0, 0], [radius, 0]),
                height: new paths.Line([0, 0], [0, radius]),
                arc: new paths.Arc([0, 0], radius, 0, 90)
            };
        }
    }

    (<IKit>QuarterCircle).metaParameters = [
        { title: "Radius", type: "range", min: 1, max: 100, value: 50 }
    ];

}
