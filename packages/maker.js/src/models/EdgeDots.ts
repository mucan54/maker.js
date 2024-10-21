namespace MakerJs.models {

    export class EdgeDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, dotDiameter: number, minOffset: number) {
            // Ensure a valid minimum offset and dot diameter
            if (minOffset <= 0) minOffset = 1;
            if (dotDiameter <= 0) dotDiameter = 1;

            // Get all the lines (edges) in the model
            const edges = this.getEdges(mainModel);
            const center = MakerJs.measure.modelExtents(mainModel).center;
            const cloneModel = MakerJs.cloneObject(mainModel);

            // For each edge, calculate a parallel line and place a dot at the midpoint
            edges.forEach((edge, i) => {
                // Create a parallel line to the current edge, offset by minOffset
                const parallelLine = new MakerJs.paths.Parallel(edge, minOffset, center);

                // Calculate the midpoint of the parallel line
                const midpoint = MakerJs.point.middle(parallelLine);

                // Create a circle (dot) at the midpoint with the specified diameter
                this.paths[`edge${i}`] = new MakerJs.paths.Circle(midpoint, dotDiameter / 2);
            });

            //@ts-ignore
            this.models = {};
            //@ts-ignore
            this.models['frame'] = cloneModel;
        }

        /**
         * Get all the line edges in the model
         */
        private getEdges(model: IModel): IPathLine[] {
            const edges: IPathLine[] = [];

            // Loop through all the paths in the model
            for (let id in model.paths) {
                const path = model.paths[id];
                if (path.type === 'line') {
                    edges.push(path as IPathLine); // Cast to IPathLine
                }
            }

            return edges;
        }
    }

    // Meta parameters to define the input values for the dots on the edge
    (<IKit>EdgeDots).metaParameters = [
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 1.4 },
        { title: "Offset", type: "range", min: 1, max: 50, value: 5 }
    ];

}
