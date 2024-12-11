namespace MakerJs.models {

    export class Arrow implements IModel {
        public paths: IPathMap = {};

        constructor(stemLength: number, stemWidth: number, headLength: number, headWidth: number) {
            this.paths = new models.ConnectTheDots(true, [
                [0, 0],
                [stemLength, 0],
                [stemLength, stemWidth / 2 - headWidth / 2],
                [stemLength + headLength, stemWidth / 2],
                [stemLength, stemWidth / 2 + headWidth / 2],
                [stemLength, stemWidth],
                [0, stemWidth]
            ]).paths;
        }
    }

    (<IKit>Arrow).metaParameters = [
        { title: "Stem Length", type: "range", unit: "float", min: 1, max: 100, value: 50 },
        { title: "Stem Width", type: "range", unit: "float", min: 1, max: 100, value: 20 },
        { title: "Head Length", type: "range", unit: "float", min: 1, max: 100, value: 30 },
        { title: "Head Width", type: "range", unit: "float", min: 1, max: 100, value: 40 }
    ];

}