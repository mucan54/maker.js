
namespace MakerJs.models {

    export class SlopedRightRectangle implements IModel {
        public paths: IPathMap = {};

        constructor(widthTop: number, widthBottom: number, height: number) {
            this.paths = {
                widthTop: new MakerJs.paths.Line([0, height], [widthTop, height]),
                diagonal: new MakerJs.paths.Line([widthTop, height], [widthBottom, 0]),
                widthBottom: new MakerJs.paths.Line([widthBottom, 0], [0, 0]),
                height: new MakerJs.paths.Line([0, 0], [0, height])
            };
        }
    }

    (<IKit>SlopedRightRectangle).metaParameters = [
        { title: "Width Top", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width Bottom", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", min: 1, max: 100, value: 50 }
    ];

}
