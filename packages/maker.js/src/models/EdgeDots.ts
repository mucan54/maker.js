namespace MakerJs.models {

    export class EdgeDots implements IModel {
        public paths: IPathMap = {};

        constructor(rectWidth: number, rectHeight: number, dotDistance: number, scale: number) {
            const makerjs = require('makerjs');
            const scaledWidth = rectWidth * scale;
            const scaledHeight = rectHeight * scale;
            const scaledDotDistance = dotDistance * scale;

            // Add dots to each edge
            this.paths["leftEdge"] = new makerjs.paths.Circle([scaledDotDistance, scaledHeight / 2], (1.4 / 2) * scale);
            this.paths["rightEdge"] = new makerjs.paths.Circle([scaledWidth - scaledDotDistance, scaledHeight / 2], (1.4 / 2) * scale);
            this.paths["topEdge"] = new makerjs.paths.Circle([scaledWidth / 2, scaledDotDistance], (1.4 / 2) * scale);
            this.paths["bottomEdge"] = new makerjs.paths.Circle([scaledWidth / 2, scaledHeight - scaledDotDistance], (1.4 / 2) * scale);
        }
    }

    (<IKit>EdgeDots).metaParameters = [
        { title: "Rectangle Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Rectangle Height", type: "range", min: 1, max: 100, value: 50 },
        { title: "Dot Distance", type: "range", min: 1, max: 20, value: 3.2 },
        { title: "Scale", type: "range", min: 1, max: 20, value: 10 }
    ];

}
