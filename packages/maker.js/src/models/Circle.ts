namespace MakerJs.models {

    export class Circle implements IModel {
        public paths: IPathMap = {};
        public annotations: any = {}; // Assuming annotations will be an object, update based on your usage.

        constructor(diameter: number) {
            const circle = new paths.Circle([0, 0], diameter / 2);
            this.paths = { circle };
        }
    }

    (<IKit>Circle).metaParameters = [
        { title: "Diameter", type: "range", unit: "float", min: 1, max: 100, value: 80 }
    ];
}
