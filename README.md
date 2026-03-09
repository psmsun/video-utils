# @psmsun/video-utils

YouTube and VK video ID extraction utilities + a generic `VideoEmbed` React component.

## Installation

```bash
npm install @psmsun/video-utils
```

> Requires React ≥ 17 as a peer dependency.

---

## Utilities

### `extractYoutubeID(input)`

Extracts a YouTube video ID from any YouTube URL format or returns a bare ID as-is.

```js
import { extractYoutubeID } from "@psmsun/video-utils";

extractYoutubeID("dQw4w9WgXcQ");
// → "dQw4w9WgXcQ"

extractYoutubeID("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
// → "dQw4w9WgXcQ"

extractYoutubeID("https://youtu.be/dQw4w9WgXcQ");
// → "dQw4w9WgXcQ"

extractYoutubeID("https://youtube.com/shorts/dQw4w9WgXcQ");
// → "dQw4w9WgXcQ"

extractYoutubeID("https://www.youtube.com/live/dQw4w9WgXcQ");
// → "dQw4w9WgXcQ"

extractYoutubeID(null);
// → null
```

**Supported formats:**
- Bare ID (`dQw4w9WgXcQ`)
- `youtube.com/watch?v=ID`
- `youtu.be/ID`
- `youtube.com/embed/ID`
- `youtube.com/shorts/ID`
- `youtube.com/live/ID`

---

### `extractVKIDs(input)`

Extracts VK video `oid` and `id` from any VK video URL format or raw ID string.

Returns `{ oid: string, id: string }` or `null`.

```js
import { extractVKIDs } from "@psmsun/video-utils";

extractVKIDs("-178652725_456239064");
// → { oid: "-178652725", id: "456239064" }

extractVKIDs("https://vk.com/video-144893972_456246327");
// → { oid: "-144893972", id: "456246327" }

extractVKIDs("https://vk.com/video_ext.php?oid=-178652725&id=456239064&hash=abc");
// → { oid: "-178652725", id: "456239064" }

extractVKIDs("https://vk.com/clip-12345678_456239123");
// → { oid: "-12345678", id: "456239123" }
```

**Supported formats:**
- Raw `oid_id` or `-oid_id`
- `vk.com/video_ext.php?oid=...&id=...`
- `vk.com/video{oid}_{id}`
- `vk.com/clip{oid}_{id}`
- Query string fragment `oid=...&id=...`

---

## VideoEmbed Component

A zero-dependency React component that renders the correct embed for YouTube, VK, or a self-hosted video — with a play/pause button for hosted files.

### Props

| Prop                 | Type                          | Default | Description                                                     |
| -------------------- | ----------------------------- | ------- | --------------------------------------------------------------- |
| `type`               | `"Youtube" \| "VK" \| "hosted"` | —       | Video source type                                               |
| `id`                 | `string`                      | —       | YouTube/VK URL or bare ID                                       |
| `src`                | `string`                      | —       | Self-hosted video file URL                                      |
| `thumbnail`          | `string`                      | —       | Poster/thumbnail image URL                                      |
| `autoplay`           | `boolean`                     | `true`  | Autoplay the video on load                                      |
| `loop`               | `boolean`                     | `true`  | Loop the video                                                  |
| `muted`              | `boolean`                     | `true`  | Start muted (required for autoplay in most browsers)            |
| `className`          | `string`                      | —       | CSS class applied to the outer wrapper `<div>`                  |
| `style`              | `object`                      | —       | Inline styles merged onto the outer wrapper `<div>`             |
| `playButtonClassName`| `string`                      | —       | CSS class for the hosted video play/pause button                |
| `playButtonStyle`    | `object`                      | —       | Inline styles merged onto the play/pause button                 |

> **Note:** The component renders inside whatever container you provide. Use `style` or `className` to control dimensions (e.g., `style={{ aspectRatio: "16/9" }}`).

### Examples

**YouTube embed:**
```jsx
import { VideoEmbed } from "@psmsun/video-utils";

<div style={{ aspectRatio: "16/9" }}>
  <VideoEmbed
    type="Youtube"
    id="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    autoplay
    muted
    loop
  />
</div>
```

**VK embed:**
```jsx
<div style={{ aspectRatio: "16/9" }}>
  <VideoEmbed
    type="VK"
    id="-178652725_456239064"
    autoplay
    muted
  />
</div>
```

**Self-hosted video with play/pause button:**
```jsx
<div style={{ aspectRatio: "16/9" }}>
  <VideoEmbed
    type="hosted"
    src="https://example.com/video.mp4"
    thumbnail="https://example.com/poster.jpg"
    autoplay={false}
    playButtonStyle={{ background: "#004d9f", color: "white" }}
  />
</div>
```

**Thumbnail only (no video):**
```jsx
<VideoEmbed
  thumbnail="https://example.com/poster.jpg"
  style={{ aspectRatio: "16/9" }}
/>
```

---

## Updating your VideoSection

After installing the package, replace the local imports in your projects:

```diff
- import { extractVKIDs, extractYoutubeID } from "@/lib/videoIdUtils";
+ import { extractVKIDs, extractYoutubeID } from "@psmsun/video-utils";
```

---

## License

MIT
