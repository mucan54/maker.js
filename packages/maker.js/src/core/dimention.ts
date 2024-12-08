namespace MakerJs.dimension {
    var ARROW_OFFSET = 5; // Offset distance between the shape and the dimension arrows
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

    // New function to format measurement text
    function getMeasurementText(value: number): string {
        const unit = MakerJs.manager.getMainModel().units ?? "cm";
        if (unit === 'inch') {
            return `${value.toFixed(0)} in`;
        }

        if(unit === 'mm') {
            return `${value.toFixed(0)} mm`;
        }

        if(unit === 'm') {
            return `${value.toFixed(3)} m`;
        }

        return `${value.toFixed(1)} cm`;
    }

    function addArrowLine(model: IModel, firstPoint: [number, number], secondPoint: [number, number], label: string) {
        const arrowLine = new MakerJs.models.ArrowLine(firstPoint, secondPoint, ARROW_OFFSET / 4, label);
        if (addDimensionsToModel) {
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

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('length', customLangObj)} - ${getMeasurementText(length)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );
    }

    // Circle
    function addCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(
            model,
            [left, centerY],
            [right, centerY],
            `${getLabelText('diameter', customLangObj)} - ${getMeasurementText(diameter)}`
        );
    }

    // Right Angled Triangle
    function addTriangleDimension(model: IModel, base: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];
        const top = extents.high[1];

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('base', customLangObj)} - ${getMeasurementText(base)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(height)}`
        );
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

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(height)}`
        );
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

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(height)}`
        );
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
        const stemBeginHeight = bottom + ((headWidth - stemWidth) / 2);

        // Stem Length (Horizontal Arrow)
        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [left + stemLength, bottom - ARROW_OFFSET],
            `${getLabelText('stemLength', customLangObj)} - ${getMeasurementText(stemLength)}`
        );

        // Head Length (Horizontal Arrow)
        addArrowLine(
            model,
            [left + stemLength, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('headLength', customLangObj)} - ${getMeasurementText(headLength)}`
        );

        // Head Width (Vertical Arrow)
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('headWidth', customLangObj)} - ${getMeasurementText(headWidth)}`
        );

        // Stem Width (Vertical Arrow)
        addArrowLine(
            model,
            [left - ARROW_OFFSET, stemBeginHeight],
            [left - ARROW_OFFSET, stemBeginHeight + stemWidth],
            `${getLabelText('stemWidth', customLangObj)} - ${getMeasurementText(stemWidth)}`
        );
    }

    // Half Circle
    function addHalfCircleDimension(model: IModel, diameter: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('diameter', customLangObj)} - ${getMeasurementText(diameter)}`
        );
    }

    // Quarter Circle
    function addQuarterCircleDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const bottom = extents.low[1];

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('radius', customLangObj)} - ${getMeasurementText(radius)}`
        );
    }

    // Hexagon
    function addHexagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const top = extents.high[1];
        const bottom = extents.low[1];
        const width = right - left;

        // Width arrow (top)
        addArrowLine(
            model,
            [left, top + ARROW_OFFSET],
            [right, top + ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );

        // Side length arrow (bottom center)
        const midBottomX = (left + right) / 2 - (sideLength / 2);
        addArrowLine(
            model,
            [midBottomX, bottom - ARROW_OFFSET],
            [midBottomX + sideLength, bottom - ARROW_OFFSET],
            `${getLabelText('length', customLangObj)} - ${getMeasurementText(sideLength)}`
        );
    }

    // Polygon
    function addPolygonDimension(model: IModel, radius: number, customLangObj?: LanguageLabels) {
        const diameter = radius * 2;
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const centerY = (extents.low[1] + extents.high[1]) / 2;

        addArrowLine(
            model,
            [left, centerY],
            [right, centerY],
            `${getLabelText('diameter', customLangObj)} - ${getMeasurementText(diameter)}`
        );
    }

    // Octagon
    function addOctagonDimension(model: IModel, sideLength: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const top = extents.high[1];
        const bottom = extents.low[1];
        const width = right - left;
        const height = top - bottom;

        // Width arrow (top)
        addArrowLine(
            model,
            [left, top + ARROW_OFFSET],
            [right, top + ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );

        // Height arrow (left)
        addArrowLine(
            model,
            [left - ARROW_OFFSET, bottom],
            [left - ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(height)}`
        );

        // Side length arrow (bottom center)
        const midBottomX = (left + right) / 2 - (sideLength / 2);
        addArrowLine(
            model,
            [midBottomX, bottom - ARROW_OFFSET],
            [midBottomX + sideLength, bottom - ARROW_OFFSET],
            `${getLabelText('length', customLangObj)} - ${getMeasurementText(sideLength)}`
        );
    }

    // Star
    function addStarDimension(model: IModel, outerRadius: number, innerRadius: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const top = extents.high[1];
        const bottom = extents.low[1];

        // Outer diameter
        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('radius', customLangObj)} - ${getMeasurementText(outerRadius)}`
        );

        // Inner diameter (assumed vertical)
        const centerX = (left + right) / 2;
        addArrowLine(
            model,
            [centerX + innerRadius, bottom],
            [centerX + innerRadius, top],
            `${getLabelText('radius', customLangObj)} - ${getMeasurementText(innerRadius)}`
        );
    }

    // Sloped Rectangle
    function addSlopedRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const leftBottom = extents.low[0];
        const rightBottom = leftBottom + widthBottom;
        const leftTop = (extents.high[0] + extents.low[0] - widthTop) / 2;
        const rightTop = leftTop + widthTop;
        const bottom = extents.low[1];
        const top = extents.high[1];

        // Bottom width
        addArrowLine(
            model,
            [leftBottom, bottom - ARROW_OFFSET],
            [rightBottom, bottom - ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(widthBottom)}`
        );

        // Top width
        addArrowLine(
            model,
            [leftTop, top + ARROW_OFFSET],
            [rightTop, top + ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(widthTop)}`
        );

        // Height
        addArrowLine(
            model,
            [rightBottom + ARROW_OFFSET, bottom],
            [rightBottom + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(height)}`
        );
    }

    // Sloped Right Rectangle
    function addSlopedRightRectangleDimension(model: IModel, widthTop: number, widthBottom: number, height: number, customLangObj?: LanguageLabels) {
        addSlopedRectangleDimension(model, widthTop, widthBottom, height, customLangObj);
    }

    // Trapezoid
    function addTrapezoidDimension(model: IModel, widthBottom: number, widthTop: number, height: number, customLangObj?: LanguageLabels) {
        addSlopedRectangleDimension(model, widthTop, widthBottom, height, customLangObj);
    }

    // Heart
    function addHeartDimension(model: IModel, width: number, height: number, customLangObj?: LanguageLabels) {
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const top = extents.high[1];
        const bottom = extents.low[1];
        const calculatedWidth = right - left;
        const calculatedHeight = top - bottom;

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(calculatedWidth)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(calculatedHeight)}`
        );
    }

    // Kite
    function addKiteDimension(model: IModel, width: number, heightTop: number, heightBottom: number, customLangObj?: LanguageLabels) {
        const totalHeight = heightTop + heightBottom;
        const extents = MakerJs.measure.modelExtents(model);
        const left = extents.low[0];
        const right = extents.high[0];
        const top = extents.high[1];
        const bottom = extents.low[1];

        addArrowLine(
            model,
            [left, bottom - ARROW_OFFSET],
            [right, bottom - ARROW_OFFSET],
            `${getLabelText('width', customLangObj)} - ${getMeasurementText(width)}`
        );
        addArrowLine(
            model,
            [right + ARROW_OFFSET, bottom],
            [right + ARROW_OFFSET, top],
            `${getLabelText('height', customLangObj)} - ${getMeasurementText(totalHeight)}`
        );
    }

    // Parse shape type from constructor and apply corresponding dimensions
    export function applyDimensions(model: any, metaParamValues: number[], customLangObj?: LanguageLabels) {
        const modelName = typeof model === 'string' ? model.toLowerCase() : model.constructor.name.toLowerCase();

        //@ts-ignore
        model = typeof model === 'string' ? new MakerJs.models[model](...metaParamValues) : model;

        dimensionModels = {};
        dimensionModels.models = {};
        dimensionModels.models.dimensions = {};

        ARROW_OFFSET = Math.max(MakerJs.measure.modelExtents(model).high[1], MakerJs.measure.modelExtents(model).high[0]) / 10;

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

        return dimensionModels;
    }
}
