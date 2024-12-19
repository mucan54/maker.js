namespace MakerJs.models {
    export class TextModel implements IModel {
        models: IModelMap = {};
        currentText: string;
        currentSize: number;
        fontFamily: string;
        combine: boolean;
        centerCharacterOrigin: boolean;
        bezierAccuracy?: number;
        opentypeOptions?: opentype.RenderOptions;
        font: opentype.Font;

        static loadFontSync = function(url: string): opentype.Font {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.overrideMimeType('text/plain; charset=x-user-defined');

            try {
                xhr.send(null);

                if (xhr.status !== 200) {
                    throw new Error(`HTTP error! status: ${xhr.status}`);
                }

                const rawBytes = xhr.responseText;
                const buffer = new ArrayBuffer(rawBytes.length);
                const bufferView = new Uint8Array(buffer);
                for (let i = 0; i < rawBytes.length; i++) {
                    bufferView[i] = rawBytes.charCodeAt(i) & 0xFF;
                }

                const font = opentype.parse(buffer);

                if (!font) {
                    throw new Error('Failed to parse font');
                }

                return font;
            } catch (error) {
                console.error('Error loading font:', error);
                throw error;
            }
        };

        static clearFontCache(): void {
            try {
                localStorage.removeItem('makerjs_font_family');
                localStorage.removeItem('makerjs_font_data');
            } catch (error) {
                console.error('Error clearing font cache:', error);
            }
        }

        static saveFontToLocalStorage(fontFamily: string, fontData: string): void {
            try {
                localStorage.setItem('makerjs_font_family', fontFamily);
                localStorage.setItem('makerjs_font_data', fontData);
            } catch (error) {
                console.error('Error saving font to localStorage:', error);
                TextModel.clearFontCache(); // Clear any partial data
            }
        }

        static getFontFromLocalStorage(fontFamily: string): opentype.Font | null {
            try {
                const cachedFontFamily = localStorage.getItem('makerjs_font_family');
                if (cachedFontFamily !== fontFamily) {
                    return null;
                }

                const fontData = localStorage.getItem('makerjs_font_data');
                if (!fontData) {
                    return null;
                }

                const buffer = new ArrayBuffer(fontData.length);
                const bufferView = new Uint8Array(buffer);
                for (let i = 0; i < fontData.length; i++) {
                    bufferView[i] = fontData.charCodeAt(i) & 0xFF;
                }

                const font = opentype.parse(buffer);
                if (!font) {
                    throw new Error('Failed to parse cached font');
                }
                return font;

            } catch (error) {
                console.error('Error loading font from localStorage:', error);
                TextModel.clearFontCache(); // Clear corrupted data
                return null;
            }
        }

        constructor(
            fontFamily: string,
            text: string,
            fontSize: number,
            combine = false,
            centerCharacterOrigin = false,
            bezierAccuracy?: number,
            opentypeOptions?: opentype.RenderOptions
        ) {
            try {
                this.fontFamily = fontFamily;
                this.currentText = text;
                this.currentSize = fontSize;
                this.combine = combine;
                this.centerCharacterOrigin = centerCharacterOrigin;
                this.bezierAccuracy = bezierAccuracy;
                this.opentypeOptions = opentypeOptions;

                let font: opentype.Font | null = null;

                try {
                    // Try to get font from localStorage first
                    font = TextModel.getFontFromLocalStorage(fontFamily);
                } catch (error) {
                    console.error('Error accessing localStorage:', error);
                    TextModel.clearFontCache();
                }

                if (!font) {
                    try {
                        // Load new font if not cached
                        const ttfUrl = MakerJs.fontmanager.getFontTtfUrl(this.fontFamily);
                        font = TextModel.loadFontSync(ttfUrl);

                        // Cache the loaded font
                        const xhr = new XMLHttpRequest();
                        xhr.open('GET', ttfUrl, false);
                        xhr.overrideMimeType('text/plain; charset=x-user-defined');
                        xhr.send(null);

                        if (xhr.status === 200) {
                            TextModel.saveFontToLocalStorage(fontFamily, xhr.responseText);
                        }
                    } catch (error) {
                        console.error('Error loading font from URL:', error);
                        TextModel.clearFontCache();
                        throw error;
                    }
                }

                if (!font) {
                    throw new Error('Failed to load or create font');
                }

                this.font = font;

                const textModel = new MakerJs.models.Text(
                    this.font,
                    this.currentText,
                    this.currentSize,
                    this.combine,
                    this.centerCharacterOrigin,
                    this.bezierAccuracy,
                    this.opentypeOptions
                );
                this.models = textModel.models;

            } catch (error) {
                console.error('Error in TextModel constructor:', error);
                TextModel.clearFontCache();
                throw error;
            }
        }
    }

    (<IKit>TextModel).metaParameters = [
        { title: 'Font Family', type: 'text', unit: 'string', value: 'Arial' },
        { title: 'Text', type: 'text', unit: 'string', value: '' },
        { title: 'Font Size', type: 'range', unit: 'int', min: 1, max: 100, value: 10 },
    ];
}