// https://github.com/ngneat/tailwind/pull/30/commits/531b4c263af48e8ce4b0fd6e45f483e150b8c661
import type { Configuration, RuleSetLoader, RuleSetUseItem } from 'webpack';

function logError(message: string, value?: any){
  console.error(`[patchPostCSS]: ${message}`, value ? value : '');
}
export interface IpatchPostCSS{
  webpackConfig: Configuration,
  addPlugins?: {[k: string]: any}[],
  pathComponentsStyles?: boolean,
  pathGlobalStyles?: boolean,
}

export function patchPostCSS({
  webpackConfig,
  addPlugins = [],
  pathComponentsStyles = false,
  pathGlobalStyles = true,
}: IpatchPostCSS
) {
  const pluginName = 'autoprefixer';
  if (!webpackConfig) {
    logError('Missing webpack config :', webpackConfig);
    return;
  }
  if(!webpackConfig.module){
    logError('Webpack has no modules :', webpackConfig.module);
    return;
  }
  for (const rule of webpackConfig.module.rules) {
    const ruleSetUseItems = rule.use as RuleSetUseItem[];
    if (
      !(ruleSetUseItems && ruleSetUseItems.length > 0) ||
      (!pathComponentsStyles && rule.exclude) ||
      (!pathGlobalStyles && rule.include)
    ) {
      continue;
    }

    for (const useLoader of ruleSetUseItems) {
      const ruleSetLoader = useLoader as RuleSetLoader;
      const ruleSetLoaderOptions = ruleSetLoader.options as {
        [k: string]: any;
      };

      if (!(ruleSetLoader.options && ruleSetLoaderOptions.postcssOptions)) {
        continue;
      }

      const originPostcssOptions = ruleSetLoaderOptions.postcssOptions;

      ruleSetLoaderOptions.postcssOptions = (loader: any) => {
        const _postcssOptions = originPostcssOptions(loader);
        const insertIndex = _postcssOptions.plugins.findIndex(
          ({ postcssPlugin = '' }) =>
            postcssPlugin && postcssPlugin.toLowerCase() === pluginName
        );

        if (insertIndex !== -1) {
          _postcssOptions.plugins.splice(insertIndex, 0, ...addPlugins);
        } else {
          logError(`${pluginName} not found in postcss plugins`);
        }

        return _postcssOptions;
      };
    }
  }
}
