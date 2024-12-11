namespace MakerJs.models {

    export class IsoscelesTriangle implements IModel {
        public paths: IPathMap = {};

        constructor(base: number, height: number) {
            this.paths = {
                a: new paths.Line([0, 0], [base, 0]),
                b: new paths.Line([base, 0], [base / 2, height]),
                c: new paths.Line([base / 2, height], [0, 0])
            };
        }
    }

    (<IKit>IsoscelesTriangle).metaParameters = [
        { title: "Base", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Height", type: "range", unit: "float", min: 1, max: 100, value: 50 }
    ];

}
