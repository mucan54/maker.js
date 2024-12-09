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
        Kite: ["CornerDots", "EdgeDots", "GridDots", "RadialDots", "CustomDot"]
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

    export function getModel(name: string, parameters: any[]): any {
        const models = getAllModels();
        let modelDefinition = null;
        name = name.replace(/ /g, '');

        // Check if model exists
        if (models[name]) {
             if(typeof parameters === 'object'){
                const parametersArray = [];
                for (const key in parameters) {
                    parametersArray.push(parseFloat(parameters[key]?.value ?? parameters[key]));
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

    export function calculateShapeTotalArea(mainShape: IModel, unit = null): any {

        let cost = {};
        let shapeWidth = MakerJs.measure.modelExtents(getMainModel()).high[0] - MakerJs.measure.modelExtents(getMainModel()).low[0];
        let shapeHeight = MakerJs.measure.modelExtents(getMainModel()).high[1] - MakerJs.measure.modelExtents(getMainModel()).low[1];

        let allModels = extractModelsFromParentModelRecursive(mainShape);

        let totalCutDistance = 0;

        let validDots = [];

        allModels.forEach((model) => {
            //check if the model.constructor.name contains "Dot"
            if(!model.constructor.name.includes('Dot') && model.paths){
                for(const key in model.paths){
                    totalCutDistance += MakerJs.measure.pathLength(model.paths[key]);
                }
            }
        });

        allModels.forEach((model) => {
            if(model.constructor.name.includes('Dot')){
                for(const key in model.paths){
                    validDots.push(model.paths[key]);
                }
            }
        });

        if(unit) {
            const mainModelUnit = getMainModel().units ?? "cm";
            const conversion = MakerJs.units.conversionScale(mainModelUnit, unit);
            shapeWidth *= conversion;
            shapeHeight *= conversion;
            totalCutDistance *= conversion;
        }


        cost = {
            mainFrame : {width: Math.round(shapeWidth), height: Math.round(shapeHeight)},
            cutoutDistance: Math.round(totalCutDistance),
            dots: validDots,
            unit: unit ?? "cm"
        }

        return cost;
    }

    function extractModelsFromParentModelRecursive(mainModel: IModel): any[] {
        let models: any[] = [];
        const ignore_keys = ['dimensions', 'frame'];

        // Iterate through all properties of the main model
        for (const key in mainModel) {
            if(ignore_keys.includes(key)){
                continue;
            }

            if (mainModel.hasOwnProperty(key)) {
                const element = mainModel[key];

                //  element.frame.constructor.name check if the name is in allAvailableShapes
                if (allAvailableShapes.includes(element.constructor.name)) {
                    // If the element is a model, add it to the list
                    models.push(element);

                    // If the model contains child models, extract recursively
                    if (element.models) {
                        models.push(...extractModelsFromParentModelRecursive(element.models));
                    }
                } else if (Array.isArray(element)) {
                    // If the element is an array, recursively extract models from it
                    element.forEach((item) => {
                        models.push(...extractModelsFromParentModelRecursive(item));
                    });
                } else if (typeof element === 'object') {
                    // Recursively extract models from nested objects (non-array objects)
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