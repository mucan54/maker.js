namespace MakerJs.manager {

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
            // Ensure parameters is an array
            const modelArgs = Array.isArray(parameters) ? parameters : Array.from(parameters);

            // @ts-ignore
            modelDefinition = new (MakerJs.models[name] as any)(...modelArgs);
        }

        if (!modelDefinition) {
            console.error(`Model ${name} not found.`);
            return null;
        }

        return modelDefinition;
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