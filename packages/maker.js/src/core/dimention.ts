namespace MakerJs.dimension {
    const ARROW_OFFSET = 5; // Offset distance between the shape and the dimension arrows
    var dimensionModels: IModel = {};
    var addDimensionsToModel: boolean = true;

    interface LanguageLabels {
        length: string;
        width: string;
        height: string;
        base: string;
        diameter: string;
        radius: string;
        stemLength: string;
        stemWidth: string;
        headLength: string;
        headWidth: string;
    }

    const defaultLanguageLabels: LanguageLabels = {
        length: 'Length',
        width: 'Width',
        height: 'Height',
        base: 'Base',
        diameter: 'Diameter',
        radius: 'Radius',
        stemLength: 'Stem Length',
        stemWidth: 'Stem Width',
        headLength: 'Head Length',
        headWidth: 'Head Width'
    };

    function getLabelText(labelKey: keyof LanguageLabels, customLangObj?: LanguageLabels): string {
        const langObj = customLangObj || defaultLanguageLabels;
        return langObj[labelKey];
    }

    function addArrowLine(model: IModel, firstPoint: [number, number], secondPoint: [number, number], label: string) {
        const bestArrowLength = Math.min(3, MakerJs.measure.pointDistance(firstPoint, secondPoint) / 4);
        const arrowLine = new MakerJs.models.ArrowLine(firstPoint, secondPoint, 3, label);
        if(addDimensionsToModel) {
            MakerJs.model.addModel(model, arrowLine, 'dimensions');
        }
        dimensionModels.models[label] = arrowLine;
    }

    // Rectangle
    function addRectangleDimension(model: IModel, length: number, width: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('length', customLangObj)} - ${length.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
    }

    // Circle
    function addCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(model, [left, centerY], [right, centerY], `${getLabelText('diameter', customLangObj)} - ${diameter.toFixed(2)} cm`);
    }

    // Right Angled Triangle
    function addTriangleDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('base', customLangObj)} - ${base.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Right Angled Triangle Mirrored
    function addRightAngledTriangleMirroredDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        addTriangleDimension(model, base, height, customLangObj); // Mirrored but same dimensions
    }

    // Arched Rectangle
    function addArchedRectangleDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Rounded Rectangle
    function addRoundedRectangleDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        addArchedRectangleDimension(model, width, height, customLangObj);
    }

    // Egg
    function addEggDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        addEllipseDimension(model, width, height, customLangObj);
    }

    // Ellipse
    function addEllipseDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Flat Oval
    function addFlatOvalDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        addEllipseDimension(model, width, height, customLangObj);
    }

    // Isosceles Triangle
    function addIsoscelesTriangleDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        addTriangleDimension(model, base, height, customLangObj);
    }

    // Arrow
    function addArrowDimension(model: IModel, stemLength: number, stemWidth: number, headLength: number, headWidth: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        // Adjusted calculation for stem top and bottom
        const stemMidHeight = bottom + (stemWidth / 2);
        const stemBottom = bottom;
        const stemTop = bottom + stemWidth;
        const stemBeginHeight = bottom + ((headWidth - stemWidth) / 2);

        // Stem Length (Horizontal Arrow)
        addArrowLine(model, [left, bottom - ARROW_OFFSET], [left + stemLength, bottom - ARROW_OFFSET], `${getLabelText('stemLength', customLangObj)} - ${stemLength.toFixed(2)} cm`);

        // Head Length (Horizontal Arrow)
        addArrowLine(model, [left + stemLength, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('headLength', customLangObj)} - ${headLength.toFixed(2)} cm`);

        // Head Width (Vertical Arrow)
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('headWidth', customLangObj)} - ${headWidth.toFixed(2)} cm`);

        // Corrected Stem Width (Vertical Arrow) - align with the mid-section of the stem
        addArrowLine(model, [left - ARROW_OFFSET, stemBeginHeight], [left - ARROW_OFFSET, stemBeginHeight + stemWidth], `${getLabelText('stemWidth', customLangObj)} - ${stemWidth.toFixed(2)} cm`);
    }

    // Half Circle
    function addHalfCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('diameter', customLangObj)} - ${diameter.toFixed(2)} cm`);
    }

    // Quarter Circle
    function addQuarterCircleDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('radius', customLangObj)} - ${radius.toFixed(2)} cm`);
    }

    // Hexagon
    function addHexagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];
        const width = right - left;
        const height = top - bottom;

        // Width arrow (top)
        addArrowLine(model, [left, top + ARROW_OFFSET], [right, top + ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);

        // Side length arrow (bottom center)
        const midBottom = [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET];
        addArrowLine(model, [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET], [midBottom[0] + sideLength, bottom - ARROW_OFFSET], `${getLabelText('length', customLangObj)} - ${sideLength.toFixed(2)} cm`);
    }

    // Polygon
    function addPolygonDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(model, [left, centerY], [right, centerY], `${getLabelText('diameter', customLangObj)} - ${(radius * 2).toFixed(2)} cm`);
    }

    // Octagon
    function addOctagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];
        const width = right - left;
        const height = top - bottom;

        // Width arrow (top)
        addArrowLine(model, [left, top + ARROW_OFFSET], [right, top + ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);

        // Height arrow (left)
        addArrowLine(model, [left - ARROW_OFFSET, bottom], [left - ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);

        // Side length arrow (bottom center)
        const midBottom = [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET];
        addArrowLine(model, [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET], [midBottom[0] + sideLength, bottom - ARROW_OFFSET], `${getLabelText('length', customLangObj)} - ${sideLength.toFixed(2)} cm`);
    }

    // Star
    function addStarDimension(model: IModel, outerRadius: number, innerRadius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('radius', customLangObj)} - ${outerRadius.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('radius', customLangObj)} - ${innerRadius.toFixed(2)} cm`);
    }

    // Sloped Rectangle
    function addSlopedRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${widthBottom.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Sloped Right Rectangle
    function addSlopedRightRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number, customLangObj?: LanguageLabels) {
        addSlopedRectangleDimension(model, widthTop, widthBottom, height, customLangObj);
    }

    // Trapezoid
    function addTrapezoidDimension(model: IModel, widthBottom: number, widthTop: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${widthBottom.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Heart
    function addHeartDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];
        const calculatedWidht = right - left;
        const calculatedHeight = top - bottom;

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${calculatedWidht.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${calculatedHeight.toFixed(2)} cm`);
    }

    // Kite
    function addKiteDimension(model: IModel, width: number, heightTop: number, heightBottom: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], `${getLabelText('height', customLangObj)} - ${(heightTop + heightBottom).toFixed(2)} cm`);
    }

    // Parse shape type from constructor and apply corresponding dimensions
    export function applyDimensions(model: any, metaParamValues: number[], customLangObj?: LanguageLabels) {
        //check if model is string or object if string just lowercase it and assign to modelName
        const modelName = typeof model === 'string' ? model.toLowerCase() : model.constructor.name.toLowerCase();

        // Create a new model to store the dimensions
        //@ts-ignore
        model = typeof model === 'string' ? new MakerJs.models[model](...metaParamValues) : model;

        dimensionModels = {};
        dimensionModels.models = {};
        dimensionModels.models.dimensions = {};

        // Create a rectangle frame around the model
        //const frame = new MakerJs.models.Rectangle(MakerJs.measure.modelExtents(model));

        switch (modelName) {
            case 'rectangle':
                addRectangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'circle':
                addCircleDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'rightangledtriangle':
                addTriangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'rightangledtrianglemirrored':
                addRightAngledTriangleMirroredDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'archedrectangle':
                addArchedRectangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'roundedrectangle':
                addRoundedRectangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'egg':
                addEggDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'ellipse':
                addEllipseDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'flatoval':
                addFlatOvalDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'isoscelestriangle':
                addIsoscelesTriangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'arrow':
                addArrowDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], metaParamValues[3], customLangObj);
                break;
            case 'halfcircle':
                addHalfCircleDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'quartercircle':
                addQuarterCircleDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'hexagon':
                addHexagonDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'polygon':
                addPolygonDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'octagon':
                addOctagonDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'star':
                addStarDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'slopedrectangle':
                addSlopedRectangleDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            case 'slopedrightrectangle':
                addSlopedRightRectangleDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            case 'trapezoid':
                addTrapezoidDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            case 'heart':
                addHeartDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'kite':
                addKiteDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            default:
                throw new Error(`Model type not recognized: ${modelName}`);
        }

        //dimensionModels.models['frame'] = frame;
        return dimensionModels;
    }
}
