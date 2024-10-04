
namespace MakerJs.models {

    export class RightAngledTriangle implements IModel {
        public paths: IPathMap = {};

        constructor(base: number, height: number) {
            this.paths = {
                a: new MakerJs.paths.Line([0, 0], [base, 0]),
                b: new MakerJs.paths.Line([base, 0], [base, height]),
                c: new MakerJs.paths.Line([base, height], [0, 0])
            };
        }
    }

    (<IKit>RightAngledTriangle).metaParameters = [
        { title: "Base", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", min: 1, max: 100, value: 50 }
    ];

}
