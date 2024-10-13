namespace MakerJs.models {

    export class RoundedRectangle implements IModel {
        public paths: IPathMap = {};

        /**
         * Constructor for a RoundedRectangle with individual radii for each corner.
         * @param length The length of the rectangle.
         * @param width The width of the rectangle.
         * @param tlRadius The radius of the top-left corner.
         * @param trRadius The radius of the top-right corner.
         * @param brRadius The radius of the bottom-right corner.
         * @param blRadius The radius of the bottom-left corner.
         */
        constructor(length: number, width: number, tlRadius: number, trRadius: number, brRadius: number, blRadius: number) {
            this.paths = {};

            // Bottom-left corner (rounded or sharp)
            if (tlRadius > 0) {
                this.paths['bottomLeftArc'] = new paths.Arc([tlRadius, tlRadius], tlRadius, 180, 270);
            } else {
                this.paths['bottomLeft'] = new paths.Line([0, 0], [0, 0]); // Sharp corner at (0, 0)
            }

            // Bottom-right corner (rounded or sharp)
            if (trRadius > 0) {
                this.paths['bottomRightArc'] = new paths.Arc([length - trRadius, tlRadius], trRadius, 270, 360);
            } else {
                this.paths['bottomRight'] = new paths.Line([length, 0], [length, 0]); // Sharp corner at (length, 0)
            }

            // Top-right corner (rounded or sharp)
            if (brRadius > 0) {
                this.paths['topRightArc'] = new paths.Arc([length - brRadius, width - brRadius], brRadius, 0, 90);
            } else {
                this.paths['topRight'] = new paths.Line([length, width], [length, width]); // Sharp corner at (length, width)
            }

            // Top-left corner (rounded or sharp)
            if (blRadius > 0) {
                this.paths['topLeftArc'] = new paths.Arc([blRadius, width - blRadius], blRadius, 90, 180);
            } else {
                this.paths['topLeft'] = new paths.Line([0, width], [0, width]); // Sharp corner at (0, width)
            }

            // Define straight edges between corners
            this.paths['bottomEdge'] = new paths.Line([tlRadius, 0], [length - trRadius, 0]);
            this.paths['rightEdge'] = new paths.Line([length, tlRadius], [length, width - brRadius]);
            this.paths['topEdge'] = new paths.Line([length - brRadius, width], [blRadius, width]);
            this.paths['leftEdge'] = new paths.Line([0, width - blRadius], [0, tlRadius]);
        }
    }

    // Meta parameters for UI interaction (you can define ranges and default values for radii)
    (<IKit>RoundedRectangle).metaParameters = [
        { title: "Length", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Bottom-Left Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Bottom-Right Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Top-Right Radius", type: "range", min: 0, max: 20, value: 10 },
        { title: "Top-Left Radius", type: "range", min: 0, max: 20, value: 10 }
    ];
}
