import { gl } from '../../engine.js'
import { Shader } from './Shader.js'
import { SubShader } from './Subshader.js'

const common = {
  fSSC0: `/*glsl*/
precision highp float;

in vec3 varyingPosition;
out vec4 o;

uniform sampler2D uniformTextures[2];
`,
  fSSC1: `/*glsl*/
void main() {
  o = shader();
}`,
  vSSC0: `/*glsl*/
precision highp float;

layout(location = 0) in vec3 attributePosition;

uniform mat4 uniformProjection;
uniform mat4 uniformModel;

out vec3 varyingPosition;
`
}

function buildVertexShader (code) {
  return new SubShader(gl.VERTEX_SHADER, common.vSSC0 + '\n' + code)
}

function buildFragmentShader (code) {
  return new SubShader(gl.FRAGMENT_SHADER, common.fSSC0 + '\n' + code + '\n' + common.fSSC1)
}

const defaultVertexShader = buildVertexShader(`/*glsl*/
void main() {
  varyingPosition = vec3(uniformModel * vec4(attributePosition, 1.0));
  gl_Position = uniformProjection * vec4(varyingPosition, 1.0);
}
`)

export class Material {
  constructor (fragmentShader, customVertex) {
    this.shader = new Shader()
    let vSS = null

    if (!customVertex) {
      this.shader.join(defaultVertexShader)
    } else {
      vSS = buildVertexShader(customVertex)
      this.shader.join(vSS)
    }

    const fSS = buildFragmentShader(fragmentShader)
    this.shader.join(fSS)
    this.shader.link()

    this.shader.bind()
    for(let i = 0; i < 2; i++) {
      this.shader.set1i(`uniformTextures[${i}]`, i)
    }
  }
}
