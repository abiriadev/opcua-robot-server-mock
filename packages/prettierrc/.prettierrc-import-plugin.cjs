module.exports = {
	...require('./.prettierrc.json'),
	plugins: ['@trivago/prettier-plugin-sort-imports'],
	importOrder: [
		'^\\w+:(.*)$',
		'^@(.*)$',
		'<THIRD_PARTY_MODULES>',
		'^[./]',
	],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderGroupNamespaceSpecifiers: true,
}
