namespace MakerJs.models {

    export class GridDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, numberHorizontal: number, numberVertical: number, boreholeDiameter: number, distanceToCenter: number) {

            // Calculate the dimensions of the main model
            const modelWidth = MakerJs.measure.modelExtents(mainModel).width;
            const modelHeight = MakerJs.measure.modelExtents(mainModel).height;

            // Scale borehole diameter and edge distance to center
            const boreholeRadius = boreholeDiameter / 2;
            const edgeDistance = distanceToCenter;

            // Calculate the spacing between holes horizontally and vertically
            const xSpacing = (modelWidth - 2 * edgeDistance) / (numberHorizontal - 1);
            const ySpacing = (modelHeight - 2 * edgeDistance) / (numberVertical - 1);

            // Create the grid of dots, ensuring they stay within the model boundaries
            for (let i = 0; i < numberHorizontal; i++) {
                for (let j = 0; j < numberVertical; j++) {
                    // Calculate the X and Y position of each dot
                    const x = edgeDistance + i * xSpacing;
                    const y = edgeDistance + j * ySpacing;

                    // Add the dot to the paths array
                    this.paths[`dot_${i}_${j}`] = new MakerJs.paths.Circle([x, y], boreholeRadius);
                }
            }

            //@ts-ignore
            this.models = {};
            //@ts-ignore
            this.models['frame'] = new Rectangle(modelWidth, modelHeight);
        }
    }

    // Meta parameters to define the input values for the grid
    (<IKit>GridDots).metaParameters = [
        { title: "Number Horizontal", type: "range", unit: "int", min: 1, max: 10, value: 5 },
        { title: "Number Vertical", type: "range", unit: "int", min: 1, max: 10, value: 5 },
        { title: "Borehole Diameter", type: "range", min: 1, max: 20, value: 1 },
        { title: "Distance to Center of Hole", type: "range", min: 1, max: 10, value: 1 }
    ];
}
