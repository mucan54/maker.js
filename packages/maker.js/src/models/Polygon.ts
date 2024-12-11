namespace MakerJs.models {
    export class Polygon implements IModel {
        
        public paths: IPathMap = {};

        constructor(numberOfSides: number, radius: number, firstCornerAngleInDegrees?: number, circumscribed?: boolean) {
            this.paths = new ConnectTheDots(true, Polygon.getPoints(numberOfSides, radius, firstCornerAngleInDegrees, circumscribed)).paths;
        }

        public static circumscribedRadius(radius: number, angleInRadians: number) {
            return radius / Math.cos(angleInRadians / 2);
        }

        public static getPoints(numberOfSides: number, radius: number, firstCornerAngleInDegrees = 0, circumscribed = false): IPoint[] {
            var points = [];

            var a1 = angle.toRadians(firstCornerAngleInDegrees);
            var a = 2 * Math.PI / numberOfSides;

            if (circumscribed) {
                radius = Polygon.circumscribedRadius(radius, a);
            }

            for (var i = 0; i < numberOfSides; i++) {
                points.push(point.fromPolar(a * i + a1, radius));
            }

            return points;
        }
    }

    (<IKit>Polygon).metaParameters = [
        { title: "Number of Sides", type: "range", unit: "int", min: 3, max: 24, value: 6 },
        { title: "Radius", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Offset Angle", type: "range", unit: "int", min: 0, max: 180, value: 0 },
        { title: "Radius on flats (vs radius on vertexes)", type: "bool", unit: "int", min: 0, max: 1, value: 0 }
    ];
}
