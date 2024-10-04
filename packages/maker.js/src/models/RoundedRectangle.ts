
namespace MakerJs.models {

    export class RoundedRectangle implements IModel {
        public paths: IPathMap = {};

        constructor(length: number, width: number, radius: number) {
            this.paths = new models.RoundRectangle(length, width, radius).paths;
        }
    }

    (<IKit>RoundedRectangle).metaParameters = [
        { title: "Length", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Radius", type: "range", min: 1, max: 20, value: 10 }
    ];

}
