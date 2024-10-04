namespace MakerJs.models {

    export class CornerDots implements IModel {
        public paths: IPathMap = {};

        constructor(rectWidth: number, rectHeight: number, dotDistance: number, scale: number) {
            const scaledWidth = rectWidth * scale;
            const scaledHeight = rectHeight * scale;
            const scaledDotDistance = dotDistance * scale;

            // Add dots to each corner
            this.paths["topLeft"] = new paths.Circle([scaledDotDistance, scaledDotDistance], (1.4 / 2) * scale);
            this.paths["topRight"] = new paths.Circle([scaledWidth - scaledDotDistance, scaledDotDistance], (1.4 / 2) * scale);
            this.paths["bottomLeft"] = new paths.Circle([scaledDotDistance, scaledHeight - scaledDotDistance], (1.4 / 2) * scale);
            this.paths["bottomRight"] = new paths.Circle([scaledWidth - scaledDotDistance, scaledHeight - scaledDotDistance], (1.4 / 2) * scale);
        }
    }

    (<IKit>CornerDots).metaParameters = [
        { title: "Rectangle Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Rectangle Height", type: "range", min: 1, max: 100, value: 50 },
        { title: "Dot Distance", type: "range", min: 1, max: 20, value: 3.2 },
        { title: "Scale", type: "range", min: 1, max: 20, value: 10 }
    ];

}
