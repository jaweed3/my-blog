module.exports = {
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint'],
	parser: '@typescript-eslint/parser',
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3'
		},
		{
			files: ['*.ts'],
			rules: {
				// `import type` / type-only bindings are invisible to the base rule
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
				]
			}
		},
		{
			files: ['*.svelte'],
			rules: {
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'error',
					{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
				]
			}
		},
		{
			// histoire injects `Hst` as a runtime global; the svelte3 processor also
			// pre-registers it, so every story file trips a false-positive redeclare.
			files: ['*.story.svelte'],
			rules: {
				'no-redeclare': 'off'
			}
		}
	],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	settings: {
		// Required so the svelte3 processor can strip TS types out of <script lang="ts">
		'svelte3/typescript': () => require('typescript')
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		// TypeScript already resolves identifiers; the base rule false-positives on
		// Svelte's compiler-generated and ambient references.
		'no-undef': 'off'
	}
};
