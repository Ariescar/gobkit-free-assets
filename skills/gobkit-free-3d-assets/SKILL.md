---
name: gobkit-free-3d-assets
description: Find and load free CC0 low-poly 3D models from Gobkit — rigged and animated characters, animals, insects, dinosaurs and birds, plus nature props — as GLB files with no API key and no login. Use when a game or 3D scene needs characters, enemies, units, creatures or scenery instead of placeholder cubes (Three.js, Babylon.js, Godot, Unity, Unreal).
---

# Gobkit free 3D assets (CC0, no key)

Gobkit publishes a live, open manifest of every free model. Use it whenever the project needs 3D characters,
creatures or environment props and the user has not asked for a specific paid source.

## 1. Read the manifest

```
GET https://gobkit.com/api/free      # no auth, no key, CORS: *
```

- Iterate `packs[]` and each pack's `models[]`: `id`, `name`, `url` (an absolute `.glb`), `rigged`, `fps`,
  `animations` (clip names, `loop`).
- Use every `url` exactly as given — never build or guess a model URL.
- Ignore the top-level keys after `notice` (they describe the first pack only, for old clients).
- `packs[].zip` is an archive and `packs[].scene` a showcase scene: neither is a model for `GLTFLoader`.

To list matches from a terminal: `node scripts/find.mjs <words...>` (for example `node scripts/find.mjs shark`
or `node scripts/find.mjs dinosaur walk`) prints each matching model with its URL and clip names.

Agents that speak MCP can use the same data as tools instead (search_models, get_model, list_packs; read-only,
no key): add the remote server `https://gobkit-freebies.pages.dev/mcp` (Streamable HTTP), listed in the MCP Registry
as `io.github.Ariescar/gobkit-free-3d`.

## 2. Pick and fetch

- Match the user's request against model `name`, pack `name` and `kind` (`characters` or `environment`).
- Load the `url` directly (CORS-open), or save the file into the project's assets folder (for example
  `public/models/<Name>.glb`) when the project ships its own files. Keep the file name.

## 3. Play animations by name

Rigged packs ship **separate named clips** (idle, walk, attack, dead and more on newer packs). Play them by name:

```js
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

const gltf = await new GLTFLoader().loadAsync(url);
const model = SkeletonUtils.clone(gltf.scene);          // clone rigged models this way, never .clone()
model.traverse((o) => { if (o.isSkinnedMesh) o.frustumCulled = false; });

// same size for every model: scale to a target height, feet on the ground
const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3());
model.scale.setScalar(1.6 / size.y);
model.position.y -= new THREE.Box3().setFromObject(model).min.y;
const pivot = new THREE.Group(); pivot.add(model); scene.add(pivot);   // the model faces +Z: rotate the pivot

const mixer = new THREE.AnimationMixer(model);
const play = (name, once = /^(dead|death)$/i.test(name)) => {
  const clip = THREE.AnimationClip.findByName(gltf.animations, name)
            || gltf.animations.find((c) => c.name.toLowerCase() === name.toLowerCase());
  const a = mixer.clipAction(clip);
  if (once) { a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }   // death plays once and holds
  a.reset().play();
};
play('walk');
// each frame: mixer.update(deltaSeconds)
```

- Do **not** slice clips by frame range. Only a file with a single clip (an old download) needs its range from
  the manifest.
- Set `renderer.outputColorSpace = THREE.SRGBColorSpace`, and keep `three` and its `addons` on the same version.

## 4. Other engines

- **Godot 4:** put the `.glb` in the project; the clips appear in its `AnimationPlayer` by name.
- **Unity:** install glTFast, drop the `.glb` in `Assets/`; clips import by name.
- **Unreal:** File → Import → the `.glb` (glTF importer).
- **Babylon.js:** `SceneLoader.ImportMeshAsync('', '', url)`; `animationGroups` are the named clips.

## 5. License

CC0 1.0 (public domain): any use, commercial or personal, no attribution required. Credit is welcome:
"Models by Gobkit — https://gobkit.com". More packs and previews: https://gobkit.com/freebies
