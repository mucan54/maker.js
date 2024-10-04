
namespace MakerJs.models {

    export class Heart implements IModel {
        public paths: IPathMap = {};

        constructor(r: number, a2: number) {
            

            var a = a2 / 2;
            var a_radians = angle.toRadians(a);
            var x = Math.cos(a_radians) * r;
            var y = Math.sin(a_radians) * r;
            var z = solvers.solveTriangleASA(90, 2 * r, 90 - a);

            this.paths.arc1 = new paths.Arc([x, 0], r, -a, 180 - a);
            this.paths.line1 = new paths.Line([x * 2, -y], [0, -z + y]);

            this.paths.arc2 = path.mirror(this.paths.arc1, true, false);
            this.paths.line2 = path.mirror(this.paths.line1, true, false);
        }
    }

    (<IKit>Heart).metaParameters = [
        { title: "Radius", type: "range", min: 1, max: 100, value: 50 },
        { title: "Angle", type: "range", min: 1, max: 180, value: 45 }
    ];

}
