/** @jsx React.createElement */
/** @jsxFrag React.Fragment */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { extractYoutubeID, extractVKIDs } from "./videoIdUtils.js";

const iframeStyle = {
  width: "100%",
  height: "100%",
  border: "none",
  position: "absolute",
  inset: 0,
};

const defaultPlayButtonStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "4rem",
  height: "4rem",
  borderRadius: "50%",
  background: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function PlayIcon() {
  return (
    React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      width: "20",
      height: "20",
      "aria-hidden": "true",
    },
      React.createElement("path", { d: "M8 5v14l11-7z" })
    )
  );
}

function PauseIcon() {
  return (
    React.createElement("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      width: "20",
      height: "20",
      "aria-hidden": "true",
    },
      React.createElement("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" })
    )
  );
}

/**
 * A generic, dependency-free video embed component supporting YouTube, VK, and hosted videos.
 *
 * @param {"Youtube"|"VK"|"hosted"} type    - Video source type.
 * @param {string}  [id]                    - Raw YouTube/VK URL or ID string.
 * @param {string}  [src]                   - URL for a self-hosted video file.
 * @param {string}  [thumbnail]             - Poster/thumbnail image URL.
 * @param {boolean} [autoplay=true]         - Whether to autoplay the video.
 * @param {boolean} [loop=true]             - Whether to loop the video.
 * @param {boolean} [muted=true]            - Whether to start muted (required for autoplay in most browsers).
 * @param {string}  [className]             - CSS class for the outer wrapper div.
 * @param {object}  [style]                 - Inline styles merged onto the outer wrapper div.
 * @param {string}  [playButtonClassName]   - CSS class for the hosted video play/pause button.
 * @param {object}  [playButtonStyle]       - Inline styles merged onto the play/pause button.
 */
export function VideoEmbed({
  type,
  id,
  src,
  thumbnail,
  autoplay = true,
  loop = true,
  muted = true,
  className,
  style,
  playButtonClassName,
  playButtonStyle,
}) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = useCallback(() => setVideoPlaying((prev) => !prev), []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (videoPlaying) {
      video.play().catch(() => setVideoPlaying(false));
    } else {
      video.pause();
    }
  }, [videoPlaying, src]);

  const containerStyle = {
    position: "relative",
    width: "100%",
    overflow: "hidden",
    ...style,
  };

  if (type === "Youtube" && id) {
    const ytID = extractYoutubeID(id);
    if (!ytID) return null;
    return (
      React.createElement("div", { style: containerStyle, className },
        React.createElement("iframe", {
          title: "YouTube video player",
          src: `https://www.youtube.com/embed/${ytID}?controls=1&loop=${loop ? 1 : 0}&playlist=${ytID}&mute=${muted ? 1 : 0}&autoplay=${autoplay ? 1 : 0}&enablejsapi=1`,
          allow: "autoplay; fullscreen",
          allowFullScreen: true,
          style: iframeStyle,
        })
      )
    );
  }

  if (type === "VK" && id) {
    const vk = extractVKIDs(id);
    if (!vk) return null;
    return (
      React.createElement("div", { style: containerStyle, className },
        React.createElement("iframe", {
          title: "VK video player",
          src: `https://vk.com/video_ext.php?oid=${vk.oid}&id=${vk.id}&autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}&enablejsapi=1`,
          allow: "autoplay; fullscreen",
          allowFullScreen: true,
          style: iframeStyle,
        })
      )
    );
  }

  if (src) {
    const btnStyle = playButtonStyle
      ? { ...defaultPlayButtonStyle, ...playButtonStyle }
      : defaultPlayButtonStyle;

    return (
      React.createElement("div", { style: containerStyle, className },
        React.createElement("video", {
          ref: videoRef,
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
          poster: thumbnail,
          loop,
          muted: videoPlaying ? false : muted,
          playsInline: true,
          autoPlay: autoplay,
          preload: "metadata",
        },
          React.createElement("source", { src, type: "video/mp4" })
        ),
        React.createElement("button", {
          "aria-label": videoPlaying ? "Pause video" : "Play video",
          onClick: togglePlay,
          className: playButtonClassName,
          style: btnStyle,
        },
          videoPlaying
            ? React.createElement(PauseIcon, null)
            : React.createElement(PlayIcon, null)
        )
      )
    );
  }

  if (thumbnail) {
    return (
      React.createElement("div", { style: containerStyle, className },
        React.createElement("img", {
          src: thumbnail,
          alt: "",
          style: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
        })
      )
    );
  }

  return null;
}
