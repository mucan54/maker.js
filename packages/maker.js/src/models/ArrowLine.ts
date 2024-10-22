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
            const arrowLength = Math.max(baseArrowLength, lineLength * 0.025); // Arrow length is 5% of the line, min. 20

            // Adjust font size based on the length of the line
            const fontSize = Math.max(10, lineLength * 0.02); // Font size is 2% of the line, min. 10px

            // Calculate the angle between the first and second points
            const dx = SecondArrowLocation[0] - FirstArrowLocation[0];
            const dy = SecondArrowLocation[1] - FirstArrowLocation[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Create the first arrow
            this.models.firstArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.firstArrow, FirstArrowLocation);
            MakerJs.model.rotate(this.models.firstArrow, angle, FirstArrowLocation);

            // Create the second arrow
            this.models.secondArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.secondArrow, SecondArrowLocation);
            MakerJs.model.rotate(this.models.secondArrow, angle + 180, SecondArrowLocation);

            // Create the line
            this.paths.line = new MakerJs.paths.Line(FirstArrowLocation, SecondArrowLocation);

            // Calculate the midpoint for the text
            const midPoint = MakerJs.point.average(FirstArrowLocation, SecondArrowLocation);

            // Fixed text placement
            const captionLength = 50; // We can use a fixed caption area
            const halfCaptionLength = captionLength / 2;
            const leftAnchorPoint = [midPoint[0] - halfCaptionLength, midPoint[1]] as [number, number];
            const rightAnchorPoint = [midPoint[0] + halfCaptionLength, midPoint[1]] as [number, number];
            MakerJs.model.addCaption(this, captionText || "Dimension", leftAnchorPoint, rightAnchorPoint);
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
