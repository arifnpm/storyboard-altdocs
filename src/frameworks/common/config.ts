/* eslint-disable import/no-extraneous-dependencies */
import { addParameters } from '@storybook/client-api';
import { DocsPage, DocsContainer } from 'storyboard-altdocs/blocks';

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});
