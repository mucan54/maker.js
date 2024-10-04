
namespace MakerJs.models {

    export class Trapezoid implements IModel {
        public paths: IPathMap = {};

        constructor(widthBottom: number, widthTop: number, height: number) {
            this.paths = {
                widthBottom: new MakerJs.paths.Line([0, 0], [widthBottom, 0]),
                rightSide: new MakerJs.paths.Line([widthBottom, 0], [widthTop, height]),
                widthTop: new MakerJs.paths.Line([widthTop, height], [0, height]),
                leftSide: new MakerJs.paths.Line([0, height], [0, 0])
            };
        }
    }

    (<IKit>Trapezoid).metaParameters = [
        { title: "Width Bottom", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width Top", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", min: 1, max: 100, value: 50 }
    ];

}
