import { Material } from '../../engine/graphics/Material.js'

export let handleMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
uniform float uniformBrightness;
vec4 shader() {
  float a = smoothstep(1.0, 0.98, length(varyingUv));
  float c = 0.7 + 0.3 * smoothstep(0.7, 0.8, length(varyingUv));
  c = mix(c, 1.0, 0.5 + varyingUv.x + varyingUv.y);
  return vec4(vec3(c) * uniformBrightness, a);
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  varyingUv = attributePosition.xy;
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = uniformProjection * vec4(varyingPosition, 1.0);
}
`)
