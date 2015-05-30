﻿module Maker.Models {

    export class BoltCircle implements IMakerModel {

        public paths: IMakerPath[] = [];

        constructor(boltRadius: number, holeRadius: number, boltCount: number, firstBoltAngle: number = 0) {

            var a1 = Maker.Angle.ToRadians(firstBoltAngle);
            var a = 2 * Math.PI / boltCount;

            for (var i = 0; i < boltCount; i++) {
                var o = Maker.Point.FromPolar(a * i + a1, boltRadius);

                this.paths.push(Path.CreateCircle("bolt " + i, o, holeRadius));
            }

        }
    }
}