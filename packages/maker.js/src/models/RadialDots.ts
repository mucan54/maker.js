namespace MakerJs.models {

    export class RadialDots implements IModel {
        public paths: IPathMap = {};

        constructor(mainModel: IModel, circleDiameter: number, radialDots: number, dotDistance: number) {
            
            const radius = (circleDiameter / 2);

            for (let i = 0; i < 360; i += (360 / radialDots)) {
                const angle = i * (Math.PI / 180);
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                this.paths[`dot_${i}`] = new paths.Circle([x, y], (dotDistance / 2));
            }
        }
    }

    (<IKit>RadialDots).metaParameters = [
        { title: "Circle Diameter", type: "range", min: 1, max: 100, value: 31 },
        { title: "Radial Dots", type: "range", min: 1, max: 36, value: 12 },
        { title: "Dot Diameter", type: "range", min: 1, max: 10, value: 2 },
    ];

}