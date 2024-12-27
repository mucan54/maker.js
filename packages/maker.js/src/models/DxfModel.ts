namespace MakerJs.models {
    export class DxfModel implements IModel {
        constructor(dxfContent: string) {
            return MakerJs.importer.fromDXF(dxfContent);
        }
    }

    (<IKit>DxfModel).metaParameters = [
        { title: "DXF content", type: "text", unit: 'string', value: '' }
    ];
}