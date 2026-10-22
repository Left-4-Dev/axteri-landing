import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
// The mobile address bar resizes the viewport while scrolling; refreshing on
// every one of those resizes would make the triggers jump.
ScrollTrigger.config({ ignoreMobileResize: true });
export { gsap, ScrollTrigger, DrawSVGPlugin };
