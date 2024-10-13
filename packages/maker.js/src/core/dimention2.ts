namespace MakerJs.dimension2 {

    const ARROW_OFFSET = 5; // Offset distance between the shape and the dimension arrows
    var dimensionModels: IModel = {};
    var dimensionCustomLangObj: Partial<LanguageLabels> = {};
    var dimensionAddtoModel: true;

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
        const langObj = Object.keys(dimensionCustomLangObj).length ? dimensionCustomLangObj : (customLangObj || defaultLanguageLabels);
        return langObj[labelKey];
    }

    function addArrowLine(model: IModel, firstPoint: [number, number], secondPoint: [number, number], key: string) {
        const label = `${getLabelText('length')} - ${length.toFixed(2)} cm`;
        const arrowLine = new MakerJs.models.ArrowLine(firstPoint, secondPoint, 3, label);
        if(dimensionAddtoModel) {
            MakerJs.model.addModel(model, arrowLine, key);
        }
        dimensionModels.models.dimensions[key] = arrowLine;
    }

    // Rectangle
    function addRectangleDimension(model: IModel, length: number, width: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'length');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'width');
    }

    // Circle
    function addCircleDimension(model: IModel, diameter: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(model, [left, centerY], [right, centerY], 'diameter');
    }

    // Right Angled Triangle
    function addTriangleDimension(model: IModel, base: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'base');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Right Angled Triangle Mirrored
    function addRightAngledTriangleMirroredDimension(model: IModel, base: number, height: number) {
        addTriangleDimension(model, base, height); // Mirrored but same dimensions
    }

    // Arched Rectangle
    function addArchedRectangleDimension(model: IModel, width: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Rounded Rectangle
    function addRoundedRectangleDimension(model: IModel, width: number, height: number) {
        addArchedRectangleDimension(model, width, height);
    }

    // Egg
    function addEggDimension(model: IModel, width: number, height: number) {
        addEllipseDimension(model, width, height);
    }

    // Ellipse
    function addEllipseDimension(model: IModel, width: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Flat Oval
    function addFlatOvalDimension(model: IModel, width: number, height: number) {
        addEllipseDimension(model, width, height);
    }

    // Isosceles Triangle
    function addIsoscelesTriangleDimension(model: IModel, base: number, height: number) {
        addTriangleDimension(model, base, height);
    }

    // Arrow
    function addArrowDimension(model: IModel, stemLength: number, stemWidth: number, headLength: number, headWidth: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [left + stemLength, bottom - ARROW_OFFSET], 'stemLength');
        addArrowLine(model, [left + stemLength, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'headLength');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'headWidth');
        addArrowLine(model, [left - ARROW_OFFSET, bottom], [left - ARROW_OFFSET, top], 'stemWidth');
    }

    // Half Circle
    function addHalfCircleDimension(model: IModel, diameter: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'diameter');
    }

    // Quarter Circle
    function addQuarterCircleDimension(model: IModel, radius: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'radius');
    }

    // Hexagon
    function addHexagonDimension(model: IModel, sideLength: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];
        const width = right - left;
        const height = top - bottom;

        addArrowLine(model, [left, top + ARROW_OFFSET], [right, top + ARROW_OFFSET], 'width');
        addArrowLine(model, [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET], [(left + right) / 2 + (sideLength / 2), bottom - ARROW_OFFSET], 'length');
    }

    // Polygon
    function addPolygonDimension(model: IModel, radius: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(model, [left, centerY], [right, centerY], 'diameter');
    }

    // Octagon
    function addOctagonDimension(model: IModel, sideLength: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];
        const width = right - left;
        const height = top - bottom;

        addArrowLine(model, [left, top + ARROW_OFFSET], [right, top + ARROW_OFFSET], 'width');
        addArrowLine(model, [left - ARROW_OFFSET, bottom], [left - ARROW_OFFSET, top], 'height');
        addArrowLine(model, [(left + right) / 2 - (sideLength / 2), bottom - ARROW_OFFSET], [(left + right) / 2 + (sideLength / 2), bottom - ARROW_OFFSET], 'length');
    }

    // Star
    function addStarDimension(model: IModel, outerRadius: number, innerRadius: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'outerRadius');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'innerRadius');
    }

    // Sloped Rectangle
    function addSlopedRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Sloped Right Rectangle
    function addSlopedRightRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number) {
        addSlopedRectangleDimension(model, widthTop, widthBottom, height);
    }

    // Trapezoid
    function addTrapezoidDimension(model: IModel, widthBottom: number, widthTop: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Heart
    function addHeartDimension(model: IModel, width: number, height: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Kite
    function addKiteDimension(model: IModel, width: number, heightTop: number, heightBottom: number) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(model, [left, bottom - ARROW_OFFSET], [right, bottom - ARROW_OFFSET], 'width');
        addArrowLine(model, [right + ARROW_OFFSET, bottom], [right + ARROW_OFFSET, top], 'height');
    }

    // Apply dimensions based on the model type
    export function applyDimensions(model: IModel, metaParamValues: number[]) {
        const modelName = (model.constructor as any).name.toLowerCase();
        dimensionModels = {};
        dimensionModels.models = {};
        dimensionModels.models.dimensions = {};
        dimensionModels.models['frame'] = new MakerJs.models.Rectangle(MakerJs.measure.modelExtents(model));

        switch (modelName) {
            case 'rectangle':
                addRectangleDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'circle':
                addCircleDimension(model, metaParamValues[0]);
                break;
            case 'rightangledtriangle':
                addTriangleDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'rightangledtrianglemirrored':
                addRightAngledTriangleMirroredDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'archedrectangle':
                addArchedRectangleDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'roundedrectangle':
                addRoundedRectangleDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'egg':
                addEggDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'ellipse':
                addEllipseDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'flatoval':
                addFlatOvalDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'isoscelestriangle':
                addIsoscelesTriangleDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'arrow':
                addArrowDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2], metaParamValues[3]);
                break;
            case 'halfcircle':
                addHalfCircleDimension(model, metaParamValues[0]);
                break;
            case 'quartercircle':
                addQuarterCircleDimension(model, metaParamValues[0]);
                break;
            case 'hexagon':
                addHexagonDimension(model, metaParamValues[0]);
                break;
            case 'polygon':
                addPolygonDimension(model, metaParamValues[0]);
                break;
            case 'octagon':
                addOctagonDimension(model, metaParamValues[0]);
                break;
            case 'star':
                addStarDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'slopedrectangle':
                addSlopedRectangleDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2]);
                break;
            case 'slopedrightrectangle':
                addSlopedRightRectangleDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2]);
                break;
            case 'trapezoid':
                addTrapezoidDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2]);
                break;
            case 'heart':
                addHeartDimension(model, metaParamValues[0], metaParamValues[1]);
                break;
            case 'kite':
                addKiteDimension(model, metaParamValues[0], metaParamValues[1], metaParamValues[2]);
                break;
            default:
                throw new Error(`Model type not recognized: ${modelName}`);
        }

        return dimensionModels;
    }
}
