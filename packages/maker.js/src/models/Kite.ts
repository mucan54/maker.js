
namespace MakerJs.models {

    export class Kite implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, heightTop: number, heightBottom: number) {
            this.paths = {
                topLeft: new MakerJs.paths.Line([-width / 2, 0], [0, heightTop]),
                topRight: new MakerJs.paths.Line([width / 2, 0], [0, heightTop]),
                bottomLeft: new MakerJs.paths.Line([-width / 2, 0], [0, -heightBottom]),
                bottomRight: new MakerJs.paths.Line([width / 2, 0], [0, -heightBottom])
            };
        }
    }

    (<IKit>Kite).metaParameters = [
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height Top", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height Bottom", type: "range", min: 1, max: 100, value: 50 }
    ];

}
