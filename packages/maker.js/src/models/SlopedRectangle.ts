
namespace MakerJs.models {

    export class SlopedRectangle implements IModel {
        public paths: IPathMap = {};

        constructor(width: number, heightLeft: number, heightRight: number) {
            this.paths = {
                width: new paths.Line([0, 0], [width, 0]),
                rightHeight: new paths.Line([width, 0], [width, heightRight]),
                diagonal: new paths.Line([width, heightRight], [0, heightLeft]),
                leftHeight: new paths.Line([0, heightLeft], [0, 0])
            };
        }
    }

    (<IKit>SlopedRectangle).metaParameters = [
        { title: "Width", type: "range", min: 1, max: 100, value: 50 },
        { title: "Height Left", type: "range", min: 1, max: 100, value: 20 },
        { title: "Height Right", type: "range", min: 1, max: 100, value: 40 }
    ];

}
