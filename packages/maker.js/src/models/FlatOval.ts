namespace MakerJs.models {

    export class FlatOval implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, radius: number) {
            this.paths = new models.Belt(width, width / 2, radius).paths;
        }
    }

    (<IKit>FlatOval).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 10 }
    ];

}
