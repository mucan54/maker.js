namespace MakerJs.models {

    export class Heart implements IModel {
        public paths: IPathMap = {};

        constructor(height: number) {
            const width = height; // Width is derived from height

            // Calculate the radius based on the height of the heart
            const radius = height / 2;

            // Calculate angles and necessary values
            const halfAngle = 45;  // Fixed angle
            const angleRadians = angle.toRadians(halfAngle);
            const x = Math.cos(angleRadians) * radius;
            const y = Math.sin(angleRadians) * radius;
            const triangleHeight = solvers.solveTriangleASA(90, 2 * radius, 90 - halfAngle);

            // Define paths based on the calculated dimensions
            this.paths.arc1 = new paths.Arc([x, 0], radius, -halfAngle, 180 - halfAngle);
            this.paths.line1 = new paths.Line([x * 2, -y], [0, -triangleHeight + y]);

            // Mirror the arc and line to form the heart
            this.paths.arc2 = path.mirror(this.paths.arc1, true, false);
            this.paths.line2 = path.mirror(this.paths.line1, true, false);
        }
    }

    // Meta parameters for dynamic control
    (<IKit>Heart).metaParameters = [
        { title: "Height", type: "range", min: 1, max: 104, value: 21.4 }
    ];

}
