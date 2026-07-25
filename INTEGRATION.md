# Integration Reference — Gobkit CC0 GLB (for AI agents & devs)

> Verified against the shipped gobkit viewer. License: CC0 1.0 — commercial & personal, no attribution required.
> Live manifest: https://gobkit.com/api/free  ·  Read §2 and §8 — that's where projects break.

## 1. Where the assets are

```
GET https://gobkit.com/api/free      # no auth, no key, CORS: *
```

- **Iterate `packs[]`.** Top-level `count`/`models` is a back-compat mirror of the Minion pack only;
  the full catalog (minion, animal, nature) is in `packs[]`. There's a top-level `usage` block too.
- Each `packs[].models[].url` is an **absolute, CORS-open `.glb`** you can `fetch()` cross-origin.
  In this repo the same files are at `minion/ animal/ nature/`.
- **Read clip ranges from the manifest** (`packs[].clips`), don't hardcode.

## 2. Animation — one baked track per model, 24 fps, 30-frame segments

| clip   | frames  | loop?                          | packs        |
|--------|---------|--------------------------------|--------------|
| idle   | 0–29    | loop                           | all rigged   |
| attack | 30–59   | loop                           | all rigged   |
| dead   | 60–89   | **play once, hold last frame** | all rigged   |
| walk   | 90–119  | loop                           | animal only  |

### ✅ Recommended: scrub the single clip (what gobkit.com ships)

```js
const mixer = new THREE.AnimationMixer(model);
mixer.clipAction(model.animations[0]).play();   // play the WHOLE clip; we scrub it
const FPS = 24; let seg, local = 0;
function setSegment(c){ seg = c; local = 0; }
function update(dt){                              // call each frame with delta-seconds
  local += dt;
  const start = seg.from / FPS, dur = (seg.to - seg.from) / FPS;
  const loop = seg.name !== "dead";
  mixer.setTime(loop ? start + (local % dur) : start + Math.min(local, dur));
}
```

- **Don't use `THREE.AnimationUtils.subclip` for looping clips** — it calls `resetDuration()`, which
  truncates the segment to its last in-range keyframe; with sparse baked keys the loop pops. Scrub instead.
- **`dead` is one-shot** — never `LoopRepeat` it, or corpses twitch.

## 3. Orientation
Bind pose faces **+Z**. Wrap the model in a pivot `Group` and rotate the pivot (not the mesh root).
`pivot.rotation.y = Math.PI` → runs away from camera; `= 0` → faces the camera.

## 4. Scale — always normalize
`Box3.setFromObject` → uniform-scale to a target height → center on XZ → feet to y=0 → wrap in a Group.

## 5. Instancing skinned meshes
- `mesh.clone()` **breaks skinning.** Use `THREE.SkeletonUtils.clone(gltf.scene)`.
- Static nature props have no rig → plain `.clone(true)` is fine.
- Set `skinnedMesh.frustumCulled = false`, or animated skeletons get wrongly culled and vanish.

## 6. Loader — match your three version to your GLTFLoader version

Modern (ESM):
```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
}}
</script>
```
Legacy globals (single file, r128): load `three.min.js` from cdnjs, then `GLTFLoader.js` +
`SkeletonUtils.js` from jsdelivr (cdnjs has no `examples/`). r128: set
`renderer.outputEncoding = THREE.sRGBEncoding` or materials look dark. **three and GLTFLoader
versions must match** — mismatched versions is the most common "undefined is not a constructor".

## 7. Resilience
`try/catch` each asset; substitute a placeholder on failure so one bad file never black-screens.
Sandboxes/iframes may block cross-origin fetch — detect "all failed" and hint to open directly.

## 8. Common errors → cause → fix

| Symptom | Cause | Fix |
|---|---|---|
| Jumps/pops every idle loop | `subclip` truncated the duration | Scrub with `mixer.setTime` (§2) |
| Corpse keeps twitching | `dead` looped | one-shot `dead` (§2) |
| T-pose after subclip | subclip dropped tracks | prefer scrub |
| Invisible when moving | skinned mesh culled | `frustumCulled = false` (§5) |
| Clones don't animate | `.clone()` broke skinning | `SkeletonUtils.clone()` (§5) |
| Dark/muddy materials | missing sRGB output | `outputColorSpace`/`outputEncoding` (§6) |
| Sizes all different | scales not uniform | normalize (§4) |
| Facing wrong way | bind pose is +Z | rotate a pivot Group (§3) |

## 9. More
More free CC0 assets: https://gobkit.com/freebies?ref=github ·
Generate your own with one API call (Gobkit Forge): https://gobkit.com/?ref=github
