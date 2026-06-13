export const starVertex = `
  attribute float size;
  attribute vec3 color;
  varying vec3 vColor;
  varying float vSize;
  uniform float warpFactor;
  void main() {
    vColor = color;
    vSize = size;
    vec3 pos = position;
    if (warpFactor > 0.0) {
      pos.z -= mod(pos.z, 10.0) * warpFactor;
    }
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z) * (1.0 + warpFactor * 2.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const starFragment = `
  varying vec3 vColor;
  varying float vSize;
  uniform float warpFactor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha;
    if (warpFactor > 0.3) {
      float streak = smoothstep(0.5, 0.0, abs(uv.x)) * smoothstep(0.5, 0.0, abs(uv.y));
      alpha = streak * 0.9;
    } else {
      alpha = smoothstep(0.5, 0.0, d);
    }
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(vColor * (1.0 + warpFactor * 0.5), alpha);
  }
`;

export const atmosphereVertex = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

export const atmosphereFragment = `
  uniform vec3 glowColor;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = 1.0 - max(dot(vNormal, vViewDir), 0.0);
    fresnel = pow(fresnel, 3.0);
    float glow = fresnel * 1.2;
    gl_FragColor = vec4(glowColor * glow, glow);
  }
`;

export const nebulaVertex = `
  attribute float size;
  varying float vAlpha;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
    vAlpha = smoothstep(1200.0, 200.0, -mvPos.z);
  }
`;

export const nebulaFragment = `
  varying float vAlpha;
  uniform float time;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.0, d) * 0.08 * vAlpha;
    vec3 col = mix(vec3(0.1, 0.05, 0.2), vec3(0.05, 0.1, 0.3), d * 2.0);
    gl_FragColor = vec4(col, alpha);
  }
`;
