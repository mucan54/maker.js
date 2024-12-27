namespace MakerJs.shapeIcons {
    interface ShapeAttributes {
        cx?: string;
        cy?: string;
        r?: string;
        rx?: string;
        ry?: string;
    }

    interface Dot {
        cx: string;
        cy: string;
        r: string;
    }

    interface Shape {
        viewBox: string;
        type?: 'circle' | 'ellipse' | 'dots' | 'path';
        path?: string;
        attrs?: ShapeAttributes;
        dots?: Dot[];
    }

    interface ShapeCategory {
        name: string;
        shapes: { code: string; name: string }[];
    }

    export class ShapeRenderer {
        shapes: Record<string, Shape> = {
            Rectangle: {
                viewBox: "-1 -1 32 32",
                path: "M0.5,0.5 L29.5,0.5 L29.5,29.5 L0.5,29.5 Z",
            },
            RoundedRectangle: {
                viewBox: "-1 -1 32 32",
                path: "M22,0.5 C24.0710678,0.5 25.9460678,1.33946609 27.3033009,2.69669914 C28.6605339,4.05393219 29.5,5.92893219 29.5,8 L29.5,8 L29.5,22 C29.5,24.0710678 28.6605339,25.9460678 27.3033009,27.3033009 C25.9460678,28.6605339 24.0710678,29.5 22,29.5 L22,29.5 L8,29.5 C5.92893219,29.5 4.05393219,28.6605339 2.69669914,27.3033009 C1.33946609,25.9460678 0.5,24.0710678 0.5,22 L0.5,22 L0.5,8 C0.5,5.92893219 1.33946609,4.05393219 2.69669914,2.69669914 C4.05393219,1.33946609 5.92893219,0.5 8,0.5 L8,0.5 Z",
            },
            Circle: {
                viewBox: "-1 -1 32 32",
                type: "circle",
                attrs: { cx: "15", cy: "15", r: "15" },
            },
            GridDots: {
                viewBox: "0 0 44 44",
                type: "dots",
                dots: [
                    { cx: "5.636", cy: "5.636", r: "2.886" },
                    { cx: "22", cy: "5.636", r: "2.886" },
                    { cx: "38.363", cy: "5.636", r: "2.886" },
                    { cx: "5.636", cy: "22", r: "2.886" },
                    { cx: "22", cy: "22", r: "2.886" },
                    { cx: "38.363", cy: "22", r: "2.886" },
                    { cx: "5.636", cy: "38.363", r: "2.886" },
                    { cx: "22", cy: "38.363", r: "2.886" },
                    { cx: "38.363", cy: "38.363", r: "2.886" },
                ],
            },
            None: {
                viewBox: "0 0 32 32",
                path: "M8,8 L24,24 M8,24 L24,8",
            },
        };

        getShapeCategories(): ShapeCategory[] {
            return [
                {
                    name: "Rectangle Shapes",
                    shapes: [
                        { code: "Rectangle", name: "Rectangle" },
                        { code: "RoundedRectangle", name: "Rounded Rectangle" },
                    ],
                },
                {
                    name: "Curved Shapes",
                    shapes: [{ code: "Circle", name: "Circle" }],
                },
                {
                    name: "Dot Patterns",
                    shapes: [{ code: "GridDots", name: "Grid Dots" }],
                },
                {
                    name: "Special Shapes",
                    shapes: [{ code: "None", name: "None (Cross)" }],
                },
            ];
        }

        renderShape(code: string): string {
            const shape = this.shapes[code];
            if (!shape) {
                console.error(`Shape with code "${code}" not found.`);
                return "";
            }

            const props: Record<string, string> = {
                xmlns: "http://www.w3.org/2000/svg",
                width: "32",
                height: "32",
                viewBox: shape.viewBox,
                "aria-hidden": "true",
                fill: "none",
                stroke: "#0074B5",
                "stroke-width": "1.5",
            };

            const propsString = Object.keys(props)
                .map((key) => `${key}="${props[key]}"`)
                .join(" ");

            let shapeContent = "";
            if (shape.type === "circle" && shape.attrs) {
                shapeContent = `<circle ${this.attrsToString(shape.attrs)} />`;
            } else if (shape.type === "dots" && shape.dots) {
                shapeContent = shape.dots
                    .map(
                        (dot) =>
                            `<circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="white" stroke="#0074B5" stroke-width="1.5" />`
                    )
                    .join("");
            } else if (shape.path) {
                shapeContent = `<path d="${shape.path}" />`;
            }

            return `<svg ${propsString}>${shapeContent}</svg>`;
        }

        getDotTypes(): { code: string; name: string }[] {
            return [
                { code: "GridDots", name: "Grid Dots" },
            ];
        }

        attrsToString(attrs: ShapeAttributes): string {
            return Object.keys(attrs)
                .map((key) => `${key}="${attrs[key]}"`)
                .join(" ");
        }
    }
}
