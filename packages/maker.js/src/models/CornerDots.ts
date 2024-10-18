namespace MakerJs.models {

    export class CornerDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, dotDiameter: number, offset: number) {
            const corners = this.getCornersWithEdges(mainModel);
            const center = this.calculateCenter(mainModel);

            corners.forEach((corner, index) => {
                // Perform calculations for each corner
                const cornerAngle = this.calculateAngle(corner.edges);
                const halfAngle = cornerAngle / 2;

                // Calculate the point inside the corner by the offset distance
                const offsetPoint = this.getOffsetPoint(corner.corner, halfAngle, offset, center);

                this.paths['corner_' + index] = new MakerJs.paths.Line(corner.corner, offsetPoint);

                // Add a CornerDot to the offset point
                this.paths['circle_' + index] = new MakerJs.paths.Circle(offsetPoint, dotDiameter / 2);
            });
        }

        private calculateCenter(model: IModel): IPoint {
            const lines = model.paths;

            let totalX = 0;
            let totalY = 0;

            let totalPoints = 0;

            for (let id in lines) {
                if(lines[id].type !== 'line') continue;

                let line = lines[id] as IPathLine;
                // Find midpoint
                let midPoint = MakerJs.point.middle(line);
                totalX += midPoint[0];
                totalY += midPoint[1];
                totalPoints += 1;
            }

            return [totalX / totalPoints, totalY / totalPoints];
        }

        // Finding the corner coordinates and edges
        private getCornersWithEdges(model: IModel): {corner: IPoint, edges: [IPathLine, IPathLine]}[] {
            let cornersWithEdges: {corner: IPoint, edges: [IPathLine, IPathLine]}[] = [];
            let paths = model.paths;

            if (paths) {
                let allPoints: IPoint[] = [];

                // Record all lines and corner points
                for (let id in paths) {
                    let path = paths[id];
                    if (path.type === 'line') {
                        const line = path as IPathLine;
                        allPoints.push(line.origin);
                        allPoints.push(line.end); // Only 'line' type has 'end'
                    }
                }

                // Get all unique corners
                let uniquePoints = this.distinctPoints(allPoints);

                // For each corner, find the edges that meet at this corner
                uniquePoints.forEach(corner => {
                    let connectedEdges: IPathLine[] = [];

                    for (let id in paths) {
                        let path = paths[id];
                        if (path.type === 'line') {
                            const line = path as IPathLine;
                            if (this.isPointEqual(line.origin, corner) || this.isPointEqual(line.end, corner)) {
                                connectedEdges.push(line);
                            }
                        }
                    }

                    if (connectedEdges.length === 2) { // Corner is formed by two edges
                        cornersWithEdges.push({
                            corner: corner,
                            edges: [connectedEdges[0], connectedEdges[1]]
                        });
                    }
                });
            }

            return cornersWithEdges;
        }

        // Finding the corner angle between two edges
        private calculateAngle(edges: [IPathLine, IPathLine]): number {
            const [edge1, edge2] = edges;
            const slope1 = MakerJs.measure.lineSlope(edge1);
            const slope2 = MakerJs.measure.lineSlope(edge2);

            // Handle special case where there's a vertical line (no slope)
            let angle1 = this.getAngleFromSlope(slope1);
            let angle2 = this.getAngleFromSlope(slope2);

            // Find the difference between the two angles
            let angleBetween = Math.abs(angle1 - angle2);
            if (angleBetween > Math.PI) {
                angleBetween = 2 * Math.PI - angleBetween;
            }
            return angleBetween;
        }

        // Calculate angle from the ISlope type
        private getAngleFromSlope(slope: ISlope): number {
            if (!slope.hasSlope) {
                // Vertical line (x constant)
                return Math.PI / 2;
            } else {
                return Math.atan(slope.slope!); // Calculate angle using the slope value
            }
        }

        // Find the new point inside the corner at the given offset using hypotenuse and angle
        private getOffsetPoint(corner: IPoint, halfAngle: number, offset: number, center: IPoint): IPoint {
            // Calculate hypotenuse: used to place the offset distance towards the corner
            const hypotenuse = offset / Math.sin(halfAngle);

            const angleToCenter = MakerJs.angle.ofPointInRadians(corner, center);

            // Calculate a new point at the offset distance
            const x = corner[0] + hypotenuse * Math.cos(angleToCenter);
            const y = corner[1] + hypotenuse * Math.sin(angleToCenter);

            return [x, y];
        }

        // Simple function to compare two points
        private isPointEqual(a: IPoint, b: IPoint): boolean {
            return MakerJs.measure.pointDistance(a, b) < 0.0001;
        }

        // Distinct function to get unique points
        private distinctPoints(points: IPoint[]): IPoint[] {
            let uniquePoints: IPoint[] = [];
            points.forEach(point => {
                if (!uniquePoints.some(p => this.isPointEqual(p, point))) {
                    uniquePoints.push(point);
                }
            });
            return uniquePoints;
        }
    }

    // Meta parameters for the CornerDots class
    (<IKit>CornerDots).metaParameters = [
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 1.4 },
        { title: "Offset", type: "range", min: 1, max: 50, value: 5 }
    ];
}
