import { Material } from '../../engine/graphics/Material.js'

export let fadeMaterial = new Material(`/*glsl*/
uniform float uniformAlpha;
vec4 shader() {
  return vec4(vec3(0.0), uniformAlpha);
}
`, `/*glsl*/
void main() {
  gl_Position = vec4(attributePosition, 1.0);
}
`)
