namespace MakerJs.dimension {

    const ARROW_OFFSET = 20; // The offset distance between the shape and the dimension arrows

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

    function addArrowLine(model: IModel, firstPoint: [number, number], secondPoint: [number, number], length: number, label: string) {
        const arrowLine = new MakerJs.models.ArrowLine(firstPoint, secondPoint, 5, label);
        MakerJs.model.addModel(model, arrowLine, `${label}DimensionLine`);
    }

    function addRectangleDimension(model: IModel, length: number, width: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], length, `${getLabelText('length', customLangObj)} - ${length.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], width, `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
    }

    function addCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(model, [left - ARROW_OFFSET, centerY], [right + ARROW_OFFSET, centerY], diameter, `${getLabelText('diameter', customLangObj)} - ${diameter.toFixed(2)} cm`);
    }

    function addTriangleDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], base, `${getLabelText('base', customLangObj)} - ${base.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], height, `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    function addRightAngledTriangleMirroredDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        addTriangleDimension(model, base, height, customLangObj); // Similar to Right Angled Triangle
    }

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
        addArrowLine(model, [left, bottom - ARROW_OFFSET], [left + stemLength, bottom - ARROW_OFFSET], stemLength, `${getLabelText('stemLength', customLangObj)} - ${stemLength.toFixed(2)} cm`);

        // Head Length (Horizontal Arrow)
        addArrowLine(model, [left + stemLength, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], headLength, `${getLabelText('headLength', customLangObj)} - ${headLength.toFixed(2)} cm`);

        // Head Width (Vertical Arrow)
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], headWidth, `${getLabelText('headWidth', customLangObj)} - ${headWidth.toFixed(2)} cm`);

        // Corrected Stem Width (Vertical Arrow) - align with the mid-section of the stem
        addArrowLine(model, [left - ARROW_OFFSET, stemBeginHeight], [left - ARROW_OFFSET, stemBeginHeight + stemWidth], stemWidth, `${getLabelText('stemWidth', customLangObj)} - ${stemWidth.toFixed(2)} cm`);
    }

    function addPolygonDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left - ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], radius * 2, `${getLabelText('radius', customLangObj)} - ${radius.toFixed(2)} cm`);
    }

    function addEllipseDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], width, `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], height, `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    function addHeartDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const bottom = extents.low[1];
        const top = extents.high[1];
        const left = extents.low[0];
        const right = extents.high[0];

        addArrowLine(model, [left - ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], radius, `${getLabelText('radius', customLangObj)} - ${radius.toFixed(2)} cm`);
    }

    function addSlopedRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], widthBottom, `${getLabelText('width', customLangObj)} - ${widthBottom.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], height, `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    function addArchedRectangleDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], width, `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], height, `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    function addHalfCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], diameter, `${getLabelText('diameter', customLangObj)} - ${diameter.toFixed(2)} cm`);
    }

    function addQuarterCircleDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], radius * 2, `${getLabelText('radius', customLangObj)} - ${radius.toFixed(2)} cm`);
    }

    function addHexagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        addPolygonDimension(model, sideLength, customLangObj); // Similar to polygon dimensions
    }

    function addOctagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        addPolygonDimension(model, sideLength, customLangObj); // Similar to polygon dimensions
    }

    function addStarDimension(model: IModel, outerRadius: number, innerRadius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], outerRadius * 2, `${getLabelText('radius', customLangObj)} - ${outerRadius.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], innerRadius * 2, `${getLabelText('radius', customLangObj)} - ${innerRadius.toFixed(2)} cm`);
    }

    function addKiteDimension(model: IModel, width: number, heightTop: number, heightBottom: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], width, `${getLabelText('width', customLangObj)} - ${width.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], heightTop + heightBottom, `${getLabelText('height', customLangObj)} - ${(heightTop + heightBottom).toFixed(2)} cm`);
    }

    function addTrapezoidDimension(model: IModel, widthBottom: number, widthTop: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], widthBottom, `${getLabelText('width', customLangObj)} - ${widthBottom.toFixed(2)} cm`);
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], height, `${getLabelText('height', customLangObj)} - ${height.toFixed(2)} cm`);
    }

    // Parse shape type from constructor and apply corresponding dimensions
    export function applyDimensions(model: IModel, metaParamValues: number[], customLangObj?: LanguageLabels) {
        const modelName = (model.constructor as any).name.toLowerCase();

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
                addArchedRectangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'egg':
                addEllipseDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'ellipse':
                addEllipseDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'flatoval':
                addEllipseDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'isoscelestriangle':
                addTriangleDimension(model, metaParamValues[0], metaParamValues[1], customLangObj);
                break;
            case 'arrow':
                addArrowDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], metaParamValues[3], customLangObj);
                break;
            case 'halfCircle':
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
                addSlopedRectangleDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            case 'trapezoid':
                addTrapezoidDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            case 'heart':
                addHeartDimension(model, metaParamValues[0], customLangObj);
                break;
            case 'kite':
                addKiteDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], customLangObj);
                break;
            default:
                throw new Error(`Model type not recognized: ${modelName}`);
        }
    }
}