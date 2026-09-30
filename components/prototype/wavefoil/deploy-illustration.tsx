"use client";

/**
 * The bow seen from ahead, with the foils extending out of the hull. Every
 * shape is the drawing from the design file; the two wings are separate paths
 * so they can slide out of their struts as the operation runs.
 */

/** The content area of the library's medium modal. */
const WIDTH = 540;
const HEIGHT = 319;
/** The drawing's own centre, kept whatever the frame does. */
const CENTRE_X = 272;
const CENTRE_Y = 223.5;

/** Where each wing meets its strut, and so what it grows out of. */
const LEFT_HINGE = 225.14;
const RIGHT_HINGE = 313.04;
/** How much of the wing still shows when the foils are stowed. */
const STOWED = 0.18;

/**
 * Grow a wing from its hinge without moving the strut. Only the shape scales:
 * the outline is drawn non-scaling, so it keeps one weight from stowed to out
 * instead of thinning to a hairline while the wing is short.
 */
function wing(hinge: number, extent: number) {
  const scale = STOWED + (1 - STOWED) * extent;
  return `translate(${hinge} 0) scale(${scale} 1) translate(${-hinge} 0)`;
}

export function DeployIllustration({
  className,
  extent,
}: {
  className?: string;
  extent: number;
}) {
  // The component's medium modal is a little wider than the sketch, and the
  // drawing runs well past its frame, so the view simply opens up to fill it.
  return (
    <svg
      className={className}
      viewBox={`${CENTRE_X - WIDTH / 2} ${CENTRE_Y - HEIGHT / 2} ${WIDTH} ${HEIGHT}`}
      width={WIDTH}
      height={HEIGHT}
      fill="none"
      aria-hidden="true"
    >
      <g>
<g>
<path d="M367.97 -34.5368C318.055 -49.7535 218.7 -49.0617 168.785 -34.5368L163.459 6.2034L172.726 25.2006C177.706 52.242 182.827 103.476 179.242 168.781C188.039 185.005 218.183 219.686 268.377 228.61C320.348 218.488 348.995 184.506 356.823 168.781C354.275 97.8396 363.193 49.8936 367.97 25.2006L376.598 6.2034L367.97 -34.5368Z" fill="white" stroke="#8E8E8E" strokeWidth="1.35391"/>
</g>
</g>
      <g>
        <path d="M246.778 138.438L246.778 177.584C246.778 181.111 243.33 183.605 239.981 182.502L228.698 178.786C226.575 178.086 225.141 176.103 225.141 173.868V140.915C225.141 138.484 226.833 136.38 229.208 135.858L240.49 133.381C243.72 132.672 246.778 135.131 246.778 138.438Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.35233"/>
        <g transform={wing(LEFT_HINGE, extent)}><path vectorEffect="non-scaling-stroke" d="M149.515 161.617L146.69 169.477C145.399 173.07 148.136 176.833 151.952 176.713L225.14 174.397L225.14 140.183L159.66 152.915C154.981 153.825 151.126 157.131 149.515 161.617Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.35233"/></g>
      </g>
      <g>
        <path d="M291.404 138.438L291.404 177.584C291.404 181.111 294.852 183.605 298.201 182.502L309.483 178.786C311.606 178.086 313.041 176.103 313.041 173.868V140.915C313.041 138.484 311.349 136.38 308.974 135.858L297.692 133.381C294.462 132.672 291.404 135.131 291.404 138.438Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.35233"/>
        <g transform={wing(RIGHT_HINGE, extent)}><path vectorEffect="non-scaling-stroke" d="M388.667 161.617L391.491 169.477C392.782 173.07 390.046 176.833 386.23 176.713L313.042 174.397L313.042 140.183L378.522 152.915C383.201 153.825 387.055 157.131 388.667 161.617Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.35233"/></g>
      </g>
      <path d="M244.569 108.274C198.402 108.274 179.327 95.703 138.965 96.601C91.7109 96.667 66.0296 111.633 9.3251 111.633C-47.3794 111.633 -82.1006 94.5056 -116 94.5056V406.328H680.533V96.667C653.165 101.091 635.975 110.12 616.397 111.633C578.523 114.56 558.342 96.7032 530.697 96.6669C480.383 96.6009 472.642 104.683 443.338 104.683C397.447 104.683 392.747 91.2628 331.651 94.5056C289.957 96.7186 277.19 108.274 244.569 108.274Z" fill="#0A64ED" fillOpacity="0.05" stroke="#9CC1F5" strokeWidth="1.28266"/>
      <g>
<g>
<g>
<path d="M129.41 150.901L127.078 151.526L124.419 141.602L134.343 138.942L134.968 141.275L127.386 143.315L129.41 150.901Z" fill="#2D548B"/>
<path d="M123.118 147.269L120.786 147.894L118.127 137.969L128.051 135.31L128.676 137.642L121.094 139.682L123.118 147.269Z" fill="#2D548B"/>
</g>
</g>
<g>
<g>
<path d="M402.731 141.275L403.356 138.942L413.28 141.602L410.621 151.527L408.289 150.902L410.313 143.315L402.731 141.275Z" fill="#2D548B"/>
<path d="M409.023 137.642L409.648 135.31L419.572 137.969L416.913 147.894L414.581 147.269L416.605 139.683L409.023 137.642Z" fill="#2D548B"/>
</g>
</g>
</g>
    </svg>
  );
}

/** The finished dialogue is a sketch of its own, at rest rather than moving. */
const REST_WIDTH = 540;
const REST_HEIGHT = 383;
/** The sketch's dialogue is 512 wide and the library's is 540, so it is centred. */
const SHIFT = (REST_WIDTH - 512) / 2;

/** One foil with its strut, as drawn for the finished dialogue. */
function RestFoil() {
  return (
    <>
      <path d="M148.713 9.14714L148.713 82.5032C148.713 87.4745 143.69 90.8722 139.076 89.0223L121.814 82.1017C119.151 81.0337 117.405 78.4526 117.405 75.5827V13.7608C117.405 10.5803 119.542 7.79681 122.614 6.97556L139.876 2.36194C144.335 1.16992 148.713 4.53086 148.713 9.14714Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.83446"/>
      <path d="M8.72752 49.6257L2.89395 69.387C1.47261 74.2018 5.19743 78.9901 10.2139 78.7969L117.406 74.6693L117.406 14.4112L22.0966 36.968C15.6924 38.4837 10.5908 43.3139 8.72752 49.6257Z" fill="#E4EEFD" stroke="#4271B3" strokeWidth="1.83446"/>
    </>
  );
}

/**
 * The bow with the foils out. The hull is larger than in the animation and
 * hangs from above the frame, so only its lower part shows; the numbers are
 * the sketch's own.
 */
export function DeployedIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${REST_WIDTH} ${REST_HEIGHT}`}
      width={REST_WIDTH}
      height={REST_HEIGHT}
      fill="none"
      aria-hidden="true"
    >
      <path transform={`translate(${96 + SHIFT} -177.85)`} d="M283.724 90.1192C220.492 70.8429 94.6299 71.7193 31.3978 90.1192L24.6511 141.729L36.3904 165.794C42.6985 200.05 49.1868 264.952 44.6449 347.68C55.7893 368.233 93.9747 412.166 157.561 423.471C223.396 410.648 259.687 367.601 269.603 347.68C266.375 257.812 277.672 197.075 283.724 165.794L294.654 141.729L283.724 90.1192Z" fill="white" stroke="#8E8E8E" strokeWidth="1.71512"/>
      <g transform={`translate(${75 + SHIFT} 99)`}>
        <RestFoil />
      </g>
      <g transform={`translate(${437 + SHIFT} 99) scale(-1 1)`}>
        <RestFoil />
      </g>
      <path transform={`translate(${-150 + SHIFT} 439.72) scale(0.99839 -1)`} d="M406.594 362.654C354.626 362.654 333.154 376.805 287.721 375.794C234.53 375.72 205.622 358.873 141.793 358.873C77.9643 358.873 38.8805 378.153 0.72191 378.153V0.72191H897.334V375.72C866.527 370.74 847.177 360.577 825.139 358.873C782.507 355.578 759.79 375.679 728.672 375.72C672.036 375.794 663.322 366.697 630.337 366.697C578.68 366.697 573.39 381.803 504.618 378.153C457.685 375.662 443.314 362.654 406.594 362.654Z" fill="#0A64ED" fillOpacity="0.05" stroke="#9CC1F5" strokeWidth="1.44382"/>
    </svg>
  );
}
