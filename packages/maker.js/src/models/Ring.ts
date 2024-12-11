namespace MakerJs.models {

    export class Ring implements IModel {

        public paths: IPathMap = {};

        constructor(outerRadius: number, innerRadius?: number) {

            var radii = {
                "Ring_outer": outerRadius,
                "Ring_inner": innerRadius
            };

            for (var id in radii) {
                let r = radii[id];
                if (r === undefined || r <= 0) continue;
                this.paths[id] = new paths.Circle(point.zero(), r);
            }
        }
    }

    (<IKit>Ring).metaParameters = [
        { title: "Outer Radius", type: "range", unit: "float", step: 1, min: 1, max: 100, value: 50 },
        { title: "Inner Radius", type: "range", unit: "float", step: 1, min: 1, max: 100, value: 20 }
    ];
}
