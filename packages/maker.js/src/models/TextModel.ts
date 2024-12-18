namespace MakerJs.models {
    export class TextModel implements IModel {
        public models: IModelMap = {};
        private fontPromise: Promise<opentype.Font> | null = null;
        private currentText: string;
        private currentSize: number;
        private fontFamily: string;
        private combine: boolean;
        private centerCharacterOrigin: boolean;
        private bezierAccuracy?: number;
        private opentypeOptions?: opentype.RenderOptions;

        /**
         * Creates a new instance of TextModel.
         * Note: Use TextModel.create() instead of constructor for async initialization.
         */
        constructor(
            fontFamily: string,
            text: string,
            fontSize: number,
            combine = false,
            centerCharacterOrigin = false,
            bezierAccuracy?: number,
            opentypeOptions?: opentype.RenderOptions
        ) {
            this.fontFamily = fontFamily;
            this.currentText = text;
            this.currentSize = fontSize;
            this.combine = combine;
            this.centerCharacterOrigin = centerCharacterOrigin;
            this.bezierAccuracy = bezierAccuracy;
            this.opentypeOptions = opentypeOptions;
        }

        /**
         * Creates and initializes a new TextModel instance.
         */
        static async create(
            fontFamily: string,
            text: string,
            fontSize: number,
            combine = false,
            centerCharacterOrigin = false,
            bezierAccuracy?: number,
            opentypeOptions?: opentype.RenderOptions
        ): Promise<TextModel> {
            const model = new TextModel(
                fontFamily,
                text,
                fontSize,
                combine,
                centerCharacterOrigin,
                bezierAccuracy,
                opentypeOptions
            );
            await model.update();
            return model;
        }

        private async loadFont(): Promise<opentype.Font> {
            if (!this.fontPromise) {
                const ttfUrl = MakerJs.fontmanager.getFontTtfUrl(this.fontFamily);
                this.fontPromise = new Promise((resolve, reject) => {
                    opentype.load(ttfUrl, (err, font) => {
                        if (err) {
                            console.error('Font loading error:', err);
                            reject(err);
                        } else {
                            resolve(font);
                        }
                    });
                });
            }
            return this.fontPromise;
        }

        async update(text?: string, fontSize?: number): Promise<void> {
            if (text !== undefined) this.currentText = text;
            if (fontSize !== undefined) this.currentSize = fontSize;

            try {
                const font = await this.loadFont();
                const textModel = new MakerJs.models.Text(
                    font,
                    this.currentText,
                    this.currentSize,
                    this.combine,
                    this.centerCharacterOrigin,
                    this.bezierAccuracy,
                    this.opentypeOptions
                );
                this.models = textModel.models;
            } catch (error) {
                console.error('Error updating text model:', error);
                throw error;
            }
        }
    }
}