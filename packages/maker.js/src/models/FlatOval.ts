
namespace MakerJs.models {

    export class FlatOval implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, radius: number) {
            this.paths = new MakerJs.models.Belt(width, width / 2, radius).paths;
        }
    }

    (<IKit>FlatOval).metaParameters = [
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Radius", type: "range", min: 1, max: 20, value: 10 }
    ];

}
