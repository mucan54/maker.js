namespace MakerJs.models {
    export class Grid implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, unit: '10cm' | '5cm' | '1cm' = '10cm', shiftX: number = 0, shiftY: number = 0) {
            // Measure the extents of the model to get its width and height
            const extents = MakerJs.measure.modelExtents(mainModel);
            const modelWidth = extents.high[0] - extents.low[0];  // Model's width
            const modelHeight = extents.high[1] - extents.low[1]; // Model's height

            // Define grid spacing based on the unit or 1mm
            var spacing = 10;
            if (unit === '5cm') {
                spacing = 5;
            } else if (unit === '1cm') {
                spacing = 1;
            }

            let index = 0;

            // Correctly align the grid lines with the shiftX and shiftY values applied
            const startX = extents.low[0] + (shiftX % spacing); // Calculate starting x position
            const startY = extents.low[1] + (shiftY % spacing); // Calculate starting y position

            // Draw vertical grid lines with shiftX applied and wrap using % spacing
            for (let x = startX; x <= extents.high[0]; x += spacing) {
                this.paths[`Vertical${index++}`] = new MakerJs.paths.Line([x, extents.low[1]], [x, extents.high[1]]);
            }

            // Draw horizontal grid lines with shiftY applied and wrap using % spacing
            for (let y = startY; y <= extents.high[1]; y += spacing) {
                this.paths[`Horizontal${index++}`] = new MakerJs.paths.Line([extents.low[0], y], [extents.high[0], y]);
            }

            // Include the main shape in the model
            //@ts-ignore
            this.models = {
                shape: MakerJs.cloneObject(mainModel)
            };
        }
    }
}
