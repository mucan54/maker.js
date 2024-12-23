namespace MakerJs.models {

    export class Egg implements IModel {
        public paths: IPathMap = {};

        public models: IModelMap = {};

        constructor(width: number, height: number) {
            const upperArc = new models.EllipticArc(0, 180, width / 2, height / 3);
            const lowerArc = new models.EllipticArc(0, 180, width / 2, height / 2);
            this.models = {
                arcTop: upperArc,
                arcBottom: MakerJs.model.rotate(lowerArc, -180)
            };
        }
    }

    (<IKit>Egg).metaParameters = [
        { title: "Width", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 90 }
    ];

}
