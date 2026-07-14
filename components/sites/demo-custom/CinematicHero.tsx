"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/assetPath";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { heroState } from "./heroState";

export interface CinematicCue {
  index: string;
  label: string;
  title: string;
  body: string;
}

interface CinematicHeroProps {
  kicker: string;
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  bookingHref: string;
  servicesHref: string;
  address: string;
  phone: string;
  telHref: string;
  established?: string;
  cues: CinematicCue[];
  teamVisuals: string[];
  reviewVisuals: string[];
}

type ClipKey = "razor" | "shop" | "craft";

const ASSET_ROOT = "/clients/demo-custom-v2/cinema";
const RAZOR_START = `${ASSET_ROOT}/razor-start.jpg`;
const RAZOR_END = `${ASSET_ROOT}/razor-end.jpg`;
const RAZOR_FILM = `${ASSET_ROOT}/razor-scroll.mp4`;
const SHOP_START = `${ASSET_ROOT}/shop-start.jpg`;
const SHOP_END = `${ASSET_ROOT}/shop-end.jpg`;
const SHOP_FILM = `${ASSET_ROOT}/shop-scroll.mp4`;
const CRAFT_START = `${ASSET_ROOT}/craft-start.jpg`;
const CRAFT_END = `${ASSET_ROOT}/craft-end.jpg`;
const CRAFT_FILM = `${ASSET_ROOT}/craft-scroll.mp4`;
const RESULT_FINAL = `${ASSET_ROOT}/result-final.jpg`;

const CUT_START = 0.64;
const CUT_END = 1;

const CUE_RANGES = [
  [0.2, 0.38, 0.57],
  [0.66, 0.82, 0.985],
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function between(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start));
}

function rangedOpacity(progress: number, start: number, peak: number, end: number) {
  if (progress <= start || progress >= end) return 0;
  if (progress <= peak) return clamp01((progress - start) / (peak - start));
  return clamp01(1 - (progress - peak) / (end - peak));
}

export function CinematicHero({
  kicker,
  title,
  subtitle,
  primaryLabel,
  secondaryLabel,
  bookingHref,
  servicesHref,
  address,
  phone,
  telHref,
  established,
  cues,
  teamVisuals,
  reviewVisuals,
}: CinematicHeroProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const razorVideoRef = useRef<HTMLVideoElement>(null);
  const shopVideoRef = useRef<HTMLVideoElement>(null);
  const craftVideoRef = useRef<HTMLVideoElement>(null);
  const razorLayerRef = useRef<HTMLDivElement>(null);
  const razorEndRef = useRef<HTMLImageElement>(null);
  const cutLeftRef = useRef<HTMLDivElement>(null);
  const cutRightRef = useRef<HTMLDivElement>(null);
  const shopLayerRef = useRef<HTMLDivElement>(null);
  const shopEndRef = useRef<HTMLImageElement>(null);
  const craftLayerRef = useRef<HTMLDivElement>(null);
  const craftEndRef = useRef<HTMLImageElement>(null);
  const mirrorFrameRef = useRef<HTMLDivElement>(null);
  const resultLayerRef = useRef<HTMLDivElement>(null);
  const resultLineRef = useRef<HTMLDivElement>(null);
  const teamLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reviewLayerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reviewSweepRef = useRef<HTMLDivElement>(null);
  const contactLayerRef = useRef<HTMLDivElement>(null);
  const contactLineRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const heroLineRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<Array<HTMLSpanElement | null>>([]);
  const cuesRef = useRef<Array<HTMLElement | null>>([]);
  const durationsRef = useRef<Record<ClipKey, number>>({ razor: 5, shop: 5, craft: 5 });
  const readyRef = useRef<Record<ClipKey, boolean>>({ razor: false, shop: false, craft: false });
  const failedRef = useRef<Record<ClipKey, boolean>>({ razor: false, shop: false, craft: false });
  const settledRef = useRef<Record<ClipKey, boolean>>({ razor: false, shop: false, craft: false });
  const [settledCount, setSettledCount] = useState(0);
  const reduced = useReducedMotion();

  const settleClip = (key: ClipKey, video: HTMLVideoElement | null, failed = false) => {
    failedRef.current[key] = failed;
    readyRef.current[key] = !failed;
    if (video && !failed) {
      durationsRef.current[key] = Number.isFinite(video.duration) ? video.duration : 5;
      video.currentTime = 0.01;
    }
    if (!settledRef.current[key]) {
      settledRef.current[key] = true;
      setSettledCount((count) => count + 1);
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    const razorLayer = razorLayerRef.current;
    const razorEnd = razorEndRef.current;
    const cutLeft = cutLeftRef.current;
    const cutRight = cutRightRef.current;
    const shopLayer = shopLayerRef.current;
    const shopEnd = shopEndRef.current;
    const craftLayer = craftLayerRef.current;
    const craftEnd = craftEndRef.current;
    const mirrorFrame = mirrorFrameRef.current;
    const resultLayer = resultLayerRef.current;
    const resultLine = resultLineRef.current;
    const reviewSweep = reviewSweepRef.current;
    const contactLayer = contactLayerRef.current;
    const contactLine = contactLineRef.current;
    const copy = copyRef.current;
    const progress = progressRef.current;
    const hud = hudRef.current;
    const heroLine = heroLineRef.current;
    if (
      !stage || !razorLayer || !razorEnd || !cutLeft || !cutRight ||
      !shopLayer || !shopEnd || !craftLayer || !craftEnd || !mirrorFrame ||
      !resultLayer || !resultLine || !reviewSweep || !contactLayer || !contactLine ||
      !copy || !progress || !hud || !heroLine
    ) return;

    const cachedClips: Array<[ClipKey, HTMLVideoElement | null]> = [
      ["razor", razorVideoRef.current],
      ["shop", shopVideoRef.current],
      ["craft", craftVideoRef.current],
    ];
    cachedClips.forEach(([key, video]) => {
      if (video && video.readyState >= 1) settleClip(key, video);
    });

    let frame = 0;
    let reducedDrawn = false;
    let lastState = [-1, -1, -1, -1, -1, -1, -1, -1];

    const seek = (video: HTMLVideoElement | null, key: ClipKey, localProgress: number) => {
      if (!video || !readyRef.current[key] || failedRef.current[key] || video.readyState < 2) return;
      const duration = durationsRef.current[key];
      const target = Math.min(duration - 0.025, Math.max(0.01, localProgress * duration));
      if (Math.abs(video.currentTime - target) > 0.025) video.currentTime = target;
    };

    const drawReduced = () => {
      razorLayer.style.opacity = "0";
      cutLeft.style.opacity = "0";
      cutRight.style.opacity = "0";
      shopLayer.style.opacity = "0";
      craftLayer.style.opacity = "0";
      mirrorFrame.style.opacity = "0";
      resultLayer.style.opacity = "1";
      resultLayer.style.clipPath = "inset(0 0 0 0)";
      resultLayer.style.transform = "scale(1)";
      resultLine.style.opacity = "0";
      teamLayerRefs.current.forEach((layer) => {
        if (layer) layer.style.opacity = "0";
      });
      reviewLayerRefs.current.forEach((layer) => {
        if (layer) layer.style.opacity = "0";
      });
      reviewSweep.style.opacity = "0";
      contactLayer.style.opacity = "0";
      contactLine.style.opacity = "0";
      copy.style.opacity = "1";
      copy.style.transform = "translate3d(0,0,0)";
      copy.style.pointerEvents = "auto";
      copy.setAttribute("aria-hidden", "false");
      heroLine.style.opacity = "1";
      hud.style.opacity = "0";
      cuesRef.current.forEach((node) => {
        if (!node) return;
        node.style.opacity = "0";
        node.style.visibility = "hidden";
      });
    };

    const draw = () => {
      if (reduced) {
        if (!reducedDrawn) {
          reducedDrawn = true;
          drawReduced();
        }
        frame = window.requestAnimationFrame(draw);
        return;
      }

      const p = clamp01(heroState.p);
      const scene = heroState.cinemaScene;
      const manifestP = clamp01(heroState.cinemaManifest);
      const servicesP = clamp01(heroState.cinemaServices);
      const galleryP = clamp01(heroState.cinemaGallery);
      const teamP = clamp01(heroState.cinemaTeam);
      const reviewsP = clamp01(heroState.cinemaReviews);
      const contactP = clamp01(heroState.cinemaContact);
      const nextState = [p, scene, manifestP, servicesP, galleryP, teamP, reviewsP, contactP];
      const changed = nextState.some((value, index) => Math.abs(value - (lastState[index] ?? -1)) > 0.0001);

      if (changed) {
        lastState = nextState;
        stage.style.setProperty("--cinema-p", String(p));
        stage.dataset.cinemaScene = String(scene);

        const razorP = between(p, 0, CUT_START);
        const cutP = between(p, CUT_START, CUT_END);
        const shopP = scene === 0 ? 0 : scene === 1 ? manifestP : 1;
        const mirrorP = scene < 2 ? 0 : scene === 2 ? between(servicesP, 0, 0.2) : 1;
        const craftP = scene < 2 ? 0 : scene === 2 ? between(servicesP, 0.12, 0.9) : 1;
        const resultP = scene < 3 ? 0 : scene === 3 ? between(galleryP, 0, 0.24) : 1;

        seek(razorVideoRef.current, "razor", razorP);
        seek(shopVideoRef.current, "shop", shopP);
        seek(craftVideoRef.current, "craft", craftP);

        razorEnd.style.opacity = String(between(razorP, 0.84, 1));
        razorLayer.style.opacity = scene === 0 && p < CUT_START ? "1" : "0";

        const panelsVisible = scene === 0 && p >= CUT_START && p <= CUT_END;
        cutLeft.style.opacity = panelsVisible ? "1" : "0";
        cutRight.style.opacity = panelsVisible ? "1" : "0";
        cutLeft.style.transform = `translate3d(${-68 * cutP}vw,0,0)`;
        cutRight.style.transform = `translate3d(${68 * cutP}vw,0,0)`;

        const shopVisible = (scene === 0 && p >= CUT_START) || scene === 1 || (scene === 2 && mirrorP < 1);
        shopLayer.style.opacity = shopVisible ? "1" : "0";
        shopLayer.style.transform = `scale(${1.025 - shopP * 0.025})`;
        shopEnd.style.opacity = String(between(shopP, 0.86, 1));

        const mirrorTop = 0;
        const mirrorRight = 18 * (1 - mirrorP);
        const mirrorBottom = 0;
        const mirrorLeft = 58 * (1 - mirrorP);
        const craftVisible = (scene === 2 && servicesP > 0.001) || (scene === 3 && resultP < 1);
        craftLayer.style.opacity = craftVisible ? "1" : "0";
        craftLayer.style.clipPath = `inset(${mirrorTop}% ${mirrorRight}% ${mirrorBottom}% ${mirrorLeft}%)`;
        craftLayer.style.transform = `scale(${0.97 + mirrorP * 0.03})`;
        craftEnd.style.opacity = String(between(craftP, 0.84, 1));

        const frameOpacity = mirrorP > 0 && mirrorP < 1 ? Math.sin(mirrorP * Math.PI) : 0;
        mirrorFrame.style.opacity = String(frameOpacity);
        mirrorFrame.style.top = `${mirrorTop}%`;
        mirrorFrame.style.right = `${mirrorRight}%`;
        mirrorFrame.style.bottom = `${mirrorBottom}%`;
        mirrorFrame.style.left = `${mirrorLeft}%`;

        const contactReveal = scene < 6 ? 0 : between(contactP, 0, 0.34);

        resultLayer.style.opacity = scene >= 3 ? "1" : "0";
        resultLayer.style.clipPath = `inset(0 0 0 ${100 * (1 - resultP)}%)`;
        const resultScale = scene === 3 ? 1.055 - resultP * 0.055 : scene === 4 ? 1.04 : scene === 5 ? 1.1 : 1.025;
        const resultShift = scene === 4 ? (teamP - 0.5) * -2.5 : scene === 5 ? (reviewsP - 0.5) * 3 : 0;
        resultLayer.style.transform = `translate3d(${resultShift}vw,0,0) scale(${resultScale})`;
        resultLine.style.left = `${100 * (1 - resultP)}%`;
        resultLine.style.opacity = String(scene === 3 && resultP > 0 && resultP < 1 ? Math.sin(resultP * Math.PI) : 0);

        const teamPosition = teamLayerRefs.current.length > 1 ? teamP * (teamLayerRefs.current.length - 1) : 0;
        teamLayerRefs.current.forEach((layer, index) => {
          if (!layer) return;
          const distance = Math.abs(index - teamPosition);
          const opacity = scene === 4 ? clamp01(1 - distance * 1.35) : 0;
          layer.style.opacity = String(opacity);
          layer.style.transform = `translate3d(${(index - teamPosition) * 2.4}vw,${(teamP - 0.5) * -1.6}vh,0) scale(${1.1 - opacity * 0.035})`;
        });

        const reviewPosition = reviewLayerRefs.current.length > 1 ? reviewsP * (reviewLayerRefs.current.length - 1) : 0;
        reviewLayerRefs.current.forEach((layer, index) => {
          if (!layer) return;
          const distance = Math.abs(index - reviewPosition);
          const baseOpacity = clamp01(1 - distance * 1.5);
          const sceneOpacity = scene === 5 ? 1 : scene === 6 ? 1 - contactReveal : 0;
          layer.style.opacity = String(baseOpacity * sceneOpacity);
          layer.style.transform = `translate3d(${(index - reviewPosition) * 3.5}vw,${(reviewsP - 0.5) * -2}vh,0) scale(${1.12 - baseOpacity * 0.045})`;
        });
        reviewSweep.style.opacity = String(scene === 5 ? 0.16 + Math.sin(reviewsP * Math.PI * 3) * 0.08 : 0);
        reviewSweep.style.transform = `translate3d(${reviewsP * 118 - 9}vw,0,0) skewX(-8deg)`;

        contactLayer.style.opacity = scene === 6 ? "1" : "0";
        contactLayer.style.clipPath = `inset(0 0 ${100 * (1 - contactReveal)}% 0)`;
        contactLayer.style.transform = `translate3d(0,${(1 - contactReveal) * 2.5}vh,0) scale(${1.08 - contactReveal * 0.055})`;
        contactLine.style.top = `${contactReveal * 100}%`;
        contactLine.style.opacity = String(scene === 6 && contactReveal > 0 && contactReveal < 1 ? Math.sin(contactReveal * Math.PI) : 0);

        const introOut = between(p, 0.03, 0.18);
        copy.style.opacity = String(scene === 0 ? 1 - introOut : 0);
        copy.style.transform = `translate3d(0,${introOut * -48}px,0)`;
        copy.style.pointerEvents = scene === 0 && introOut <= 0.9 ? "auto" : "none";
        copy.setAttribute("aria-hidden", scene === 0 && introOut <= 0.9 ? "false" : "true");

        cuesRef.current.forEach((node, index) => {
          if (!node) return;
          const range = CUE_RANGES[index] ?? CUE_RANGES[1];
          const opacity = scene === 0 ? rangedOpacity(p, range[0], range[1], range[2]) : 0;
          node.style.opacity = String(opacity);
          node.style.transform = `translate3d(0,${(1 - opacity) * 28}px,0)`;
          node.style.visibility = opacity > 0.001 ? "visible" : "hidden";
        });

        const active = p < CUT_START ? 0 : 1;
        chaptersRef.current.forEach((node, index) => {
          if (!node) return;
          node.style.opacity = index === active ? "1" : "0.28";
          node.style.transform = index === active ? "translateY(0)" : "translateY(4px)";
        });

        progress.style.transform = `scaleX(${p})`;
        const chromeOut = between(p, 0.965, 1);
        hud.style.opacity = String(scene === 0 ? 1 - chromeOut : 0);
        heroLine.style.opacity = String(scene === 0 ? 1 - between(p, 0.1, 0.22) : 0);
      }

      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(frame);
  }, [reduced]);

  const imageClass = "object-cover object-[68%_center] md:object-center";

  return (
    <>
      <div
        ref={stageRef}
        data-cinema-backdrop
        className="pointer-events-none fixed inset-0 z-0 h-[100svh] overflow-hidden bg-[#070708]"
      >
        <div ref={shopLayerRef} data-cinema-scene="shop" className="absolute inset-0 z-[1] will-change-transform">
          <Image src={assetPath(SHOP_START)} alt="" fill priority sizes="100vw" className={imageClass} />
          {!reduced && (
            <video
              ref={shopVideoRef}
              data-cinema-video="shop"
              muted
              playsInline
              preload="auto"
              poster={assetPath(SHOP_START)}
              onLoadedMetadata={(event) => settleClip("shop", event.currentTarget)}
              onError={() => settleClip("shop", shopVideoRef.current, true)}
              className={`absolute inset-0 h-full w-full ${imageClass}`}
            >
              <source src={assetPath(SHOP_FILM)} type="video/mp4" />
            </video>
          )}
          <Image ref={shopEndRef} src={assetPath(SHOP_END)} alt="" fill sizes="100vw" className={`${imageClass} opacity-0`} />
        </div>

        <div ref={craftLayerRef} data-cinema-scene="craft" className="absolute inset-0 z-[2] opacity-0 will-change-[clip-path,transform]">
          <Image src={assetPath(CRAFT_START)} alt="" fill sizes="100vw" className={imageClass} />
          {!reduced && (
            <video
              ref={craftVideoRef}
              data-cinema-video="craft"
              muted
              playsInline
              preload="auto"
              poster={assetPath(CRAFT_START)}
              onLoadedMetadata={(event) => settleClip("craft", event.currentTarget)}
              onError={() => settleClip("craft", craftVideoRef.current, true)}
              className={`absolute inset-0 h-full w-full ${imageClass}`}
            >
              <source src={assetPath(CRAFT_FILM)} type="video/mp4" />
            </video>
          )}
          <Image ref={craftEndRef} src={assetPath(CRAFT_END)} alt="" fill sizes="100vw" className={`${imageClass} opacity-0`} />
        </div>

        <div ref={resultLayerRef} data-cinema-scene="result" className="absolute inset-0 z-[3] opacity-0 will-change-[clip-path,transform]">
          <Image src={assetPath(RESULT_FINAL)} alt="" fill sizes="100vw" className={imageClass} />
        </div>

        {teamVisuals.slice(0, 3).map((src, index) => (
          <div
            key={src}
            ref={(node) => {
              teamLayerRefs.current[index] = node;
            }}
            data-cinema-scene={`team-${index + 1}`}
            className="absolute inset-0 z-[4] opacity-0 will-change-[opacity,transform]"
          >
            <Image src={src} alt="" fill sizes="100vw" className="object-cover object-center grayscale brightness-[.72] contrast-[1.05]" />
          </div>
        ))}

        {reviewVisuals.slice(0, 3).map((src, index) => (
          <div
            key={src}
            ref={(node) => {
              reviewLayerRefs.current[index] = node;
            }}
            data-cinema-scene={`review-${index + 1}`}
            className="absolute inset-0 z-[5] opacity-0 will-change-[opacity,transform]"
          >
            <Image src={src} alt="" fill sizes="100vw" className="object-cover object-center grayscale brightness-[.68] contrast-[1.08]" />
          </div>
        ))}

        <div ref={contactLayerRef} data-cinema-scene="contact" className="absolute inset-0 z-[6] opacity-0 will-change-[clip-path,transform]">
          <Image src={assetPath(SHOP_END)} alt="" fill sizes="100vw" className={imageClass} />
        </div>

        <div ref={razorLayerRef} data-cinema-scene="razor" className="absolute inset-0 z-[4]">
          <Image src={assetPath(RAZOR_START)} alt="" fill priority sizes="100vw" className="object-cover object-[62%_center]" />
          {!reduced && (
            <video
              ref={razorVideoRef}
              data-cinema-video="razor"
              muted
              playsInline
              preload="auto"
              poster={assetPath(RAZOR_START)}
              onLoadedMetadata={(event) => settleClip("razor", event.currentTarget)}
              onError={() => settleClip("razor", razorVideoRef.current, true)}
              className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
            >
              <source src={assetPath(RAZOR_FILM)} type="video/mp4" />
            </video>
          )}
          <Image ref={razorEndRef} src={assetPath(RAZOR_END)} alt="" fill sizes="100vw" className="object-cover object-[62%_center] opacity-0" />
        </div>

        <div
          ref={cutLeftRef}
          className="absolute inset-0 z-[5] opacity-0 will-change-transform"
          style={{
            backgroundImage: `url(${assetPath(RAZOR_END)})`,
            backgroundPosition: "62% center",
            backgroundSize: "cover",
            clipPath: "polygon(0 0,62% 0,62% 100%,0 100%)",
          }}
        />
        <div
          ref={cutRightRef}
          className="absolute inset-0 z-[5] opacity-0 will-change-transform"
          style={{
            backgroundImage: `url(${assetPath(RAZOR_END)})`,
            backgroundPosition: "62% center",
            backgroundSize: "cover",
            clipPath: "polygon(62% 0,100% 0,100% 100%,62% 100%)",
          }}
        />
        <div ref={mirrorFrameRef} className="absolute z-[7] border-l border-[#d1a16f]/55 opacity-0 shadow-[-12px_0_36px_rgb(195_51_42/.16)]" />
        <div ref={resultLineRef} className="absolute top-0 z-[7] h-full w-[2px] bg-[var(--accent)] opacity-0 shadow-[0_0_34px_var(--accent)]" />
        <div ref={reviewSweepRef} className="absolute inset-y-0 left-0 z-[7] w-[10vw] bg-gradient-to-r from-transparent via-[rgb(255_69_51/.32)] to-transparent opacity-0 blur-xl will-change-transform" />
        <div ref={contactLineRef} className="absolute left-0 z-[7] h-[2px] w-full bg-[var(--accent)] opacity-0 shadow-[0_0_34px_var(--accent)]" />

        <div className="cinema-shade absolute inset-0 z-[8]" />

        <div
          ref={heroLineRef}
          data-hero-line
          className="absolute left-5 top-0 z-[9] h-[38vh] w-[2px] origin-top bg-[var(--accent)] sm:left-[8vw]"
        />

        <div className="relative z-[10] mx-auto flex h-full w-full max-w-6xl items-center px-5 pb-20 pt-28">
          <div ref={copyRef} data-hero-fade className="pointer-events-auto w-full max-w-4xl will-change-transform">
            <p className="kicker">{kicker}</p>
            <h1
              data-hero-title
              className="bd mt-4 overflow-hidden whitespace-nowrap text-[clamp(4.5rem,18vw,9rem)] uppercase leading-[0.9] text-[var(--ink)] sm:text-[clamp(5rem,15vw,13rem)]"
            >
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#d0cec8]">{subtitle}</p>
            <div className="cinema-actions mt-9 flex flex-wrap items-center gap-4">
              <a data-magnetic href={bookingHref} target="_blank" rel="noopener noreferrer" className="btn">
                {primaryLabel}
              </a>
              <a href={servicesHref} className="btn ghost">
                {secondaryLabel}
              </a>
            </div>
            <p className="mt-9 text-sm text-[#aaa8a2]">
              {address} · est. {established} ·{" "}
              <a href={telHref} className="underline decoration-[var(--line)] underline-offset-4">
                {phone}
              </a>
            </p>
          </div>
        </div>

        <div className="absolute inset-0 z-[10] mx-auto h-full w-full max-w-6xl px-5">
          {cues.slice(0, 2).map((cue, index) => (
            <article
              key={cue.index}
              ref={(node) => {
                cuesRef.current[index] = node;
              }}
              className="invisible absolute left-5 top-1/2 max-w-[min(86vw,680px)] -translate-y-1/2 opacity-0 will-change-transform sm:left-[8vw]"
            >
              <p className="kicker">{cue.index} · {cue.label}</p>
              <h2 className="bd mt-4 text-[clamp(2.65rem,7vw,6.2rem)] uppercase leading-[0.92] text-[var(--ink)]">
                {cue.title}
              </h2>
              <div className="mt-6 h-[2px] w-16 bg-[var(--accent)]" />
              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#c3c1bb] sm:text-lg">{cue.body}</p>
            </article>
          ))}
        </div>

        <div ref={hudRef} className="absolute inset-0 z-[11] will-change-[opacity]">
          <p className="kicker absolute right-5 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 !tracking-[0.3em] !text-[var(--ink-muted)] lg:block">
            45.7975° N · 24.1495° E
          </p>

          <div className="absolute inset-x-5 bottom-5 mx-auto max-w-6xl sm:inset-x-8">
            <div className="mb-3 flex justify-between gap-3 sm:justify-start sm:gap-9">
              {cues.slice(0, 2).map((cue, index) => (
                <span
                  key={cue.index}
                  ref={(node) => {
                    chaptersRef.current[index] = node;
                  }}
                  className="kicker whitespace-nowrap transition-[opacity,transform] duration-300 !text-[var(--ink)]"
                  style={{ opacity: index === 0 ? 1 : 0.28 }}
                >
                  {cue.index}<span className="hidden md:inline"> · {cue.label}</span>
                </span>
              ))}
            </div>
            <div className="h-px w-full bg-white/20">
              <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-[var(--accent)]" />
            </div>
          </div>
        </div>

        {!reduced && settledCount < 3 && (
          <p className="kicker absolute bottom-16 right-5 z-[11] !text-[var(--ink-muted)] sm:right-8">
            SE ÎNCARCĂ
          </p>
        )}
      </div>

      <section
        data-hero
        aria-label={`${title} — ${subtitle}`}
        className={`relative bg-transparent ${reduced ? "h-[100svh]" : "h-[280svh]"}`}
      />
    </>
  );
}
