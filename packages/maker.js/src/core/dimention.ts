namespace MakerJs.dimension {

    /**
     * Adds dimension lines and captions to a model using MakerJs.measure functions.
     * @param model - The IModel to which the dimensions and captions should be added.
     * @param metaParamValues - The values of the metaParameters for the current model.
     * @returns The updated model with dimension lines and captions.
     */
    export function addDimensionsToModel(model: IModel, metaParamValues: number[]): IModel | undefined {
        if (!model) return undefined;

        const modelName = (model.constructor as any).name.toLowerCase();
        const extents = MakerJs.measure.modelExtents(model);
        if (!extents) return undefined;

        switch (modelName) {
            case 'rectangle':
                addRectangleDimensions(model, metaParamValues);
                break;
            case 'circle':
                addCircleDimensions(model, metaParamValues);
                break;
            case 'rightangledtriangle':
            case 'rightangledtrianglemirrored':
                addRightAngledTriangleDimensions(model, metaParamValues);
                break;
            case 'archedrectangle':
                addArchedRectangleDimensions(model, metaParamValues);
                break;
            case 'roundedrectangle':
                addRoundedRectangleDimensions(model, metaParamValues);
                break;
            case 'egg':
                addEggDimensions(model, metaParamValues);
                break;
            case 'ellipse':
                addEllipseDimensions(model, metaParamValues);
                break;
            case 'flatoval':
                addFlatOvalDimensions(model, metaParamValues);
                break;
            case 'isoscelestriangle':
                addIsoscelesTriangleDimensions(model, metaParamValues);
                break;
            case 'arrow':
                addArrowDimensions(model, metaParamValues);
                break;
            case 'halfcircle':
                addHalfCircleDimensions(model, metaParamValues);
                break;
            case 'quartercircle':
                addQuarterCircleDimensions(model, metaParamValues);
                break;
            case 'hexagon':
                addHexagonDimensions(model, metaParamValues);
                break;
            case 'polygon':
                addPolygonDimensions(model, metaParamValues);
                break;
            case 'octagon':
                addOctagonDimensions(model, metaParamValues);
                break;
            case 'star':
                addStarDimensions(model, metaParamValues);
                break;
            case 'slopedrectangle':
                addSlopedRectangleDimensions(model, metaParamValues);
                break;
            case 'slopedrightrectangle':
                addSlopedRightRectangleDimensions(model, metaParamValues);
                break;
            case 'trapezoid':
                addTrapezoidDimensions(model, metaParamValues);
                break;
            case 'heart':
                addHeartDimensions(model, metaParamValues);
                break;
            case 'kite':
                addKiteDimensions(model, metaParamValues);
                break;
            default:
                console.warn(`Model type ${modelName} not recognized.`);
                break;
        }

        return model;
    }

    // Shape-specific dimension functions

    function addRectangleDimensions(model: IModel, metaParamValues: number[]) {
        const [length, width] = metaParamValues;

        const widthStart = [0, -20];
        const widthEnd = [length, -20];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightStart = [-20, 0];
        const heightEnd = [-20, width];
        addArrowLine(model, heightStart, heightEnd, `Length: ${length.toFixed(2)} cm`, 'lengthDimensionLine');
    }

    function addCircleDimensions(model: IModel, metaParamValues: number[]) {
        const [diameter] = metaParamValues;
        const radius = diameter / 2;

        const startPoint = [-radius, 0];
        const endPoint = [radius, 0];
        addArrowLine(model, startPoint, endPoint, `Diameter: ${diameter.toFixed(2)} cm`, 'diameterDimensionLine');
    }

    function addRightAngledTriangleDimensions(model: IModel, metaParamValues: number[]) {
        const [base, height] = metaParamValues;

        const baseStart = [0, 0];
        const baseEnd = [base, 0];
        addArrowLine(model, baseStart, baseEnd, `Base: ${base.toFixed(2)} cm`, 'baseDimensionLine');

        const heightStart = [base, 0];
        const heightEnd = [base, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addArchedRectangleDimensions(model: IModel, metaParamValues: number[]) {
        const [width, height] = metaParamValues;

        const widthStart = [0, -20];
        const widthEnd = [width, -20];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightStart = [-20, 0];
        const heightEnd = [-20, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addRoundedRectangleDimensions(model: IModel, metaParamValues: number[]) {
        const [length, width, radius] = metaParamValues;

        const widthStart = [0, -20];
        const widthEnd = [width, -20];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const lengthStart = [-20, 0];
        const lengthEnd = [-20, length];
        addArrowLine(model, lengthStart, lengthEnd, `Length: ${length.toFixed(2)} cm`, 'lengthDimensionLine');

        const radiusStart = [width / 2, length];
        const radiusEnd = [width / 2 + radius, length];
        addArrowLine(model, radiusStart, radiusEnd, `Radius: ${radius.toFixed(2)} cm`, 'radiusDimensionLine');
    }

    function addEggDimensions(model: IModel, metaParamValues: number[]) {
        const [width, height] = metaParamValues;

        const widthStart = [0, -20];
        const widthEnd = [width, -20];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightStart = [-20, 0];
        const heightEnd = [-20, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addEllipseDimensions(model: IModel, metaParamValues: number[]) {
        const [width, height] = metaParamValues;

        const widthStart = [-width / 2, 0];
        const widthEnd = [width / 2, 0];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightStart = [0, -height / 2];
        const heightEnd = [0, height / 2];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addFlatOvalDimensions(model: IModel, metaParamValues: number[]) {
        const [width, radius] = metaParamValues;

        const widthStart = [-width / 2, 0];
        const widthEnd = [width / 2, 0];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const radiusStart = [0, -radius];
        const radiusEnd = [0, radius];
        addArrowLine(model, radiusStart, radiusEnd, `Radius: ${radius.toFixed(2)} cm`, 'radiusDimensionLine');
    }

    function addIsoscelesTriangleDimensions(model: IModel, metaParamValues: number[]) {
        const [base, height] = metaParamValues;

        const baseStart = [0, 0];
        const baseEnd = [base, 0];
        addArrowLine(model, baseStart, baseEnd, `Base: ${base.toFixed(2)} cm`, 'baseDimensionLine');

        const heightStart = [base / 2, 0];
        const heightEnd = [base / 2, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addArrowDimensions(model: IModel, metaParamValues: number[]) {
        const [stemLength, stemWidth, headLength, headWidth] = metaParamValues;

        const stemStart = [0, 0];
        const stemEnd = [stemLength, 0];
        addArrowLine(model, stemStart, stemEnd, `Stem Length: ${stemLength.toFixed(2)} cm`, 'stemDimensionLine');

        const headStart = [stemLength, -headWidth / 2];
        const headEnd = [stemLength + headLength, 0];
        addArrowLine(model, headStart, headEnd, `Head Length: ${headLength.toFixed(2)} cm`, 'headDimensionLine');
    }

    function addHalfCircleDimensions(model: IModel, metaParamValues: number[]) {
        const [diameter] = metaParamValues;
        const radius = diameter / 2;

        const startPoint = [-radius, 0];
        const endPoint = [radius, 0];
        addArrowLine(model, startPoint, endPoint, `Diameter: ${diameter.toFixed(2)} cm`, 'diameterDimensionLine');
    }

    function addQuarterCircleDimensions(model: IModel, metaParamValues: number[]) {
        const [radius] = metaParamValues;

        const radiusStart = [0, 0];
        const radiusEnd = [radius, 0];
        addArrowLine(model, radiusStart, radiusEnd, `Radius: ${radius.toFixed(2)} cm`, 'radiusDimensionLine');
    }

    function addHexagonDimensions(model: IModel, metaParamValues: number[]) {
        const [sideLength] = metaParamValues;

        const sideStart = [0, 0];
        const sideEnd = [sideLength, 0];
        addArrowLine(model, sideStart, sideEnd, `Side Length: ${sideLength.toFixed(2)} cm`, 'sideLengthDimensionLine');
    }

    function addPolygonDimensions(model: IModel, metaParamValues: number[]) {
        const [numberOfSides, radius] = metaParamValues;

        const radiusStart = [0, 0];
        const radiusEnd = [radius, 0];
        addArrowLine(model, radiusStart, radiusEnd, `Radius: ${radius.toFixed(2)} cm`, 'radiusDimensionLine');
    }

    function addOctagonDimensions(model: IModel, metaParamValues: number[]) {
        const [sideLength] = metaParamValues;

        const sideStart = [0, 0];
        const sideEnd = [sideLength, 0];
        addArrowLine(model, sideStart, sideEnd, `Side Length: ${sideLength.toFixed(2)} cm`, 'sideLengthDimensionLine');
    }

    function addStarDimensions(model: IModel, metaParamValues: number[]) {
        const [numberOfPoints, outerRadius, innerRadius] = metaParamValues;

        const outerRadiusStart = [0, 0];
        const outerRadiusEnd = [outerRadius, 0];
        addArrowLine(model, outerRadiusStart, outerRadiusEnd, `Outer Radius: ${outerRadius.toFixed(2)} cm`, 'outerRadiusDimensionLine');

        const innerRadiusStart = [0, 0];
        const innerRadiusEnd = [innerRadius, 0];
        addArrowLine(model, innerRadiusStart, innerRadiusEnd, `Inner Radius: ${innerRadius.toFixed(2)} cm`, 'innerRadiusDimensionLine');
    }

    function addSlopedRectangleDimensions(model: IModel, metaParamValues: number[]) {
        const [width, heightLeft, heightRight] = metaParamValues;

        const widthStart = [0, 0];
        const widthEnd = [width, 0];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightLeftStart = [0, 0];
        const heightLeftEnd = [0, heightLeft];
        addArrowLine(model, heightLeftStart, heightLeftEnd, `Height Left: ${heightLeft.toFixed(2)} cm`, 'heightLeftDimensionLine');

        const heightRightStart = [width, 0];
        const heightRightEnd = [width, heightRight];
        addArrowLine(model, heightRightStart, heightRightEnd, `Height Right: ${heightRight.toFixed(2)} cm`, 'heightRightDimensionLine');
    }

    function addSlopedRightRectangleDimensions(model: IModel, metaParamValues: number[]) {
        const [widthTop, widthBottom, height] = metaParamValues;

        const widthTopStart = [0, height];
        const widthTopEnd = [widthTop, height];
        addArrowLine(model, widthTopStart, widthTopEnd, `Width Top: ${widthTop.toFixed(2)} cm`, 'widthTopDimensionLine');

        const widthBottomStart = [0, 0];
        const widthBottomEnd = [widthBottom, 0];
        addArrowLine(model, widthBottomStart, widthBottomEnd, `Width Bottom: ${widthBottom.toFixed(2)} cm`, 'widthBottomDimensionLine');

        const heightStart = [0, 0];
        const heightEnd = [0, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addTrapezoidDimensions(model: IModel, metaParamValues: number[]) {
        const [widthBottom, widthTop, height] = metaParamValues;

        const widthBottomStart = [0, 0];
        const widthBottomEnd = [widthBottom, 0];
        addArrowLine(model, widthBottomStart, widthBottomEnd, `Width Bottom: ${widthBottom.toFixed(2)} cm`, 'widthBottomDimensionLine');

        const widthTopStart = [0, height];
        const widthTopEnd = [widthTop, height];
        addArrowLine(model, widthTopStart, widthTopEnd, `Width Top: ${widthTop.toFixed(2)} cm`, 'widthTopDimensionLine');

        const heightStart = [0, 0];
        const heightEnd = [0, height];
        addArrowLine(model, heightStart, heightEnd, `Height: ${height.toFixed(2)} cm`, 'heightDimensionLine');
    }

    function addHeartDimensions(model: IModel, metaParamValues: number[]) {
        const [radius, angle] = metaParamValues;

        const radiusStart = [0, 0];
        const radiusEnd = [radius, 0];
        addArrowLine(model, radiusStart, radiusEnd, `Radius: ${radius.toFixed(2)} cm`, 'radiusDimensionLine');

        const angleStart = [radius, 0];
        const angleEnd = [radius + 20, 0];
        addArrowLine(model, angleStart, angleEnd, `Angle: ${angle.toFixed(2)} degrees`, 'angleDimensionLine');
    }

    function addKiteDimensions(model: IModel, metaParamValues: number[]) {
        const [width, heightTop, heightBottom] = metaParamValues;

        const widthStart = [-width / 2, 0];
        const widthEnd = [width / 2, 0];
        addArrowLine(model, widthStart, widthEnd, `Width: ${width.toFixed(2)} cm`, 'widthDimensionLine');

        const heightStart = [0, -heightBottom];
        const heightEnd = [0, heightTop];
        addArrowLine(model, heightStart, heightEnd, `Height: ${(heightTop + heightBottom).toFixed(2)} cm`, 'heightDimensionLine');
    }

    // Helper function for adding arrow lines with captions
    function addArrowLine(model: IModel, start: IPoint, end: IPoint, caption: string, name: string) {
        const arrowLine = new MakerJs.models.ArrowLine([start[0], start[1]], [end[0], end[1]], 5, caption);
        MakerJs.model.addModel(model, arrowLine, name);
    }
}
