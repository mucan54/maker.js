namespace MakerJs.models {

    export class CornerDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, dotDiameter: number, offset: number) {
            // Calculate the true center of the shape
            const center = this.calculateShapeCenter(mainModel);

            // Find the corner points and move them toward the center
            const cornerPoints = this.getOffsetCornerPoints(mainModel, center, offset);

            // Add dots at the offset corner points
            cornerPoints.forEach((cornerPoint, index) => {
                const dot = this.drawDotAtPoint(cornerPoint, dotDiameter);
                this.paths[`dot_${index}`] = dot;
            });
        }

        // Calculate the true center of the shape by averaging the midpoints of all lines
        private calculateShapeCenter(model: IModel): IPoint {
            const midPoints: IPoint[] = [];

            // Find the midpoint of each line in the shape
            for (const pathId in model.paths) {
                const path = model.paths[pathId];

                if (path.type === MakerJs.pathType.Line) {
                    const line = path as IPathLine;
                    const midPoint = MakerJs.point.middle(line);
                    midPoints.push(midPoint);
                }
            }

            // Calculate the average of all midpoints to find the center
            const sum = midPoints.reduce((acc, point) => {
                return [acc[0] + point[0], acc[1] + point[1]];
            }, [0, 0]);

            const centerX = sum[0] / midPoints.length;
            const centerY = sum[1] / midPoints.length;

            return [centerX, centerY];  // Return the true center of the shape
        }

        // Calculate the corner points and move them toward the center based on the offset
        private getOffsetCornerPoints(model: IModel, center: IPoint, offset: number): IPoint[] {
            const points: IPoint[] = [];

            // Collect all corner points from the model
            for (const pathId in model.paths) {
                const path = model.paths[pathId];

                if (path.type === MakerJs.pathType.Line) {
                    const line = path as IPathLine;
                    points.push(line.origin, line.end);
                }
            }

            // Remove duplicate points
            const uniquePoints = this.removeDuplicatePoints(points);

            // Move the points toward the center
            return this.movePointsTowardCenter(uniquePoints, center, offset);
        }

        // Remove duplicate points to avoid redundant calculations
        private removeDuplicatePoints(points: IPoint[]): IPoint[] {
            return points.filter((point, index, self) =>
                    index === self.findIndex((p) =>
                        this.arePointsEqual(p, point)
                    )
            );
        }

        // Check if two points are equal
        private arePointsEqual(point1: IPoint, point2: IPoint): boolean {
            return point1[0] === point2[0] && point1[1] === point2[1];
        }

        // Move points toward the center by the given offset
        private movePointsTowardCenter(points: IPoint[], center: IPoint, offset: number): IPoint[] {
            return points.map(point => {
                // Calculate the distance from the point to the center
                const distanceToCenter = MakerJs.measure.pointDistance(point, center);

                // If the distance is very small, do not move the point
                if (distanceToCenter === 0) {
                    return point;
                }

                // Scale the movement based on the distance and offset
                const scale = (distanceToCenter - offset) / distanceToCenter;

                // Move the point toward the center using the scaled values
                const newX = point[0] + (center[0] - point[0]) * (1 - scale);
                const newY = point[1] + (center[1] - point[1]) * (1 - scale);

                return [newX, newY];
            });
        }

        // Draw a dot (circle) at the specified point
        private drawDotAtPoint(center: IPoint, diameter: number): IPathCircle {
            const radius = diameter / 2;
            return new MakerJs.paths.Circle(center, radius);
        }
    }

    // Meta parameters for the CornerDots class
    (<IKit>CornerDots).metaParameters = [
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 1.4 },
        { title: "Offset", type: "range", min: 1, max: 50, value: 5 }
    ];

}
