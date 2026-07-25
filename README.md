# Gobkit Free 3D Assets — CC0 rigged & animated low-poly GLB

Free, game-ready **CC0** low-poly 3D models in **GLB** — rigged, animated, and clean-topology.
Drop them into Three.js, Unity, Unreal, or Godot. No retopo, no rig cleanup, no attribution required.

**Live, no-login manifest for AI agents & scripts:** https://gobkit.com/api/free
**Browse / preview:** https://gobkit.com/freebies?ref=github

> Prefer to let your AI coding agent do it? Just tell it:
> *"Fetch https://gobkit.com/api/free and build a Three.js scene from the free Gobkit models."*
> The manifest is open (CORS-enabled), lists every pack, and describes how to use them.

---

## What's inside

| Pack | What | Count | Rig | Clips |
|------|------|-------|-----|-------|
| **Minion Pack** (`minion/`) | Low-poly enemy characters — 4 body types × 2 | 8 | ✅ | idle / attack / dead |
| **Animal Pack** (`animal/`) | Low-poly creatures (Anglerfish, Shark, Corgi, Bat, Duck, Hippo, …) | 10 | ✅ | idle / attack / dead / walk |
| **Nature Kit** (`nature/`) | Environment props (trees, rocks, cliffs, hills…) + one assembled scene | 41 + scene | — | static |

Every model is a standalone `.glb` with its texture baked in. A shared texture atlas is included where relevant.

## Quick start (Three.js)

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
new GLTFLoader().load('animal/Corgi.glb', (gltf) => {
  scene.add(gltf.scene);
  const mixer = new THREE.AnimationMixer(gltf.scene);
  const clip = gltf.animations[0];            // ONE track; segments below are frame ranges
  mixer.clipAction(clip).play();
  // idle 0-29 · attack 30-59 · dead 60-89 · walk 90-119 @ 24 fps
});
```

A complete, runnable demo (fetches the live manifest and plays an animal) is in [`example/index.html`](example/index.html).
Full integration notes — clip playback, facing, scaling, instancing, common errors — are in [`INTEGRATION.md`](INTEGRATION.md).

## The 30-second version of the gotchas

- **Animation:** each rigged model has **one** baked track. Play a clip by its frame range (see the manifest's `clips`). `idle/attack/walk` loop; **`dead` plays once and holds** — don't loop it. Prefer scrubbing the full clip (`mixer.setTime`) over `AnimationUtils.subclip` (subclip can cause a loop jump).
- **Facing:** bind pose faces **+Z**. Rotate a parent group to reorient.
- **Scale:** raw scales aren't uniform — normalize each model to your target height.

## License

**CC0 1.0 (public domain).** Use them for anything, commercial or personal, no attribution required.
Credit is welcome but never required: *"Characters by Gobkit — https://gobkit.com"*. See [`LICENSE`](LICENSE).

## Want more — or your own?

These are a free sample. **Gobkit Forge** turns one API call into a game-ready, rigged, animated GLB —
so you can spawn an infinite, on-theme cast instead of hunting for assets.

→ **More free CC0 assets:** https://gobkit.com/freebies?ref=github
→ **Generate your own monsters (Gobkit Forge):** https://gobkit.com/?ref=github

---

<sub>Keywords: free 3D models, CC0, low poly, GLB, glTF, rigged, animated, game assets, Three.js, Unity, Unreal, Godot, monsters, enemies, animals, nature, environment, vibe coding, AI game assets, game-ready characters.</sub>
