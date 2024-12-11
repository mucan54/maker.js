namespace MakerJs.models {

    export class BoltCircle implements IModel {

        public paths: IPathMap = {};

        constructor(boltRadius: number, holeRadius: number, boltCount: number, firstBoltAngleInDegrees: number = 0) {

            var points = Polygon.getPoints(boltCount, boltRadius, firstBoltAngleInDegrees);

            var ids = points.map((p, i) => "bolt " + i);

            this.paths = new Holes(holeRadius, points, ids).paths;
        }
    }

    (<IKit>BoltCircle).metaParameters = [
        { title: "Bolt Circle Radius", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Hole Radius", type: "range", unit: "float", min: 1, max: 50, value: 5 },
        { title: "Bolt Count", type: "range", unit: "int", min: 3, max: 24, value: 12 },
        { title: "Offset Angle", type: "range", unit: "int", min: 0, max: 180, value: 0 }
    ];
}
