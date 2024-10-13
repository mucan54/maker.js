namespace MakerJs.models {

    export class Dimensions implements IModel {
        public paths: IPathMap = {};
        public annotations: any = {}; // Assuming annotations will be an object, update based on your usage.

        constructor(diameter: number) {
            const circle = new paths.Circle([0, 0], diameter / 2);
            this.paths = { circle };
        }
    }

    (<IKit>Dimensions).metaParameters = [
        { title: "Diameter", type: "range", min: 1, max: 100, value: 80 }
    ];
}
