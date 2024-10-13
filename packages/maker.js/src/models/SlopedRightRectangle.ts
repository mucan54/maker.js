
namespace MakerJs.models {

    export class SlopedRightRectangle implements IModel {
        public paths: IPathMap = {};

        constructor(widthTop: number, widthBottom: number, height: number) {
            this.paths = {
                widthTop: new paths.Line([0, height], [widthTop, height]),
                diagonal: new paths.Line([widthTop, height], [widthBottom, 0]),
                widthBottom: new paths.Line([widthBottom, 0], [0, 0]),
                height: new paths.Line([0, 0], [0, height])
            };
        }
    }

    (<IKit>SlopedRightRectangle).metaParameters = [
        { title: "Width Top", type: "range", min: 1, max: 100, value: 50 },
        { title: "Width Bottom", type: "range", min: 1, max: 100, value: 20 },
        { title: "Height", type: "range", min: 1, max: 100, value: 40 }
    ];

}
