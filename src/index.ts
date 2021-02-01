import type { Configuration, RuleSetLoader, RuleSetUseItem } from 'webpack';

function logError(message: string, value?: any){
  console.error(`[patchAngularPostCSS]: ${message}`, value ? value : '');
}
export interface IpatchAngularPostCSS{
  webpackConfig: Configuration,
  addPlugins?: {[k: string]: any}[],
  patchComponentsStyles?: boolean,
  patchGlobalStyles?: boolean,
}

export function patchAngularPostCSS({
  webpackConfig,
  addPlugins = [],
  patchComponentsStyles = false,
  patchGlobalStyles = true,
}: IpatchAngularPostCSS
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
      (!patchComponentsStyles && rule.exclude) ||
      (!patchGlobalStyles && rule.include)
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
