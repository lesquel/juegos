import { Material } from '../../engine/graphics/Material.js'

export let shapeMaterial = new Material(`/*glsl*/
uniform float uniformBrightness;
vec4 shader() {
  return vec4(vec3(uniformBrightness), 1.0);
}
`, `/*glsl*/
void main() {
  gl_Position = uniformProjection * uniformModel * vec4(attributePosition, 1.0);
}
`)
