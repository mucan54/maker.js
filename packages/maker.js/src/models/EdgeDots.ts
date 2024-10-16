namespace MakerJs.models {

    export class EdgeDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, dotDiameter: number, minOffset: number) {
            // Get the ordered corner points of the model
            if(minOffset <= 0) minOffset = 1;
            if(dotDiameter <= 0) dotDiameter = 1;

            const cornerPoints = this.getOrderedCornerPoints(mainModel);

            // For each edge, calculate the midpoint and place a dot
            for (let i = 0; i < cornerPoints.length; i++) {
                const curr = cornerPoints[i];
                const next = cornerPoints[(i + 1) % cornerPoints.length];

                // Calculate the midpoint between the current and next points
                const midpoint = this.calculateMidpoint(curr, next);

                // Optionally move the midpoint inwards if a minOffset is provided
                const adjustedMidpoint = this.adjustPointTowardsCentroid(midpoint, mainModel, minOffset);

                // Ensure the adjusted point is still inside the shape
                if (MakerJs.measure.isPointInsideModel(adjustedMidpoint, mainModel)) {
                    // Create a circle (dot) at the adjusted midpoint with the specified diameter
                    this.paths[`edge${i}`] = new paths.Circle(adjustedMidpoint, dotDiameter / 2);
                }
            }
        }

        /**
         * Calculate the midpoint between two points
         */
        private calculateMidpoint(point1: IPoint, point2: IPoint): IPoint {
            return [
                (point1[0] + point2[0]) / 2,
                (point1[1] + point2[1]) / 2
            ];
        }

        /**
         * Adjust the point towards the centroid by a specified offset
         */
        private adjustPointTowardsCentroid(midpoint: IPoint, model: IModel, minOffset: number): IPoint {
            // Calculate the centroid of the model (average of all corner points)
            const cornerPoints = this.getOrderedCornerPoints(model);
            const centroid = this.calculateCentroid(cornerPoints);

            const vectorToCentroid = [centroid[0] - midpoint[0], centroid[1] - midpoint[1]];
            const magToCentroid = MakerJs.measure.pointDistance(midpoint, centroid);
            const normalizedVector = [vectorToCentroid[0] / magToCentroid, vectorToCentroid[1] / magToCentroid];

            const offsetX = normalizedVector[0] * minOffset;
            const offsetY = normalizedVector[1] * minOffset;

            return [midpoint[0] + offsetX, midpoint[1] + offsetY];
        }

        /**
         * Calculate the centroid (average of all points) of the shape
         */
        private calculateCentroid(points: IPoint[]): IPoint {
            let sumX = 0;
            let sumY = 0;

            points.forEach(point => {
                sumX += point[0];
                sumY += point[1];
            });

            const centerX = sumX / points.length;
            const centerY = sumY / points.length;

            return [centerX, centerY];
        }

        /**
         * Helper method to extract ordered corner points from the main model
         */
        private getOrderedCornerPoints(model: IModel): IPoint[] {
            const points: IPoint[] = [];

            // Use the MakerJs function to find the chain and extract corner points
            const chain = MakerJs.model.findChains(model)[0];
            if (chain) {
                const chainLinks = chain.links;
                for (let link of chainLinks) {
                    const line = link.walkedPath.pathContext as IPathLine;
                    if (link.reversed) {
                        points.push(line.end);
                    } else {
                        points.push(line.origin);
                    }
                }
            }

            return points;
        }
    }

    (<IKit>EdgeDots).metaParameters = [
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 1.4 },
        { title: "Offset", type: "range", min: 1, max: 50, value: 5 }
    ];

}
