namespace MakerJs.shaper {

    function getParamsArray(parameters) {
        const parametersArray = [];
        for (const key in parameters) {
            parametersArray.push(parseFloat(parameters[key]));
        }

        return parametersArray;
    }

    export function shapeMerger(shapes: any, is_finalized: boolean = false, mergedShapes: any = null): any {
        mergedShapes = mergedShapes || {};

        shapes.forEach(shape => {
            if (!shape || !shape.shapeType || !shape.shapeParameters) {
                return;
            }

            let shapeModel = MakerJs.manager.getModel(shape.shapeType, shape.shapeParameters);
            if (!shapeModel) {
                return;
            }

            const {x: positionX, y: positionY} = MakerJs.shaper.getShapePosition(shape);

            shapeModel.layer = "red";

            if (shape.shapeType.includes('Dot')) {
                shapeModel.layer = "blue";
            }

            if(shapeModel.models && shapeModel.models['frame']) {
                delete shapeModel.models['frame'];
            }

            if (!is_finalized) {
                // @ts-ignore
                mergedShapes = new MakerJs.model.combine(
                    MakerJs.model.move(shapeModel, [positionX, positionY]),
                    mergedShapes,
                    true,
                    true,
                    true,
                    true
                );
            } else {
                // @ts-ignore
                mergedShapes = new MakerJs.model.combineUnion(
                    MakerJs.model.move(shapeModel, [positionX, positionY]),
                    mergedShapes
                );
            }
        });

        return mergedShapes;
    }

    export function getShapeDimensions(shapes: any) {
        let mergedDimensions = {};
        let index = 0;
        shapes.forEach(shape => {
            if (!shape || !shape.shapeType || !shape.shapeParameters) {
                return;
            }
            const {x: positionX, y: positionY} = MakerJs.shaper.getShapePosition(shape);
            if (shape.showDimensions) {
                var dimension = MakerJs.dimension.applyDimensions(shape.shapeType, getParamsArray(shape.shapeParameters));
                dimension.layer = "red";

                if (shape.shapeType.includes('Dot')) {
                    dimension.layer = "blue";
                }

                mergedDimensions[shape.shapeType + index] = MakerJs.model.move(dimension, [positionX, positionY]);
                index++;
            }
        });

        return mergedDimensions;
    }

    export function finalShapeModel(mainShapeData: any): any {
        mainShapeData = JSON.parse(mainShapeData);
        let mainShape = MakerJs.manager.fetchMainModel(mainShapeData.mainFrame.shapeType, mainShapeData.mainFrame.shapeParameters);
        if (!mainShape) return;
        let cutoutShapes = MakerJs.shaper.shapeMerger(mainShapeData.cutouts, true);
        let cutoutShape = MakerJs.shaper.shapeMerger(mainShapeData.dots, true, cutoutShapes);

        mainShape = MakerJs.model.combineSubtraction(
            mainShape,
            cutoutShape
        );

        MakerJs.model.center(mainShape);
        MakerJs.model.originate(mainShape);

        return mainShape;
    }

    export function finalizeShape(mainShapeData: any): any {
        mainShapeData = JSON.parse(mainShapeData);
        let mainShape = MakerJs.manager.fetchMainModel(mainShapeData.mainFrame.shapeType, mainShapeData.mainFrame.shapeParameters);
        if (!mainShape) return;
        let cutoutShapes = MakerJs.shaper.shapeMerger(mainShapeData.cutouts, mainShapeData.is_finalized);
        let cutoutShape = MakerJs.shaper.shapeMerger(mainShapeData.dots, mainShapeData.is_finalized, cutoutShapes);

        if (!mainShapeData.is_finalized) {
            mainShape = MakerJs.model.combine(mainShape, cutoutShape, true, true, true, true);
        } else {
            mainShape = MakerJs.model.combineSubtraction(
                mainShape,
                cutoutShape
            );
        }

        if (mainShape) {
            let mainShapeExtents = MakerJs.measure.modelExtents(mainShape);
            if (!mainShapeExtents) console.log("Model extents not found")
            const options = {};
            let shapeWidth = mainShapeExtents.high[0] - mainShapeExtents.low[0];
            let shapeHeight = mainShapeExtents.high[1] - mainShapeExtents.low[1];
            // @ts-ignore
            options.strokeWidth = 3;
            // @ts-ignore
            options.annotate = false;
            // @ts-ignore
            options.fontSize = Math.max((shapeHeight * 0.007), (shapeWidth * 0.007)) + 'mm';

            if (mainShapeData.mainFrame.showGrid && mainShapeData.mainFrame.gridUnit) {
                let grids = new MakerJs.models.Grid(mainShape, mainShapeData.mainFrame.gridUnit, mainShapeData.mainFrame.gridPositionX || 0, mainShapeData.mainFrame.gridPositionY || 0);
                // @ts-ignore
                grids.layer = "gray";
                mainShape = {
                    models: {
                        frame: grids,
                        shape: mainShape,
                    }
                };
            }

            MakerJs.manager.defaultFontSize = Math.max((shapeHeight * 0.007), (shapeWidth * 0.007));

            //makerjs.dimension.dimensionAddtoModel = false;
            if (mainShapeData.mainFrame.showDimensions) {
                var dimensions = MakerJs.dimension.applyDimensions(mainShapeData.mainFrame.shapeType, getParamsArray(mainShapeData.mainFrame.shapeParameters));
                MakerJs.model.addModel(mainShape, dimensions, 'dimensions');
            }

            let cutoutDimensions = MakerJs.shaper.getShapeDimensions(mainShapeData.cutouts);
            if (cutoutDimensions) {
                // @ts-ignore
                for (const [key, value] of Object.entries(cutoutDimensions)) {
                    MakerJs.model.addModel(mainShape, value, 'cutout_dimensions');
                }
            }

            MakerJs.model.center(mainShape);
            MakerJs.model.originate(mainShape);

            return MakerJs.exporter.toSVG(mainShape, options);
        }
    }

    export function getCostOfShape(mainShapeData: any): any {
        mainShapeData = JSON.parse(mainShapeData);
        let mainShape = MakerJs.manager.fetchMainModel(mainShapeData.mainFrame.shapeType, mainShapeData.mainFrame.shapeParameters);
        if (!mainShape) return;
        let cutoutShapes = MakerJs.shaper.shapeMerger(mainShapeData.cutouts, true);
        let cutoutShape = MakerJs.shaper.shapeMerger(mainShapeData.dots, true, cutoutShapes);

        mainShape = MakerJs.model.combineSubtraction(
            mainShape,
            cutoutShape
        );

        if (mainShape) {
            let mainShapeExtents = MakerJs.measure.modelExtents(mainShape);
            if (!mainShapeExtents) console.log("Model extents not found")
            MakerJs.model.center(mainShape);
            MakerJs.model.originate(mainShape);

            return MakerJs.manager.calculateShapeTotalArea(mainShape);
        }
    }

    export function getShapeTotalLength(shapeData: any): any {
        var shapeModel = MakerJs.manager.getModel(shapeData.shapeType, shapeData.shapeParameters);
        if (!shapeModel) { console.log("Model not found") }

        let totalCutDistance = 0;
        for(const key in shapeModel.paths){
            totalCutDistance += MakerJs.measure.pathLength(shapeModel.paths[key]);
        }

        return totalCutDistance;
    }

    export function getShapeArea(shapeData: any): any {
        var shapeModel = MakerJs.manager.getModel(shapeData.shapeType, shapeData.shapeParameters);
        if (!shapeModel) { console.log("Model not found") }

        //extend the model and get width and height then calculate area
        const shapeExtents = MakerJs.measure.modelExtents(shapeModel);
        const shapeWidth = shapeExtents.high[0] - shapeExtents.low[0];
        const shapeHeight = shapeExtents.high[1] - shapeExtents.low[1];

        return shapeWidth * shapeHeight;
    }

    export function getShapePosition(shape: any): any {
        let shapeModel = MakerJs.manager.getModel(shape.shapeType, shape.shapeParameters);
        if (!shapeModel) { console.log("Model not found") }

        const shapeExtents = MakerJs.measure.modelExtents(shapeModel);
        const shapeCenter = {
            x: (shapeExtents.high[0] + shapeExtents.low[0]) / 2,
            y: (shapeExtents.high[1] + shapeExtents.low[1]) / 2,
        };

        const positionX = MakerJs.manager.getMainShapeCenter().x - (shapeCenter.x - shape.position.x);
        const positionY = MakerJs.manager.getMainShapeCenter().y - (shapeCenter.y - shape.position.y);

        return {x: positionX, y: positionY};
    }
}