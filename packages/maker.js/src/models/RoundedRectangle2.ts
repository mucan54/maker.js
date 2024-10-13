namespace MakerJs.models {

    export class RoundedRectangle2 implements IModel {
        public paths: IPathMap = {};

        /**
         * Constructor for a RoundedRectangle with individual radii for each corner.
         * @param length The length of the rectangle.
         * @param width The width of the rectangle.
         * @param radii An array of 4 numbers representing the radius of each corner in the following order:
         * [top-left, top-right, bottom-right, bottom-left].
         */
        constructor(length: number, width: number, radii: [number, number, number, number]) {
            this.paths = {};

            // Define corner radii
            const [tlRadius, trRadius, brRadius, blRadius] = radii;

            // Top-left corner (rounded)
            if (tlRadius > 0) {
                this.paths['topLeftArc'] = new paths.Arc([tlRadius, tlRadius], tlRadius, 180, 270);
            } else {
                this.paths['topLeft'] = new paths.Line([0, 0], [tlRadius, tlRadius]);
            }

            // Top-right corner (rounded)
            if (trRadius > 0) {
                this.paths['topRightArc'] = new paths.Arc([length - trRadius, trRadius], trRadius, 270, 360);
            } else {
                this.paths['topRight'] = new paths.Line([length, 0], [length - trRadius, trRadius]);
            }

            // Bottom-right corner (rounded)
            if (brRadius > 0) {
                this.paths['bottomRightArc'] = new paths.Arc([length - brRadius, width - brRadius], brRadius, 0, 90);
            } else {
                this.paths['bottomRight'] = new paths.Line([length, width], [length - brRadius, width - brRadius]);
            }

            // Bottom-left corner (rounded)
            if (blRadius > 0) {
                this.paths['bottomLeftArc'] = new paths.Arc([blRadius, width - blRadius], blRadius, 90, 180);
            } else {
                this.paths['bottomLeft'] = new paths.Line([0, width], [blRadius, width - blRadius]);
            }

            // Define straight edges between corners
            this.paths['topEdge'] = new paths.Line([tlRadius, 0], [length - trRadius, 0]);
            this.paths['rightEdge'] = new paths.Line([length, trRadius], [length, width - brRadius]);
            this.paths['bottomEdge'] = new paths.Line([length - brRadius, width], [blRadius, width]);
            this.paths['leftEdge'] = new paths.Line([0, width - blRadius], [0, tlRadius]);
        }
    }

    // Meta parameters for UI interaction (you can define ranges and default values for radii)
    (<IKit>RoundedRectangle2).metaParameters = [
        { title: "Length", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Top-Left Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Top-Right Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Bottom-Right Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Bottom-Left Radius", type: "range", min: 0, max: 20, value: 10 }
    ];
}
