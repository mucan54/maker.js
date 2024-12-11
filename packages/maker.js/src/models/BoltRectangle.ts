namespace MakerJs.models {

    export class BoltRectangle implements IModel {

        public paths: IPathMap = {};

        constructor(width: number, height: number, holeRadius: number) {

            var points = [[0, 0], [width, 0], [width, height], [0, height]];
            var ids = ["BottomLeft_bolt", "BottomRight_bolt", "TopRight_bolt", "TopLeft_bolt"];

            this.paths = new Holes(holeRadius, points, ids).paths;
        }
    }

    (<IKit>BoltRectangle).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 100 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Hole Radius", type: "range", unit: "float", min: 1, max: 50, value: 5 }
    ];
}
