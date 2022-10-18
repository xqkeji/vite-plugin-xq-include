import { ResolvedConfig,normalizePath } from 'vite';
import path from 'path';
import fs from 'fs';

const tagMatcher = new RegExp('<xq-include(.*?)>(.*?)<\/xq-include>', 'gs');
const attrMatcher = new RegExp('\s*([a-z0-9_-]+)\s*=\s*(?:\'|\")(.*?)(?:\'|\")\s*', 'gs');
const replaceAttrMatcher = new RegExp('<?=[$]([a-z0-9_-]+)?>', 'gs');

function xqInclude(){
	let config: undefined | ResolvedConfig;
	async function renderHtml(code: string, codePath: string) {
		if (!config) {
			return code;
		}
		let root=config.root;
		const matches = code.matchAll(tagMatcher);
		for (const match of matches) {
			let [tagStr,attrsStr,content] = match;
			let map:Record<string,string> ={};
			let url='';
			const attrs=attrsStr.matchAll(attrMatcher)
			for(const attr of attrs)
			{
				let [,key,val]=attr;
				if(key==='file')
				{
					url=val;
				}
				else
				{
					map[key]=val;
				}
			}
			
			if (url.startsWith('.')) {
				root = path.dirname(root + codePath);
			} else {
				if (!url.startsWith('/')) {
					url = '/' + url;
				}
			}

			const filePath = normalizePath(path.join(root, url));
			
			console.log('Trying to include ', filePath);
			
			
			let out = tagStr;
			try {
				let data = fs.readFileSync(filePath, 'utf8');
				for(const attr_key in map){
					data = data.replace(`<?=$${attr_key}?>`, map[attr_key]);
					
				}
				data = data.replace(`<?=$${content}?>`, content);
				data = data.replaceAll(
					replaceAttrMatcher,
					'',
				);

				out = await renderHtml(data, url);
			} catch (error) {
				if (error instanceof Error) {
					out = error.message;
				}
				console.error(out);
			}

			code = code.replace(tagStr, out);
		}
		return code;
	}
	return {
		name: 'xq-include-file',
		// eslint-disable-next-line
		configResolved(resolvedConfig:ResolvedConfig) {
			config = resolvedConfig;
		},
		transformIndexHtml: {
			enforce: 'pre',
			transform(html:string, ctx:any) {
				return renderHtml(html, ctx.path);
			},
		},
	};
}


export default xqInclude;
