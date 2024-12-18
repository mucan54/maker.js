namespace MakerJs.fontmanager {
    export interface IFontSearchOptions {
        query?: string;
        category?: string;
        page?: number;
        pageSize?: number;
        sortBy?: 'popularity' | 'alphabet' | 'date';
        sortDirection?: 'asc' | 'desc';
    }

    export interface IPaginatedResult {
        fonts: MakerJs.fontData.IGoogleFont[];
        totalCount: number;
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }

    class FontManager {
        private static instance: FontManager;
        private fonts: MakerJs.fontData.IGoogleFont[] = [];
        private readonly defaultPageSize = 20;

        private constructor() {
            this.fonts = MakerJs.fontData.getFonts();
        }

        public static getInstance(): FontManager {
            if (!FontManager.instance) {
                FontManager.instance = new FontManager();
            }
            return FontManager.instance;
        }

        public searchFonts(options: IFontSearchOptions = {}): IPaginatedResult {
            const {
                query = '',
                category = '',
                page = 1,
                pageSize = this.defaultPageSize,
                sortBy = 'popularity',
                sortDirection = 'asc'
            } = options;

            let filteredFonts = MakerJs.fontData.searchFonts(query, category);
            filteredFonts = this.sortFonts(filteredFonts, sortBy, sortDirection);

            const totalCount = filteredFonts.length;
            const totalPages = Math.ceil(totalCount / pageSize);
            const currentPage = Math.max(1, Math.min(page, totalPages));
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, totalCount);

            return {
                fonts: filteredFonts.slice(startIndex, endIndex),
                totalCount,
                currentPage,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1
            };
        }

        public getCategories(): string[] {
            return MakerJs.fontData.getFontCategories();
        }

        public getFontDetails(fontFamily: string): MakerJs.fontData.IGoogleFont | null {
            return MakerJs.fontData.getFont(fontFamily);
        }

        public getFontTtfUrl(fontFamily: string, variant: string = 'regular'): string {
            const url = MakerJs.fontData.getFontUrl(fontFamily, variant);
            if (!url) {
                throw new Error(`Font URL not found for ${fontFamily} ${variant}`);
            }
            return url;
        }

        private sortFonts(
            fonts: MakerJs.fontData.IGoogleFont[],
            sortBy: string,
            direction: 'asc' | 'desc'
        ): MakerJs.fontData.IGoogleFont[] {
            const multiplier = direction === 'asc' ? 1 : -1;
            const sorted = [...fonts];

            sorted.sort((a, b) => {
                switch (sortBy) {
                    case 'alphabet':
                        return multiplier * a.family.localeCompare(b.family);
                    case 'date':
                        const dateA = new Date(a.lastModified).getTime();
                        const dateB = new Date(b.lastModified).getTime();
                        return multiplier * (dateA - dateB);
                    default: // popularity - keep original order
                        return multiplier * (fonts.indexOf(a) - fonts.indexOf(b));
                }
            });

            return sorted;
        }
    }

    // Helper functions
    export function listFonts(
        page: number = 1,
        pageSize: number = 20
    ): IPaginatedResult {
        const manager = FontManager.getInstance();
        return manager.searchFonts({ page, pageSize });
    }

    export function searchFonts(
        query: string,
        options: Partial<IFontSearchOptions> = {}
    ): IPaginatedResult {
        const manager = FontManager.getInstance();
        return manager.searchFonts({ ...options, query });
    }

    export function getCategories(): string[] {
        const manager = FontManager.getInstance();
        return manager.getCategories();
    }

    export function getFontDetails(fontFamily: string): MakerJs.fontData.IGoogleFont | null {
        const manager = FontManager.getInstance();
        return manager.getFontDetails(fontFamily);
    }

    export function getFontTtfUrl(
        fontFamily: string,
        variant: string = 'regular'
    ): string {
        const manager = FontManager.getInstance();
        return manager.getFontTtfUrl(fontFamily, variant);
    }
}