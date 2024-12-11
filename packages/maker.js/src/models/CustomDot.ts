namespace MakerJs.models {

    export class CustomDot implements IModel {
        public paths: IPathMap = {};

        /**
         * Creates a single dot (circle) at a specified location with a specified size.
         * @param x The x-coordinate of the dot's center.
         * @param y The y-coordinate of the dot's center.
         * @param diameter The diameter of the dot.
         * @param scale The scale factor to apply to the size.
         */
        constructor(diameter: number) {
            const radius = (diameter / 2);
            this.paths["customDot"] = new paths.Circle([0, 0], radius);
        }
    }

    (<IKit>CustomDot).metaParameters = [
        { title: "Diameter", type: "range", min: 1, max: 10, value: 2 }
    ];

}
