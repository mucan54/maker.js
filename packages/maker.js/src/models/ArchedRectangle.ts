namespace MakerJs.models {

    export class ArchedRectangle implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, height: number) {
            this.paths = {
                bottom: new paths.Line([0, 0], [width, 0]),
                left: new paths.Line([0, 0], [0, height - width / 2]),
                right: new paths.Line([width, 0], [width, height - width / 2]),
                arc: new paths.Arc([width / 2, height - width / 2], width / 2, 0, 180)
            };
        }
    }

    (<IKit>ArchedRectangle).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 50 }
    ];

}
