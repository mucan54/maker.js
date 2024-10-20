namespace MakerJs.models {

    export class CornerDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, dotDiameter: number, offset: number) {

            const edges = this.getEdges(mainModel);
            const center = MakerJs.measure.modelExtents(mainModel).center;
            const cloneModel = MakerJs.cloneObject(mainModel);
            const interSectionPoints: IPoint[] = [];
            // Create parallel lines and store them
            let parallelLines: IPathLine[] = edges.map(edge => this.createParallelLine(edge, offset, center));
            // Store the lines in the paths
            for (let i = 0; i <= parallelLines.length; i++) {
                let currentLine = parallelLines[i];
                for(let j = 0; j <= parallelLines.length; j++) {
                    let nextLine = parallelLines[j];
                    let intersection = MakerJs.path.intersection(currentLine, nextLine);
                    if (intersection) {
                        interSectionPoints.push(...intersection.intersectionPoints);
                    }
                }
            }

            // Get the unique points
            const uniquePoints = this.getUniquePoints(interSectionPoints);

            // Create the dots
            for (let i = 0; i < interSectionPoints.length; i++) {
                let dot = new MakerJs.paths.Circle([0, 0], dotDiameter / 2);
                dot.origin = interSectionPoints[i];
                this.paths[`dot${i}`] = dot;
            }

            //@ts-ignore
            this.models = {};
            //@ts-ignore
            this.models['frame'] = cloneModel;
        }

        // Function to get unique points
        private getUniquePoints(points: IPoint[]): IPoint[] {
            return points.filter((point, index, self) => {
                return index === self.findIndex((t) => (
                    t[0] === point[0] && t[1] === point[1]
                ));
            });
        }

        // Function to get all edges of the model
        private getEdges(model: IModel): IPathLine[] {
            let edges: IPathLine[] = [];
            for (let id in model.paths) {
                let path = model.paths[id];
                if (path.type === 'line') {
                    edges.push(path as IPathLine);
                }
            }
            return edges;
        }

        // Function to create a parallel line offset by a specified distance
        private createParallelLine(edge: IPathLine, offset: number, center: IPoint): MakerJs.paths.Line {
            const doubleSizedEdge = MakerJs.model.scale(edge, 2);
            return new MakerJs.paths.Parallel(edge, offset, center);
        }
    }

    // Meta parameters for the CornerDots class
    (<IKit>CornerDots).metaParameters = [
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 1.4 },
        { title: "Offset", type: "range", min: 1, max: 50, value: 5 }
    ];
}
