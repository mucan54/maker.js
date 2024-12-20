namespace MakerJs.manager {

    var managerMainModel: MakerJs.IModel = null;

    const allAvailableShapes = [
        "Rectangle",
        "Circle",
        "RightAngledTriangle",
        "RightAngledTriangleMirrored",
        "ArchedRectangle",
        "RoundedRectangle",
        "Egg",
        "Ellipse",
        "FlatOval",
        "IsoscelesTriangle",
        "Arrow",
        "HalfCircle",
        "QuarterCircle",
        "Hexagon",
        "Polygon",
        "Octagon",
        "Star",
        "SlopedRectangle",
        "SlopedRightRectangle",
        "Trapezoid",
        "Heart",
        "Kite",
        "GridDots",
        "RadialDots",
        "CornerDots",
        "EdgeDots",
        "CustomDot"
    ];

    const allValidShapes = allAvailableShapes.concat(["TextModel"]);

    const mainShapeRequiredModels = [
        "CornerDots",
        "EdgeDots",
        "GridDots",
        "RadialDots"
    ];

    const shapesDots = {
        Rectangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Circle: ["GridDots", "RadialDots", "CustomDot"],
        RightAngledTriangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        RightAngledTriangleMirrored: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        ArchedRectangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        RoundedRectangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Egg: ["GridDots", "RadialDots", "CustomDot"],
        Ellipse: ["GridDots", "RadialDots", "CustomDot"],
        FlatOval: ["GridDots", "RadialDots", "CustomDot"],
        IsoscelesTriangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Arrow: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        HalfCircle: ["GridDots", "RadialDots", "CustomDot"],
        QuarterCircle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Hexagon: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Polygon: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Octagon: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Star: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        SlopedRectangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        SlopedRightRectangle: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Trapezoid: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        Heart: ["GridDots", "RadialDots", "CustomDot"],
        Kite: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"],
        TextModel: ["GridDots", "RadialDots", "CustomDot"]
    };

    export var defaultFontSize = 10;

    export function getAllModels(): any {
        const shapeNames = allAvailableShapes;
        const shapes = {};

        shapeNames.forEach(shapeName => {
            // Convert shape name from CamelCase to spaced format
            const formattedName = shapeName.replace(/([a-z])([A-Z])/g, '$1 $2');

            shapes[shapeName] = {
                code : shapeName,
                name: formattedName, // Use the formatted name
                parameters: MakerJs.models[shapeName]?.metaParameters || {} // Use optional chaining
            };
        });

        return shapes;
    }

    export function getAllValidModels(): any {
        const shapeNames = allValidShapes;
        const shapes = {};

        shapeNames.forEach(shapeName => {
            // Convert shape name from CamelCase to spaced format
            const formattedName = shapeName.replace(/([a-z])([A-Z])/g, '$1 $2');

            shapes[shapeName] = {
                code : shapeName,
                name: formattedName, // Use the formatted name
                parameters: MakerJs.models[shapeName]?.metaParameters || {} // Use optional chaining
            };
        });

        return shapes;
    }

    export function getModel(name: string, parameters: any[]): any {
        const models = getAllValidModels();
        let modelDefinition = null;
        name = name.replace(/ /g, '');

        // Check if model exists
        if (models[name]) {
             if(typeof parameters === 'object'){
                const parametersArray = [];
                var index = 0;
                for (const key in parameters) {
                    //get by index the parameter type
                    const parameterType = models[name].parameters[index].unit ?? "float";
                    if (parameterType === "int") {
                        parametersArray.push(parseInt(parameters[key]?.value ?? parameters[key]));
                    } else if(parameterType === "string") {
                        parametersArray.push(parameters[key]?.value ?? parameters[key]);
                    } else  {
                        parametersArray.push(parseFloat(parameters[key]?.value ?? parameters[key]));
                    }

                    index++;
                }
                parameters = parametersArray;
             } else {
                parameters = Array.from(parameters);
             }

            parameters = checkMainModelRequired(name, parameters);

            // @ts-ignore
            modelDefinition = new (MakerJs.models[name] as any)(...parameters);
        }

        if (!modelDefinition) {
            console.error(`Model ${name} not found.`);
            return null;
        }

        return modelDefinition;
    }

    function checkMainModelRequired(name: string, parameters: any[]): any[] {
        if (mainShapeRequiredModels.includes(name)) {
            if(!managerMainModel){
                console.error(`Main model is required for ${name}`);
                return null;
            }

            parameters = [managerMainModel, ...parameters];
        }

        return parameters;
    }

    export function fetchMainModel(name: string, parameters: any[], unitType = "cm"): any {
        let mainModel = getModel(name, parameters);
        mainModel.layer = "black";
        mainModel.units = unitType ?? "cm";
        managerMainModel = mainModel;
        return mainModel;
    }

    export function setMainModel(mainModel: any): void {
        managerMainModel = mainModel;
    }

    export function getMainModel(): any {
        return managerMainModel;
    }

    export function getAllShapes(): any {
        const allShapes = getAllModels();
        const shapesWithoutDot = [];

        for (const shapeName in allShapes) {
            if (allShapes.hasOwnProperty(shapeName) && !shapeName.includes("Dot")) {
                shapesWithoutDot.push(allShapes[shapeName]);
            }
        }

        return shapesWithoutDot;
    }

    export function getAllDots(mainShapeName:string = null): any {
        const allShapes = getAllModels();
        const shapesWithDot = [];

        for (const shapeName in allShapes) {
            if (allShapes.hasOwnProperty(shapeName) && shapeName.includes("Dot")) {
                if (mainShapeName && shapesDots[mainShapeName] && shapesDots[mainShapeName].includes(shapeName)) {
                    shapesWithDot.push(allShapes[shapeName]);
                }

                if(!mainShapeName){
                    shapesWithDot.push(allShapes[shapeName]);
                }
            }
        }

        return shapesWithDot;
    }

    interface IModel {
        models?: { [key: string]: IModel };
        paths?: { [key: string]: any };
        origin?: [number, number];
        units?: string;
    }

    export function calculateShapeTotalArea(mainShape: IModel, unit: string | null = null): any {
        // Helper function to recursively extract all paths from models
        function extractAllPaths(model: IModel): any[] {
            let allPaths: any[] = [];

            // Base case: if model is null or undefined
            if (!model) return allPaths;

            // Process paths in current model
            if (model.paths) {
                for (const key in model.paths) {
                    if (model.paths.hasOwnProperty(key)) {
                        const path = model.paths[key];

                        // Check if the path itself has models
                        if (path.models) {
                            allPaths = allPaths.concat(extractAllPaths(path));
                        }

                        allPaths.push(path);
                    }
                }
            }

            // Process paths in nested models
            if (model.models) {
                for (const key in model.models) {
                    if (model.models.hasOwnProperty(key)) {
                        const nestedModel = model.models[key];

                        // Process paths in the nested model
                        if (nestedModel.paths) {
                            for (const pathKey in nestedModel.paths) {
                                if (nestedModel.paths.hasOwnProperty(pathKey)) {
                                    allPaths.push(nestedModel.paths[pathKey]);
                                }
                            }
                        }

                        // Recursively process any further nested models
                        allPaths = allPaths.concat(extractAllPaths(nestedModel));
                    }
                }
            }

            return allPaths;
        }

        // Get model measurements
        const modelExtents = MakerJs.measure.modelExtents(mainShape);
        let shapeWidth = modelExtents.high[0] - modelExtents.low[0];
        let shapeHeight = modelExtents.high[1] - modelExtents.low[1];

        // Extract all paths
        const allPaths = extractAllPaths(mainShape);

        // Calculate total cut distance
        let totalCutDistance = 0;
        let validDots: any[] = [];

        for (let i = 0; i < allPaths.length; i++) {
            const path = allPaths[i];
            if (path.type === 'line' || path.type === 'arc' || path.type === 'BezierCurve') {
                totalCutDistance += MakerJs.measure.pathLength(path);
            } else if (path.constructor.name.includes('Dot')) {
                validDots.push(path);
            }
        }

        // Apply unit conversion if needed
        if (unit) {
            const mainModelUnit = mainShape.units ?? "cm";
            const conversion = MakerJs.units.conversionScale(mainModelUnit, unit);
            shapeWidth *= conversion;
            shapeHeight *= conversion;
            totalCutDistance *= conversion;
        }

        return {
            mainFrame: {
                width: Math.round(shapeWidth * 100) / 100,
                height: Math.round(shapeHeight * 100) / 100
            },
            cutoutDistance: Math.round(totalCutDistance * 100) / 100,
            dots: validDots,
            unit: unit ?? mainShape.units ?? "cm"
        };
    }

    function extractModelsFromParentModelRecursive(mainModel: any): any[] {
        let models: any[] = [];
        const ignoreKeys = ['dimensions', 'frame', 'bezierAccuracy', 'centerCharacterOrigin', 'combine', 'currentSize', 'currentText', 'font', 'fontFamily', 'opentypeOptions', 'units'];

        // Helper function to check if an object is a TextModel
        const isTextModel = (obj: any): boolean => {
            return obj && obj.hasOwnProperty('currentText') && obj.hasOwnProperty('font') && obj.hasOwnProperty('models');
        };

        // Iterate through all properties of the main model
        for (const key in mainModel) {
            if (ignoreKeys.includes(key)) {
                continue;
            }

            if (mainModel.hasOwnProperty(key)) {
                const element = mainModel[key];

                if (!element) {
                    continue;
                }

                if (isTextModel(element)) {
                    // If the element is a TextModel, add it directly
                    models.push(element);

                    // Check for child models inside the TextModel
                    if (element.models) {
                        for (const childKey in element.models) {
                            if (element.models.hasOwnProperty(childKey)) {
                                models.push(...extractModelsFromParentModelRecursive(element.models[childKey]));
                            }
                        }
                    }
                } else if (allValidShapes.includes(element.constructor?.name)) {
                    // If the element is another valid model, add it
                    models.push(element);

                    // Recursively extract child models
                    if (element.models) {
                        models.push(...extractModelsFromParentModelRecursive(element.models));
                    }
                } else if (Array.isArray(element)) {
                    // Handle arrays
                    element.forEach((item) => {
                        models.push(...extractModelsFromParentModelRecursive(item));
                    });
                } else if (typeof element === 'object') {
                    // Handle nested objects
                    models.push(...extractModelsFromParentModelRecursive(element));
                }
            }
        }

        return models;
    }

    export function getMainShapeCenter(): any
    {
        let mainShape = getMainModel();
        let mainShapeExtents = MakerJs.measure.modelExtents(mainShape);
        return {
            x: (mainShapeExtents.high[0] + mainShapeExtents.low[0]) / 2,
            y: (mainShapeExtents.high[1] + mainShapeExtents.low[1]) / 2,
        };

    }
}