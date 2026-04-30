'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

export function ParallaxComponent() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 70 },
        { layer: "2", yPercent: 55 },
        { layer: "3", yPercent: 40 },
        { layer: "4", yPercent: 10 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="parallax overflow-hidden" ref={parallaxRef}>
      <section className="parallax__header relative h-screen">
        <div className="parallax__visuals absolute inset-0">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers relative h-full flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=1200" loading="eager" width="800" data-parallax-layer="1" alt="" className="parallax__layer-img absolute opacity-20 scale-150" />
            <img src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=1200" loading="eager" width="800" data-parallax-layer="2" alt="" className="parallax__layer-img absolute opacity-40 scale-125" />
            <div data-parallax-layer="3" className="parallax__layer-title relative z-10">
              <h2 className="parallax__title text-7xl md:text-9xl font-black text-green-500 tracking-tighter uppercase italic opacity-80">
                Neural Scan
              </h2>
            </div>
            <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200" loading="eager" width="800" data-parallax-layer="4" alt="" className="parallax__layer-img absolute opacity-60" />
          </div>
          <div className="parallax__fade absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
        </div>
      </section>
    </div>
  );
}
