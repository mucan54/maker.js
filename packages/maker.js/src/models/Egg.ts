
namespace MakerJs.models {

    export class Egg implements IModel {
        public paths: IPathMap = {};

        public models: IModelMap = {};

        constructor(width: number, height: number) {
            const upperArc = new MakerJs.models.EllipticArc(0, 180, width / 2, height / 3);
            const lowerArc = new MakerJs.models.EllipticArc(0, 180, width / 2, height / 2);
            this.models = {
                arcTop: upperArc,
                arcBottom: MakerJs.model.rotate(lowerArc, -180)
            };
        }
    }

    (<IKit>Egg).metaParameters = [
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", min: 1, max: 100, value: 50 }
    ];

}
