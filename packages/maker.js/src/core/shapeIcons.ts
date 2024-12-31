namespace MakerJs.shapeIcons {
    export interface IShapeDefinition {
        viewBox: string;
        path?: string;
        type?: 'circle' | 'ellipse' | 'dots' | 'path';
        attrs?: Record<string, string>;
        dots?: Array<{ cx: string; cy: string; r: string; }>;
    }

    export interface IShapeCategory {
        name: string;
        shapes: Array<{ code: string; name: string; }>;
    }

    export interface IDotType {
        code: string;
        name: string;
    }

    export class ShapeIconsLibrary {
        private static readonly shapes: Record<string, IShapeDefinition> = {
            Rectangle: {
                viewBox: "-1 -1 32 32",
                path: 'M0.5,0.5 L29.5,0.5 L29.5,29.5 L0.5,29.5 Z'
            },
            RoundedRectangle: {
                viewBox: "-1 -1 32 32",
                path: 'M22,0.5 C24.0710678,0.5 25.9460678,1.33946609 27.3033009,2.69669914 C28.6605339,4.05393219 29.5,5.92893219 29.5,8 L29.5,8 L29.5,22 C29.5,24.0710678 28.6605339,25.9460678 27.3033009,27.3033009 C25.9460678,28.6605339 24.0710678,29.5 22,29.5 L22,29.5 L8,29.5 C5.92893219,29.5 4.05393219,28.6605339 2.69669914,27.3033009 C1.33946609,25.9460678 0.5,24.0710678 0.5,22 L0.5,22 L0.5,8 C0.5,5.92893219 1.33946609,4.05393219 2.69669914,2.69669914 C4.05393219,1.33946609 5.92893219,0.5 8,0.5 L8,0.5 Z'
            },
            ArchedRectangle: {
                viewBox: "0 0 29 36",
                path: 'M14.5 1.412c3.768 0 7.18 1.527 9.65 3.997a13.603 13.603 0 0 1 3.99 9.18V35H.86V14.588a13.603 13.603 0 0 1 3.99-9.18 13.604 13.604 0 0 1 9.65-3.996Z'
            },
            SlopedRectangle: {
                viewBox: "-1 -1 29 29",
                path: 'M26.5,0.809017 L0.5,13.809017 L0.5,26.5 L26.5,26.5 L26.5,0.809017 Z'
            },
            SlopedRightRectangle: {
                viewBox: "-1 -1 29 29",
                path: 'M25.3158 1.39655L13.2123 25.6034L1.39656 25.6034L1.39656 1.39655L25.3158 1.39655Z'
            },
            Circle: {
                viewBox: "-1 -1 32 32",
                type: 'circle',
                attrs: {cx: "15", cy: "15", r: "15"}
            },
            HalfCircle: {
                viewBox: "-1 -1 32 17",
                path: 'M15,0.5 C19.0040644,0.5 22.6290644,2.12296778 25.2530483,4.74695167 C27.7673667,7.26127006 29.3625925,10.6946811 29.4915409,14.5 L29.4915409,14.5 L0.508459099,14.5 C0.637407517,10.6946811 2.23263328,7.26127006 4.74695167,4.74695167 C7.37093556,2.12296778 10.9959356,0.5 15,0.5 Z'
            },
            Ellipse: {
                viewBox: "-1 -1 34 22",
                type: 'ellipse',
                attrs: {cx: "16", cy: "10", rx: "15.5", ry: "9.5"}
            },
            QuarterCircle: {
                viewBox: "0 0 32 32",
                type: 'path',
                path: 'M2,2 A28,28 0 0,1 30,30 L2,30 Z'
            },
            FlatOval: {
                viewBox: "0 0 32 20",
                type: 'path',
                path: 'M8,2 L24,2 C28,2 30,4 30,10 C30,16 28,18 24,18 L8,18 C4,18 2,16 2,10 C2,4 4,2 8,2'
            },
            Egg: {
                viewBox: "0 0 28 34",
                path: 'M23.4998 22.3978V22.4027C23.4998 24.8067 22.4745 27.1363 20.6097 28.8716C18.7413 30.6102 16.1856 31.604 13.5 31.604C10.8144 31.604 8.2587 30.6102 6.39028 28.8716C4.5255 27.1362 3.5002 24.8067 3.50021 22.4027L3.50019 22.3977C3.49041 19.4194 3.85081 16.4515 4.57307 13.5625L4.57397 13.5588C5.05426 11.617 5.76634 9.74025 6.69478 7.96929C7.10851 7.19193 7.58504 6.44985 8.11957 5.75049C8.80391 4.86439 9.51969 4.16601 10.2416 3.64868L10.2573 3.63742L10.2727 3.62575C11.2063 2.91962 12.3372 2.52612 13.5054 2.50019C14.4501 2.51444 15.3742 2.78146 16.1819 3.27406L16.1923 3.2804L16.2028 3.28658C17.6439 4.13357 19.0795 5.68806 20.3103 7.97867C21.1864 9.60925 21.9081 11.52 22.4423 13.6229C23.1541 16.4931 23.5093 19.4404 23.4998 22.3978Z'
            },
            RightAngledTriangle: {
                viewBox: "-1 -1 32 32",
                path: 'M 0 30 L 30 30 L 30 0 L 0 30 Z'
            },
            RightAngledTriangleMirrored: {
                viewBox: "-1 -1 32 32",
                path: 'M 0 30 L 30 30 L 0 0 L 0 30 Z'
            },
            IsoscelesTriangle: {
                viewBox: "-1 -1 32 32",
                path: 'M 0 30 L 30 30 L 15 0 L 0 30 Z'
            },
            Hexagon: {
                viewBox: "0 0 32 32",
                path: 'M30.4226 16L23.2113 28.4904L8.78866 28.4904L1.57734 16L8.78866 3.50964L23.2113 3.50964L30.4226 16Z'
            },
            Octagon: {
                viewBox: "0 0 32 32",
                path: 'M29 11.4497L21.7677 4.09006L11.4497 4L4.09006 11.2323L4 21.5503L11.2323 28.9099L21.5503 29L28.9099 21.7677L29 11.4497Z'
            },
            Polygon: {
                viewBox: "0 0 32 32",
                path: 'M16 1.62359L26.1656 5.83435L30.3764 16L26.1656 26.1656L16 30.3764L5.83435 26.1656L1.62359 16L5.83435 5.83435L16 1.62359Z'
            },
            Trapezoid: {
                viewBox: "0 0 26 27",
                path: 'M18.5,0.5 L18.5,0.5 L26,26 L0.5,26 L8,0.5 Z'
            },
            Heart: {
                viewBox: "0 0 32 29",
                path: 'M28.0880884,2.84616347 C24.8772126,0.0317060492 20.1019139,0.537946784 17.154705,3.66579133 L16.0004303,4.88920644 L14.8461556,3.66579133 C11.904806,0.537946784 7.12364794,0.0317060492 3.91277222,2.84616347 C0.233155509,6.07646149 0.0397998544,11.8741232 3.33270525,15.3756217 L14.6703778,27.4169192 C15.4027855,28.1943603 16.5922158,28.1943603 17.3246236,27.4169192 L28.6622961,15.3756217 C31.9610607,11.8741232 31.7677051,6.07646149 28.0880884,2.84616347 Z'
            },
            Arrow: {
                viewBox: "0 0 26 27",
                path: 'M10.5,1.07607567 L25.2246511,13.5 L10.5,25.9239243 L10.5,19.5 L0.5,19.5 L0.5,6.5 L10.5,6.5 L10.5,1.07607567 Z'
            },
            Star: {
                viewBox: "0 0 33 28",
                path: 'M16.5,1.13514544 L20.8250491,9.95041968 L31.002581,11.0811227 L23.4785987,17.6135074 L25.4885302,27.1012049 L16.5,22.3714571 L7.51146984,27.1012049 L9.52140134,17.6135074 L1.99741897,11.0811227 L12.1749509,9.95041968 L16.5,1.13514544 Z'
            },
            Kite: {
                viewBox: "0 0 26 44",
                path: 'M12.5714 39.9611L1.76006 12.9327L12.5714 2.12132L23.3828 12.9327L12.5714 39.9611Z'
            },
            TextModel: {
                viewBox: "0 0 24 24",
                path: 'M17 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2z M8 7h8M8 12h8M8 17h8'
            },
            DxfModel: {
                viewBox: "0 0 24 24",
                path: 'M3 15v4c0 1.1.9 2 2 2h14a2 2 0 002-2v-4M17 8l-5-5-5 5M12 3v12'
            },
            GridDots: {
                viewBox: "0 0 44 44",
                type: 'dots',
                dots: [
                    {cx: "5.636", cy: "5.636", r: "2.886"},
                    {cx: "22", cy: "5.636", r: "2.886"},
                    {cx: "38.363", cy: "5.636", r: "2.886"},
                    {cx: "5.636", cy: "22", r: "2.886"},
                    {cx: "22", cy: "22", r: "2.886"},
                    {cx: "38.363", cy: "22", r: "2.886"},
                    {cx: "5.636", cy: "38.363", r: "2.886"},
                    {cx: "22", cy: "38.363", r: "2.886"},
                    {cx: "38.363", cy: "38.363", r: "2.886"}
                ]
            },
            RadialDots: {
                viewBox: "0 0 44 44",
                type: 'dots',
                dots: [
                    {cx: "10.183", cy: "33.818", r: "2.886"},
                    {cx: "5.636", cy: "22", r: "2.886"},
                    {cx: "10.183", cy: "10.182", r: "2.886"},
                    {cx: "22", cy: "38.363", r: "2.886"},
                    {cx: "22", cy: "5.636", r: "2.886"},
                    {cx: "33.82", cy: "33.818", r: "2.886"},
                    {cx: "38.363", cy: "22", r: "2.886"},
                    {cx: "33.82", cy: "10.182", r: "2.886"}
                ]
            },
            CornerDots: {
                viewBox: "0 0 44 44",
                type: 'dots',
                dots: [
                    {cx: "5.636", cy: "5.636", r: "2.886"},
                    {cx: "38.363", cy: "5.636", r: "2.886"},
                    {cx: "5.636", cy: "38.363", r: "2.886"},
                    {cx: "38.363", cy: "38.363", r: "2.886"}
                ]
            },
            EdgeDots: {
                viewBox: "0 0 44 44",
                type: 'dots',
                dots: [
                    {cx: "22", cy: "5.636", r: "2.886"},
                    {cx: "5.636", cy: "22", r: "2.886"},
                    {cx: "38.363", cy: "22", r: "2.886"},
                    {cx: "22", cy: "38.363", r: "2.886"}
                ]
            },
            CustomDot: {
                viewBox: "0 0 44 44",
                type: 'dots',
                dots: [
                    {cx: "7.636", cy: "38.364", r: "2.886"},
                    {cx: "11.273", cy: "16.546", r: "2.886"},
                    {cx: "31.273", cy: "34.727", r: "2.886"},
                    {cx: "24", cy: "5.636", r: "2.886"},
                    {cx: "35.82", cy: "20.182", r: "2.886"},
                    {cx: "24", cy: "22", r: "2.886"}
                ]
            },
            None: {
                viewBox: "0 0 32 32",
                path: 'M8,8 L24,24 M8,24 L24,8'
            }
        };

        public static renderShape(code: string): string {
            const shape = this.shapes[code];
            if (!shape) return '';

            const props: Record<string, string> = {
                xmlns: "http://www.w3.org/2000/svg",
                width: "32",
                height: "32",
                viewBox: shape.viewBox,
                'aria-hidden': "true",
                fill: "none",
                stroke: "#0074B5",
                'stroke-width': "1.5"
            };

            const propsString = Object.keys(props)
                .map(key => `${key}="${props[key]}"`)
                .join(' ');

            let shapeContent = '';
            if (shape.type === 'circle' && shape.attrs) {
                const attrStr = Object.keys(shape.attrs)
                    .map(key => `${key}="${shape.attrs![key]}"`)
                    .join(' ');
                shapeContent = `<circle ${attrStr}/>`;
            } else if (shape.type === 'ellipse' && shape.attrs) {
                const attrStr = Object.keys(shape.attrs)
                    .map(key => `${key}="${shape.attrs![key]}"`)
                    .join(' ');
                shapeContent = `<ellipse ${attrStr}/>`;
            } else if (shape.type === 'dots' && shape.dots) {
                shapeContent = shape.dots.map(dot =>
                    `<circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="white" stroke="#0074B5" stroke-width="1.5"/>`
                ).join('');
            } else if (shape.path) {
                shapeContent = `<path d="${shape.path}"/>`;
            }

            return `<svg ${propsString}>${shapeContent}</svg>`;
        }

        public static getDotTypes(): IDotType[] {
            return [
                {code: 'GridDots', name: 'Grid'},
                {code: 'RadialDots', name: 'Radial'},
                {code: 'CornerDots', name: 'Corner'},
                {code: 'EdgeDots', name: 'Edge'},
                {code: 'CustomDot', name: 'Custom'}
            ];
        }

        public static getShapeCategories(): IShapeCategory[] {
            return [
                {
                    name: 'Rectangle Shapes',
                    shapes: [
                        {code: 'Rectangle', name: 'Rectangle'},
                        {code: 'RoundedRectangle', name: 'Rounded Rectangle'},
                        {code: 'ArchedRectangle', name: 'Arched Rectangle'},
                        {code: 'SlopedRectangle', name: 'Sloped Rectangle'},
                        {code: 'SlopedRightRectangle', name: 'Sloped Right Rectangle'}
                    ]
                },
                {
                    name: 'Curved Shapes',
                    shapes: [
                        {code: 'Circle', name: 'Circle'},
                        {code: 'HalfCircle', name: 'Half Circle'},
                        {code: 'QuarterCircle', name: 'Quarter Circle'},
                        {code: 'Ellipse', name: 'Ellipse'},
                        {code: 'FlatOval', name: 'Flat Oval'},
                        {code: 'Egg', name: 'Egg'}
                    ]
                },
                {
                    name: 'Polygonal Shapes',
                    shapes: [
                        {code: 'RightAngledTriangle', name: 'Right Angled Triangle'},
                        {code: 'RightAngledTriangleMirrored', name: 'Right Angled Triangle Mirrored'},
                        {code: 'IsoscelesTriangle', name: 'Isosceles Triangle'},
                        {code: 'Hexagon', name: 'Hexagon'},
                        {code: 'Octagon', name: 'Octagon'},
                        {code: 'Polygon', name: 'Polygon'},
                        {code: 'Trapezoid', name: 'Trapezoid'}
                    ]
                },
                {
                    name: 'Special Shapes',
                    shapes: [
                        {code: 'Heart', name: 'Heart'},
                        {code: 'Arrow', name: 'Arrow'},
                        {code: 'Star', name: 'Star'},
                        {code: 'Kite', name: 'Kite'}
                    ]
                }
            ];
        }
    }
}