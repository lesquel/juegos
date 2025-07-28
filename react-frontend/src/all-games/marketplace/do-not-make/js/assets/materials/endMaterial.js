import { Material } from '../../engine/graphics/Material.js'

export let endMaterial = new Material(`/*glsl*/
in vec2 varyingUv;
vec4 shader() {
  float a = smoothstep(1.0, 0.98, length(varyingUv));
  float c = smoothstep(0.86, 0.94, length(varyingUv));
  return vec4(vec3(c), a);
}
`, `/*glsl*/
out vec2 varyingUv;
void main() {
  varyingUv = attributePosition.xy;
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = uniformProjection * vec4(varyingPosition, 1.0);
}
`)
