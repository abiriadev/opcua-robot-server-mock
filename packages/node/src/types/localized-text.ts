import { LocalizedText } from 'node-opcua'

// Redefined LocalizedText class.
// its all fields can be null at the same time, but that is also valid.
export class StLocalizedText {
	// Convert LocalizedText into this class
	static fromLocalizedText(localizedText: LocalizedText) {
		const { locale, text } = localizedText

		return new StLocalizedText(
			// If given field doesn't exist or empty string, use null instead
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			locale || null,
			// If given field doesn't exist, use null instead
			text ?? null,
		)
	}

	constructor(
		readonly locale: string | null,
		readonly text: string | null,
	) {}
}

// Convert this class into LocalizedText
export const toLocalizedText = (
	stLocalizedText: StLocalizedText,
) => {
	const { locale, text } = stLocalizedText

	return new LocalizedText({
		locale,
		text,
	})
}
