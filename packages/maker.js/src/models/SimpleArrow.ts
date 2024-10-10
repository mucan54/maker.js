namespace MakerJs.models {

    export class SimpleArrow implements IModel {
        public paths: IPathMap = {};

        constructor(arrowLength: number) {
            // Define the arrowhead as two simple lines pointing in the positive X direction
            this.paths = {
                arrowLine1: new MakerJs.paths.Line([0, 0], [arrowLength, -arrowLength / 2]), // Now points forward
                arrowLine2: new MakerJs.paths.Line([0, 0], [arrowLength, arrowLength / 2])   // Now points forward
            };
        }
    }

    (<IKit>SimpleArrow).metaParameters = [
        { title: "Length", type: "range", min: 1, max: 100, value: 50 }
    ];
}