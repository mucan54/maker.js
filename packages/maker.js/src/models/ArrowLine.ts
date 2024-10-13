namespace MakerJs.models {
    export class ArrowLine implements IModel {
        public paths: IPathMap = {};
        public models: IModelMap = {};
        public caption: ICaption;

        constructor(
            FirstArrowLocation: [number, number],
            SecondArrowLocation: [number, number],
            arrowLength: number,
            captionText?: string
        ) {
            // Calculate angle between first and second points
            const dx = SecondArrowLocation[0] - FirstArrowLocation[0];
            const dy = SecondArrowLocation[1] - FirstArrowLocation[1];
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            // Create the first arrow, pointing towards the second point
            this.models.firstArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.firstArrow, FirstArrowLocation);
            MakerJs.model.rotate(this.models.firstArrow, angle, FirstArrowLocation); // Rotate based on the line direction

            // Create the second arrow, pointing back towards the first point
            this.models.secondArrow = new models.SimpleArrow(arrowLength);
            MakerJs.model.move(this.models.secondArrow, SecondArrowLocation);
            MakerJs.model.rotate(this.models.secondArrow, angle + 180, SecondArrowLocation); // Rotate in the opposite direction

            // Create the dimension line
            this.paths.line = new MakerJs.paths.Line(FirstArrowLocation, SecondArrowLocation);

            // Calculate the midpoint of the line for the caption
            const midPoint = MakerJs.point.average(FirstArrowLocation, SecondArrowLocation);

            // Set the left and right anchor points for the caption
            const captionLength = 50; // Length of the caption line for anchoring
            const halfCaptionLength = captionLength / 2;
            const leftAnchorPoint = [midPoint[0] - halfCaptionLength, midPoint[1]] as [number, number];
            const rightAnchorPoint = [midPoint[0] + halfCaptionLength, midPoint[1]] as [number, number];

            // Add the caption with proper rotation transform
            MakerJs.model.addCaption(this, captionText || '', leftAnchorPoint, rightAnchorPoint);

            // Applying transform to rotate the text according to the angle of the line
            const svgText = document.querySelector('text'); // Assuming there's only one text element
            if (svgText) {
                svgText.setAttribute('transform', `rotate(${angle}, ${midPoint[0]}, ${midPoint[1]})`);
                svgText.setAttribute('stroke', 'none');
            }
        }
    }

    (<IKit>ArrowLine).metaParameters = [
        { title: "First Arrow Location X", type: "range", min: 0, max: 500, value: 100 },
        { title: "First Arrow Location Y", type: "range", min: 0, max: 500, value: 100 },
        { title: "Second Arrow Location X", type: "range", min: 0, max: 500, value: 400 },
        { title: "Second Arrow Location Y", type: "range", min: 0, max: 500, value: 100 },
        { title: "Arrow Length", type: "range", min: 10, max: 100, value: 20 },
        { title: "Caption", type: "text", value: "Dimension" }
    ];
}
