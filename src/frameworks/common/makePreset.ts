import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';
import * as common from '../../preset';

const makePreset = (framework: string) => {
  deprecate(
    () => {},
    dedent`
    Framework-specific presets are no longer-needed as of Storybook 5.3 and will be removed in 6.0.

    Please use 'cl-sb-docs/preset' instead of 'cl-sb-docs/${framework}/preset'.
  `
  )();
  return common;
};

export default makePreset;
