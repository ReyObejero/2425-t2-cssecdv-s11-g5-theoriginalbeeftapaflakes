import eslint from '@eslint/js';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
);
