import { LocalizedText, QualifiedName } from 'node'
import {
	LocalizedText as OpcLocalizedText,
	QualifiedName as OpcQualifiedName,
} from 'node-opcua'

export const coerceQualifiedName = (
	qualifiedName: OpcQualifiedName,
): QualifiedName => ({
	namespaceIndex: qualifiedName.namespaceIndex ?? 0,
	name:
		qualifiedName.name ??
		(() => {
			throw new TypeError()
		})(),
})

export const coerceLocalizedText = (
	localizedText: OpcLocalizedText,
): LocalizedText => ({
	locale: localizedText.locale ?? null,
	text: localizedText.text ?? null,
})
