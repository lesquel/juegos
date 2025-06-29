import { Material } from '../../engine/graphics/Material.js'

export let partitionMaterial = new Material(`/*glsl*/
uniform vec3 uniformColor;
uniform float uniformNegRadius;
uniform float uniformFade;
vec4 shader() {
  float f = (1.0 - uniformNegRadius) * 2.0 < abs(varyingPosition.x) ? 1.0 : 0.0;
  return vec4(f * uniformColor * uniformFade, 1.0);
}
`, `/*glsl*/
uniform float uniformAspectRatio;

void main() {
  gl_Position = uniformProjection * vec4(attributePosition, 1.0);
  varyingPosition = gl_Position.xyz;
  varyingPosition.x *= uniformAspectRatio;
}
`)
