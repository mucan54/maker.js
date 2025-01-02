namespace MakerJs.models {
    export class DxfModel implements IModel {
        constructor(dxfContent: string, options: object = {}) {
            return MakerJs.importer.fromDXF(dxfContent, options);
        }
    }

    (<IKit>DxfModel).metaParameters = [
        { title: "DXF content", type: "text", unit: 'string', value: '' },
        { title: "Options", type: "object", value: {} }
    ];
}