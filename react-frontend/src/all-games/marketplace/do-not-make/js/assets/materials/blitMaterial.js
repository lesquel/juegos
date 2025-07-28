import { Material } from '../../engine/graphics/Material.js'

export let blitMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform float uniformAbberationSize;
vec4 shader() {
  return vec4(
    texture(uniformTextures[0], varyingUv * 0.5 + vec2(0.5 + uniformAbberationSize, 0.5)).r,
    texture(uniformTextures[0], varyingUv * 0.5 + 0.5).gb,
    1.0
  );
}
`, `/*glsl*/
out vec2 varyingUv;
out vec2 varyingScreenPos;
void main() {
  varyingUv = attributePosition.xy;
  gl_Position = vec4(attributePosition, 1.0);
}
`)
