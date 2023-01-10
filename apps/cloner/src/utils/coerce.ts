import {
	type LocalizedText,
	type QualifiedName,
} from 'node'
import {
	type LocalizedText as OpcLocalizedText,
	type QualifiedName as OpcQualifiedName,
} from 'node-opcua'

export const coerceQualifiedName = (
	qualifiedName: OpcQualifiedName,
): QualifiedName => ({
	namespaceIndex: qualifiedName.namespaceIndex ?? 0,
	name:
		qualifiedName.name ??
		(() => {
			throw new TypeError(
				`qualifiedName.name must not to be null or undefined`,
			)
		})(),
})

export const coerceLocalizedText = (
	localizedText: OpcLocalizedText,
): LocalizedText => ({
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	locale: localizedText.locale || null,
	text: localizedText.text ?? null,
})
