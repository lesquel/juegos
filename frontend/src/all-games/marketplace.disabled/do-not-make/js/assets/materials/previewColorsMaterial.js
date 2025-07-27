import { Material } from '../../engine/graphics/Material.js'

export let previewColorsMaterial = new Material(`/*glsl*/
uniform vec3 uniformColor1;
uniform vec3 uniformColor2;
uniform float uniformFade;
in float varyingY;
vec4 shader() {
  vec3 c = varyingPosition.y > varyingY ? uniformColor1 : uniformColor2;
  return vec4(c * uniformFade, 1.0);
}
`, `/*glsl*/
out float varyingY;
uniform float uniformSplitY;
void main() {
  varyingY = (uniformProjection * vec4(0.0, uniformSplitY, 0.0, 1.0)).y;
  gl_Position = uniformProjection * uniformModel * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
}
`)
