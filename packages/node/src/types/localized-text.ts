// Redefined LocalizedText class.
// its all fields can be null at the same time, but that is also valid.
export interface LocalizedText {
	locale: string | null
	text: string | null
}
