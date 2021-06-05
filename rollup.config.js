import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/sdp-transform.js',
		plugins: [
			
		],
		output: [
			{
				format: 'umd',
				name: 'SdpTransform',
				file: 'build/sdp-transform.js',
				indent: '\t'
			}
		]
	},
	{
		input: 'src/sdp-transform.js',
		plugins: [
	
			terser()
		],
		output: [
			{
				format: 'umd',
				name: 'SdpTransform',
				file: 'build/sdp-transform.min.js'
			}
		]
	},
	{
		input: 'src/sdp-transform.js',
		plugins: [
			
		],
		output: [
			{
				format: 'esm',
				file: 'build/sdp-transform.module.js'
			}
		]
	}
];
