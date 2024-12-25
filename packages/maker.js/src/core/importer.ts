namespace MakerJs.importer {
    export function fromDXF(dxfContent: string): MakerJs.IModel {
        const dxfParser = require('dxf-parser');
        const parser = new dxfParser();
        const model: MakerJs.IModel = {paths: {}, models: {}};

        try {
            const dxf = parser.parseSync(dxfContent);
            if (!dxf?.entities) return model;

            // Process by layer to maintain order
            const layerGroups = new Map<string, any[]>();
            dxf.entities.forEach((entity: any) => {
                const layer = entity.layer || 'default';
                if (!layerGroups.has(layer)) {
                    layerGroups.set(layer, []);
                }
                layerGroups.get(layer)?.push(entity);
            });

            layerGroups.forEach((entities, layer) => {
                const layerModel: MakerJs.IModel = {paths: {}, models: {}};
                entities.forEach((entity: any) => addEntityToModel(layerModel, entity, layer));
                model.models![layer] = layerModel;
            });

            return model;
        } catch (error) {
            console.error("DXF parse error:", error);
            return model;
        }
    }

    function addEntityToModel(model: MakerJs.IModel, entity: any, layer: string): void {
        const id = `${layer}_${Date.now()}_${Math.random()}`;

        switch (entity.type) {
            case 'LINE':
                if (entity.vertices?.[0] && entity.vertices?.[1]) {
                    model.paths[`line_${id}`] = {
                        type: 'line',
                        origin: [entity.vertices[0].x, entity.vertices[0].y],
                        end: [entity.vertices[1].x, entity.vertices[1].y]
                    };
                }
                break;

            case 'ARC':
                if (entity.center && typeof entity.radius === 'number') {
                    model.paths[`arc_${id}`] = {
                        type: 'arc',
                        origin: [entity.center.x, entity.center.y],
                        radius: entity.radius,
                        startAngle: entity.startAngle * 180 / Math.PI,
                        endAngle: entity.endAngle * 180 / Math.PI
                    };
                }
                break;

            case 'CIRCLE':
                if (entity.center && typeof entity.radius === 'number') {
                    model.paths[`circle_${id}`] = {
                        type: 'circle',
                        origin: [entity.center.x, entity.center.y],
                        radius: entity.radius
                    };
                }
                break;

            case 'LWPOLYLINE':
            case 'POLYLINE':
                if (entity.vertices?.length > 1) {
                    const subModel: MakerJs.IModel = {paths: {}};
                    for (let i = 0; i < entity.vertices.length - 1; i++) {
                        const current = entity.vertices[i];
                        const next = entity.vertices[i + 1];

                        if (current.bulge) {
                            addBulgeArc(subModel, current, next, current.bulge, `${id}_${i}`);
                        } else {
                            subModel.paths[`segment_${id}_${i}`] = {
                                type: 'line',
                                origin: [current.x, current.y],
                                end: [next.x, next.y]
                            };
                        }
                    }

                    if (entity.shape) {
                        const last = entity.vertices[entity.vertices.length - 1];
                        const first = entity.vertices[0];
                        subModel.paths[`close_${id}`] = {
                            type: 'line',
                            origin: [last.x, last.y],
                            end: [first.x, first.y]
                        };
                    }

                    chainAndMerge(model, subModel, id);
                }
                break;

            case 'SPLINE':
                if (entity.controlPoints?.length > 0) {
                    const subModel: MakerJs.IModel = {paths: {}};
                    addSpline(subModel, entity, id);
                    chainAndMerge(model, subModel, id);
                }
                break;
        }
    }

    function addBulgeArc(model: MakerJs.IModel, start: any, end: any, bulge: number, id: string): void {
        const chord = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const sagitta = Math.abs(bulge) * chord / 2;
        const radius = (chord * chord / (4 * sagitta) + sagitta) / 2;

        const chordAngle = Math.atan2(end.y - start.y, end.x - start.x);
        const bulgeAngle = Math.atan(bulge);
        const centerAngle = chordAngle + (Math.PI / 2 - bulgeAngle);

        const center = {
            x: start.x + radius * Math.cos(centerAngle),
            y: start.y + radius * Math.sin(centerAngle)
        };

        const startAngle = (chordAngle - Math.PI / 2 + bulgeAngle) * 180 / Math.PI;
        const endAngle = startAngle + (bulge >= 0 ? 180 : -180);

        model.paths[`arc_${id}`] = {
            type: 'arc',
            origin: [center.x, center.y],
            radius: radius,
            startAngle: startAngle,
            endAngle: endAngle
        };
    }

    function addSpline(model: MakerJs.IModel, entity: any, id: string): void {
        const controlPoints = entity.controlPoints;
        const degree = entity.degree || 3;
        const isClosed = entity.closed;
        const knots = entity.knots || [];

        // Calculate adaptive number of segments based on spline complexity
        const numSegments = Math.max((controlPoints.length - 1) * 20, 100);

        // Generate points along the spline
        const points = [];
        for (let i = 0; i <= numSegments; i++) {
            const t = i / numSegments;
            const point = evaluateSpline(controlPoints, degree, knots, t);
            points.push(point);
        }

        // Create path segments
        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            model.paths[`segment_${id}_${i}`] = {
                type: 'line',
                origin: [current.x, current.y],
                end: [next.x, next.y]
            };
        }

        if (isClosed) {
            model.paths[`close_${id}`] = {
                type: 'line',
                origin: [points[points.length - 1].x, points[points.length - 1].y],
                end: [points[0].x, points[0].y]
            };
        }
    }

    function evaluateSpline(controlPoints: any[], degree: number, knots: number[], t: number): any {
        const n = controlPoints.length - 1;
        let x = 0, y = 0;

        for (let i = 0; i <= n; i++) {
            const basis = bsplineBasis(i, degree, knots, t);
            x += controlPoints[i].x * basis;
            y += controlPoints[i].y * basis;
        }

        return {x, y};
    }

    function bsplineBasis(i: number, degree: number, knots: number[], t: number): number {
        if (degree === 0) {
            return (t >= knots[i] && t < knots[i + 1]) ? 1 : 0;
        }

        let sum = 0;

        const d1 = knots[i + degree] - knots[i];
        if (d1 > 0) {
            sum += (t - knots[i]) * bsplineBasis(i, degree - 1, knots, t) / d1;
        }

        const d2 = knots[i + degree + 1] - knots[i + 1];
        if (d2 > 0) {
            sum += (knots[i + degree + 1] - t) * bsplineBasis(i + 1, degree - 1, knots, t) / d2;
        }

        return sum;
    }

    function chainAndMerge(targetModel: MakerJs.IModel, sourceModel: MakerJs.IModel, id: string): void {
        const chains = MakerJs.model.findChains(sourceModel);
        if (Array.isArray(chains)) {
            chains.forEach((chain, index) => {
                const chainModel = MakerJs.chain.toNewModel(chain);
                if (chainModel.paths) {
                    Object.keys(chainModel.paths).forEach(key => {
                        targetModel.paths[`chain_${id}_${index}_${key}`] = chainModel.paths[key];
                    });
                }
            });
        }
    }

    export function parseNumericList(s: string): number[] {
        var result: number[] = [];

        //http://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly
        var re = /-?(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var matches: RegExpExecArray;

        while ((matches = re.exec(s)) !== null) {
            if (matches.index === re.lastIndex) {
                re.lastIndex++;
            }
            if (matches[0] !== "") result.push(parseFloat(matches[0]));
        }

        return result;
    }
}
