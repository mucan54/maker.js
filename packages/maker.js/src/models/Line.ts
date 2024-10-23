namespace MakerJs.models {
    export class Line implements IModel {
        public paths: IPathMap = {};
        constructor(
            FirstDotLocation: [number, number],
            SecondDotLocation: [number, number],
        ) {
            this.paths.line = new MakerJs.paths.Line(FirstDotLocation, SecondDotLocation);
        }
    }
}