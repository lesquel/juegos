import { Material } from '../../engine/graphics/Material.js'

export let strandMaterial = new Material(`/*glsl*/
uniform float uniformAlpha;
vec4 shader() {
  return vec4(vec3(1.0), uniformAlpha);
}
`, `/*glsl*/
out vec2 varyingScreenPos;
uniform float uniformAspectRatio;
void main() {
  gl_Position = uniformProjection * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
  varyingPosition.x *= uniformAspectRatio;
}
`)
