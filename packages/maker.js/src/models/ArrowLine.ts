namespace MakerJs.models {
    export class ArrowLine implements IModel {
        public paths: IPathMap = {};
        public models: IModelMap = {};
        public caption: ICaption;

        constructor(
            FirstArrowLocation: [number, number],
            SecondArrowLocation: [number, number],
            baseArrowLength: number = 10, // Default arrow length
            captionText?: string
        ) {

            // Calculate the length of the line
            const lineLength = MakerJs.measure.pointDistance(FirstArrowLocation, SecondArrowLocation);

            // Adjust arrow size based on the length of the line
            const arrowLength = Math.max(baseArrowLength / 2, lineLength * 0.0125); // Arrow length is 5% of the line, min. 20

            // Adjust font size based on the length of the line
            const fontSize = Math.max(15, lineLength * 0.2); // Font size is 2% of the line, min. 10px

            // Calculate the angle between the first and second points
            const dx = SecondArrowLocation[0] - FirstArrowLocation[0];
            const dy = SecondArrowLocation[1] - FirstArrowLocation[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Midpoint for the caption text
            const midPoint = MakerJs.point.average(FirstArrowLocation, SecondArrowLocation);

            // Add background rectangle behind the caption
            const textLength = ((captionText || "Dimension").length + 4) * (fontSize); // Estimate the text length
            const rectWidth = textLength / 15;
            const rectHeight = 2;

            //@ts-ignore
            this.models.layer = "dimension-model";

            // Create the rectangle as a model, not a path
            const backgroundRect = new MakerJs.models.Rectangle(rectWidth, rectHeight);

            //move the center of the rectangle to the midpoint
            //@ts-ignore
            backgroundRect.layer = "dimension-text";
            backgroundRect.origin = [midPoint[0] - (rectWidth / 2), midPoint[1] - (rectHeight / 2)];

            // Rotate the rectangle based on the angle of the line
            MakerJs.model.rotate(backgroundRect, angle, midPoint);

            const cloneRect = MakerJs.cloneObject(backgroundRect);
            const lineMain = new MakerJs.models.Line(FirstArrowLocation, SecondArrowLocation);
            const line = MakerJs.model.combineSubtraction(lineMain, cloneRect);

            // Add the caption with the rectangle as background
            MakerJs.model.addCaption(this, captionText || "Dimension", FirstArrowLocation, SecondArrowLocation);

            this.models.lineShape = line;
            this.models.backgroundRect = backgroundRect;


            if(rectWidth >= lineLength) {
                return;
            }

            // Create the first arrow
            this.models.firstArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.firstArrow, FirstArrowLocation);
            MakerJs.model.rotate(this.models.firstArrow, angle, FirstArrowLocation);

            // Create the second arrow
            this.models.secondArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.secondArrow, SecondArrowLocation);
            MakerJs.model.rotate(this.models.secondArrow, angle + 180, SecondArrowLocation);
        }
    }

    (<IKit>ArrowLine).metaParameters = [
        { title: "First Arrow Location X", type: "range", min: 0, max: 500, value: 100 },
        { title: "First Arrow Location Y", type: "range", min: 0, max: 500, value: 100 },
        { title: "Second Arrow Location X", type: "range", min: 0, max: 500, value: 400 },
        { title: "Second Arrow Location Y", type: "range", min: 0, max: 500, value: 100 },
        { title: "Base Arrow Length", type: "range", min: 1, max: 100, value: 10 },
        { title: "Caption", type: "text", value: "Dimension" }
    ];
}
