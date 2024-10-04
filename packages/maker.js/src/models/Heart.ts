
namespace MakerJs.models {

    export class Heart implements IModel {
        public paths: IPathMap = {};

        constructor(r: number, a2: number) {
            const makerjs = require('makerjs');

            var a = a2 / 2;
            var a_radians = makerjs.angle.toRadians(a);
            var x = Math.cos(a_radians) * r;
            var y = Math.sin(a_radians) * r;
            var z = makerjs.solvers.solveTriangleASA(90, 2 * r, 90 - a);

            this.paths.arc1 = new makerjs.paths.Arc([x, 0], r, -a, 180 - a);
            this.paths.line1 = new makerjs.paths.Line([x * 2, -y], [0, -z + y]);

            this.paths.arc2 = makerjs.path.mirror(this.paths.arc1, true, false);
            this.paths.line2 = makerjs.path.mirror(this.paths.line1, true, false);
        }
    }

    (<IKit>Heart).metaParameters = [
        { title: "Radius", type: "range", min: 1, max: 100, value: 50 },
        { title: "Angle", type: "range", min: 1, max: 180, value: 45 }
    ];

}
