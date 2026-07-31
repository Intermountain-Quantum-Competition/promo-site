import { config, library } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';

// We import the CSS above ourselves, at a known point in the cascade,
// rather than letting fontawesome-svg-core inject a <style> tag on first render.
config.autoAddCss = false;

library.add(faArrowRightLong);
