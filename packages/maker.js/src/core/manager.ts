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
        "EdgeDots"
    ];

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
                    parametersArray.push(parseInt(parameters[key]));
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

    export function fetchMainModel(name: string, parameters: any[]): any {
        let mainModel = getModel(name, parameters);
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

    export function getAllDots(): any {
        const allShapes = getAllModels();
        const shapesWithDot = [];

        for (const shapeName in allShapes) {
            if (allShapes.hasOwnProperty(shapeName) && shapeName.includes("Dot")) {
                shapesWithDot.push(allShapes[shapeName]);
            }
        }

        return shapesWithDot;
    }
}