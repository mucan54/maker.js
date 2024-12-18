// generateFontData.js
const fs = require('fs');
const fetch = require('node-fetch');

function generateFontData(options) {
    const outputPath = options.outputPath || './fontData.ts';

    return fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${options.apiKey}`)
        .then(response => response.json())
        .then(data => {
            // Create TypeScript namespace content
            const tsContent = `// Generated Google Fonts Data
// Last updated: ${new Date().toISOString()}

namespace MakerJs.fontData {
    export interface IGoogleFont {
        family: string;
        variants: string[];
        subsets: string[];
        version: string;
        lastModified: string;
        files: Record<string, string>;
        category: string;
        kind: string;
        menu: string;
    }

    export const data = ${JSON.stringify(data, null, 2)} as {
        kind: string;
        items: IGoogleFont[];
    };

    class FontData {
        private static instance: FontData;
        private fonts: IGoogleFont[];

        private constructor() {
            this.fonts = data.items;
        }

        public static getInstance(): FontData {
            if (!FontData.instance) {
                FontData.instance = new FontData();
            }
            return FontData.instance;
        }

        public getFonts(): IGoogleFont[] {
            return this.fonts;
        }

        public getFont(family: string): IGoogleFont | null {
            return this.fonts.find(font => 
                font.family.toLowerCase() === family.toLowerCase()) || null;
        }

        public getFontCategories(): string[] {
            return [...new Set(this.fonts.map(font => font.category))].sort();
        }

        public searchFonts(query: string = '', category: string = ''): IGoogleFont[] {
            return this.fonts.filter(font => {
                const matchesQuery = query === '' || 
                    font.family.toLowerCase().includes(query.toLowerCase());
                const matchesCategory = category === '' || 
                    font.category.toLowerCase() === category.toLowerCase();
                return matchesQuery && matchesCategory;
            });
        }

        public getFontUrl(family: string, variant: string = 'regular'): string | null {
            const font = this.getFont(family);
            return font?.files?.[variant] || null;
        }
    }

    // Helper functions
    export function getFonts(): IGoogleFont[] {
        return FontData.getInstance().getFonts();
    }

    export function getFont(family: string): IGoogleFont | null {
        return FontData.getInstance().getFont(family);
    }

    export function getFontCategories(): string[] {
        return FontData.getInstance().getFontCategories();
    }

    export function searchFonts(query: string = '', category: string = ''): IGoogleFont[] {
        return FontData.getInstance().searchFonts(query, category);
    }

    export function getFontUrl(family: string, variant: string = 'regular'): string | null {
        return FontData.getInstance().getFontUrl(family, variant);
    }
}`;

            // Write to file
            fs.writeFileSync(outputPath, tsContent);
            console.log(`Font data file generated successfully at: ${outputPath}`);
        })
        .catch(error => {
            console.error('Error generating font data:', error);
            throw error;
        });
}

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const apiKey = args[0];
    const outputPath = args[1];

    if (!apiKey) {
        console.error('Please provide an API key as the first argument');
        process.exit(1);
    }

    generateFontData({ apiKey, outputPath })
        .catch(error => {
            console.error('Failed to generate font data:', error);
            process.exit(1);
        });
}

module.exports = { generateFontData };