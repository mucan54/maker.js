namespace MakerJs.models {

    export class GridDots implements IModel {
        public paths: IPathMap = {};

        constructor(rectWidth: number, rectHeight: number, gridHorizontal: number, gridVertical: number, dotDistance: number, scale: number) {
            
            const scaledDotDistance = dotDistance * scale;
            const scaledWidth = rectWidth * scale;
            const scaledHeight = rectHeight * scale;

            for (let i = 0; i < gridHorizontal; i++) {
                for (let j = 0; j < gridVertical; j++) {
                    const x = scaledDotDistance + i * ((scaledWidth - 2 * scaledDotDistance) / (gridHorizontal - 1));
                    const y = scaledDotDistance + j * ((scaledHeight - 2 * scaledDotDistance) / (gridVertical - 1));
                    this.paths[`dot_${i}_${j}`] = new paths.Circle([x, y], (1.4 / 2) * scale); // 1.4 is the borehole diameter
                }
            }
        }
    }

    (<IKit>GridDots).metaParameters = [
        { title: "Rectangle Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Rectangle Height", type: "range", min: 1, max: 100, value: 50 },
        { title: "Grid Horizontal", type: "range", min: 1, max: 10, value: 5 },
        { title: "Grid Vertical", type: "range", min: 1, max: 10, value: 5 },
        { title: "Dot Distance", type: "range", min: 1, max: 20, value: 3.2 },
        { title: "Scale", type: "range", min: 1, max: 20, value: 10 }
    ];

}
