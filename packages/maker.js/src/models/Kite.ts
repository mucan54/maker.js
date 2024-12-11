namespace MakerJs.models {

    export class Kite implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, heightTop: number, heightBottom: number) {
            this.paths = {
                topLeft: new paths.Line([-width / 2, 0], [0, heightTop]),
                topRight: new paths.Line([width / 2, 0], [0, heightTop]),
                bottomRight: new paths.Line([width / 2, 0], [0, -heightBottom]),
                bottomLeft: new paths.Line([-width / 2, 0], [0, -heightBottom])
            };
        }
    }

    (<IKit>Kite).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height Top", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height Bottom", type: "range", unit: "float", min: 1, max: 100, value: 50 }
    ];

}
