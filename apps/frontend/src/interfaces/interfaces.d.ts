export interface ApiResponse {
  readonly kind: string;
  readonly totalItems: number;
  readonly items: BookItem[];
}

export interface BookItem {
  readonly kind?: string;
  readonly id: string;
  readonly etag?: string;
  readonly selfLink?: string;
  readonly volumeInfo?: VolumeInfo;
  readonly saleInfo?: SaleInfo;
  readonly accessInfo?: AccessInfo;
  readonly searchInfo?: SearchInfo;
}

interface AccessInfo {
  readonly country?: string;
  readonly viewability?: string;
  readonly embeddable?: boolean;
  readonly publicDomain?: boolean;
  readonly textToSpeechPermission?: string;
  readonly epub?: Epub;
  readonly pdf?: Epub;
  readonly webReaderLink?: string;
  readonly accessViewStatus?: string;
  readonly quoteSharingAllowed?: boolean;
}

interface Epub {
  readonly isAvailable?: boolean;
  readonly acsTokenLink?: string;
}

interface SaleInfo {
  readonly country?: string;
  readonly saleability?: string;
  readonly isEbook?: boolean;
}

interface SearchInfo {
  readonly textSnippet?: string;
}

interface VolumeInfo {
  readonly title?: string;
  readonly authors?: string[];
  readonly publisher?: string;
  readonly publishedDate?: Date;
  readonly description?: string;
  readonly industryIdentifiers?: IndustryIdentifier[];
  readonly readingModes?: ReadingModes;
  readonly pageCount?: number;
  readonly printType?: string;
  readonly categories?: string[];
  readonly maturityRating?: string;
  readonly allowAnonLogging?: boolean;
  readonly contentVersion?: string;
  readonly panelizationSummary?: PanelizationSummary;
  readonly imageLinks?: ImageLinks;
  readonly language?: string;
  readonly previewLink?: string;
  readonly infoLink?: string;
  readonly canonicalVolumeLink?: string;
}

interface ImageLinks {
  readonly smallThumbnail?: string;
  readonly thumbnail?: string;
}

interface IndustryIdentifier {
  readonly type?: string;
  readonly identifier?: string;
}

interface PanelizationSummary {
  readonly containsEpubBubbles?: boolean;
  readonly containsImageBubbles?: boolean;
}

interface ReadingModes {
  readonly text?: boolean;
  readonly image?: boolean;
}

export interface fetchType {
  data: ApiResponse | null;
  loading: boolean;
  error: string | null;
}
