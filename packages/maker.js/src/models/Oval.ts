namespace MakerJs.models {

    export class Oval implements IModel {

        public paths: IPathMap = {};

        constructor(width: number, height: number) {
            this.paths = new RoundRectangle(width, height, Math.min(height / 2, width / 2)).paths;
        }

    }

    (<IKit>Oval).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 100 }
    ];
}
