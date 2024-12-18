class TextModel {
    models = {};
    fontPromise = null;
    currentText = '';
    currentSize = 72;
    isReady = false;

    constructor(fontFamily, text, fontSize, combine = false, centerCharacterOrigin = false, bezierAccuracy = undefined, opentypeOptions = undefined) {
        this.fontFamily = fontFamily;
        this.currentText = text;
        this.currentSize = fontSize;
        this.combine = combine;
        this.centerCharacterOrigin = centerCharacterOrigin;
        this.bezierAccuracy = bezierAccuracy;
        this.opentypeOptions = opentypeOptions;
        // Initialize returns a promise that resolves when the model is ready
        return (async () => {
            await this.update();
            this.isReady = true;
            return this;
        })();
    }

    async loadFont() {
        if (!this.fontPromise) {
            const ttfUrl = MakerJs.fontmanager.getFontTtfUrl(this.fontFamily);
            this.fontPromise = new Promise((resolve, reject) => {
                opentype.load(ttfUrl, (err, font) => {
                    if (err) reject(err);
                    else resolve(font);
                });
            });
        }
        return this.fontPromise;
    }

    async update(text, fontSize) {
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
