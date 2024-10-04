
namespace MakerJs.models {

    export class RightAngledTriangleMirrored implements IModel {
        public paths: IPathMap = {};

        constructor(base: number, height: number) {
            this.paths = {
                a: new MakerJs.paths.Line([0, 0], [base, 0]),
                b: new MakerJs.paths.Line([base, 0], [0, height]),
                c: new MakerJs.paths.Line([0, height], [0, 0])
            };
        }
    }

    (<IKit>RightAngledTriangleMirrored).metaParameters = [
        { title: "Base", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", min: 1, max: 100, value: 50 }
    ];

}
