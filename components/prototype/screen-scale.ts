import { createContext } from "react";

/**
 * How much the screen is scaled up or down where it is shown. The screens are
 * drawn at the size they were designed at and scaled with a transform, which
 * most of them take in their stride. A chart measures the space it is given
 * in the page's pixels, so inside a scaled screen it sizes itself wrongly; it
 * reads the scale from here to put that right.
 */
export const ScreenScale = createContext(1);
