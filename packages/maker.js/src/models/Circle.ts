namespace MakerJs.models {

    export class Circle implements IModel {
        public paths: IPathMap = {};
        public annotations: any = {}; // Assuming annotations will be an object, update based on your usage.

        constructor(options: { diameter?: number, canvasWidth: number, canvasHeight: number }) {
            const diameter = options.diameter || 80; // Default to 80 if diameter is not provided
            const canvasWidth = options.canvasWidth;
            const canvasHeight = options.canvasHeight;

            // Create the circle path
            this.paths["circle"] = new paths.Circle([0, 0], diameter / 2);

            // Calculate the object's width and height
            const objectWidth = diameter;
            const objectHeight = diameter;

            // Translate the object to the center of the canvas
            const translateX = (canvasWidth - objectWidth) / 2;
            const translateY = (canvasHeight - objectHeight) / 2;

            // Generate annotations (assuming generateAnnotationsForCircle is a method you implement elsewhere)
            this.annotations = this.generateAnnotationsForCircle(translateX, translateY, objectWidth);

            // Move the circle to the new position on the canvas
            MakerJs.model.move(this, [translateX, translateY]);
        }

        // Assuming this is a method you implement that generates annotations for the circle
        private generateAnnotationsForCircle(x: number, y: number, diameter: number) {
            // Add logic for generating annotations based on x, y, and diameter
            return {
                centerX: x + diameter / 2,
                centerY: y + diameter / 2,
                diameter
            };
        }
    }

    (<IKit>Circle).metaParameters = [
        { title: "Diameter", type: "range", min: 1, max: 100, value: 80 },
        { title: "Canvas Width", type: "range", min: 100, max: 1000, value: 500 },
        { title: "Canvas Height", type: "range", min: 100, max: 1000, value: 500 }
    ];
}
