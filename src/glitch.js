const DURATION_MS = 300;
const TEAR = 0.3;
const FINE = 0.08;
const SPLIT = 0.04;
const MAX_SHIFT = (TEAR + FINE) / 2 + SPLIT;
const SHADOW_SIGMA = 8;

const VERTEX = `
attribute vec2 a_unit;
varying vec2 v_uv;

void main() {
    v_uv = a_unit;
    gl_Position = vec4(a_unit * 2.0 - 1.0, 0.0, 1.0);
}
`;

const GLITCH = `
precision highp float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform sampler2D u_shadow;
uniform vec2 u_spread;
uniform float u_time;
uniform float u_amount;
uniform float u_swap;
uniform float u_seed;
uniform float u_shade;
varying vec2 v_uv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float hash1(float x) {
    return hash(vec2(x, 17.31));
}

vec4 avatar(vec2 p, float swapped) {
    vec3 color = mix(texture2D(u_from, p).rgb, texture2D(u_to, p).rgb, swapped);
    float inside = 1.0 - smoothstep(0.497, 0.5, length(p - 0.5));
    return vec4(color * inside, inside);
}

void main() {
    float a = u_amount;
    vec2 p = (v_uv - 0.5) * u_spread + 0.5;

    float tearSlot = floor(u_time * 14.0) + u_seed;
    float row = floor(p.y * mix(3.0, 12.0, hash1(tearSlot)));
    float torn = step(1.0 - a * 0.6, hash(vec2(row, tearSlot + 1.0)));
    p.x += torn * (hash(vec2(row, tearSlot + 2.0)) - 0.5) * ${TEAR} * a;

    float fineSlot = floor(u_time * 30.0) + u_seed;
    float fineRow = floor(p.y * mix(12.0, 24.0, hash1(fineSlot)));
    float fine = step(1.0 - a * 0.4, hash(vec2(fineRow, fineSlot + 1.0)));
    p.x += fine * (hash(vec2(fineRow, fineSlot + 2.0)) - 0.5) * ${FINE} * a;

    float swapped = step(hash1(floor(p.y * 12.0) + u_seed), u_swap);
    vec2 split = vec2(torn * ${SPLIT} * hash(vec2(row, tearSlot + 3.0)) * a, 0.0);
    vec3 offsets = mod(vec3(0.0, 1.0, 2.0) + floor(hash(vec2(row, tearSlot + 4.0)) * 3.0), 3.0) - 1.0;

    vec4 cyan = avatar(p + split * offsets.x, swapped);
    vec4 magenta = avatar(p + split * offsets.y, swapped);
    vec4 yellow = avatar(p + split * offsets.z, swapped);
    vec3 sum = vec3(magenta.r + yellow.r, cyan.g + yellow.g, cyan.b + magenta.b);
    vec3 weight = vec3(magenta.a + yellow.a, cyan.a + yellow.a, cyan.a + magenta.a);
    float alpha = max(max(cyan.a, magenta.a), yellow.a);
    vec4 color = vec4(sum / max(weight, 1e-5) * alpha, alpha);

    float shadow = u_shade > 0.0 ? u_shade * texture2D(u_shadow, v_uv).a : 0.0;
    gl_FragColor = color + (1.0 - color.a) * vec4(0.0, 0.0, 0.0, shadow);
}
`;

const BLUR = `
precision highp float;
uniform sampler2D u_shadow;
uniform vec2 u_step;
varying vec2 v_uv;

void main() {
    float sum = 0.0;
    float total = 0.0;
    for (int i = -${SHADOW_SIGMA * 3}; i <= ${SHADOW_SIGMA * 3}; i++) {
        float weight = exp(-float(i * i) / ${2 * SHADOW_SIGMA ** 2}.0);
        sum += weight * texture2D(u_shadow, v_uv + float(i) * u_step).a;
        total += weight;
    }
    gl_FragColor = vec4(0.0, 0.0, 0.0, sum / total);
}
`;

const picture = document.getElementById('userpic');
const userpics = [...document.querySelectorAll('link[data-alt]')];
const canvas = document.createElement('canvas');
canvas.className = 'glitch';
canvas.hidden = true;
picture.after(canvas);

const frame = () => new Promise(requestAnimationFrame);
const instant = () => {};

function createGlitch() {
    const gl = canvas.getContext('webgl');
    if (!gl) return instant;

    const link = fragment => {
        const program = gl.createProgram();
        for (const [type, code] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, fragment]]) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, code);
            gl.compileShader(shader);
            gl.attachShader(program, shader);
        }
        gl.bindAttribLocation(program, 0, 'a_unit');
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
        const uniforms = {};
        for (let i = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS); i--;) {
            const {name} = gl.getActiveUniform(program, i);
            uniforms[name] = gl.getUniformLocation(program, name);
        }
        return {program, uniforms};
    };
    const scene = link(GLITCH);
    const blur = link(BLUR);
    if (!scene || !blur) return instant;

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const texture = () => {
        const result = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, result);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        return result;
    };
    const target = () => {
        const result = {texture: texture(), framebuffer: gl.createFramebuffer()};
        gl.bindFramebuffer(gl.FRAMEBUFFER, result.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, result.texture, 0);
        return result;
    };
    const images = [texture(), texture()];
    const shadow = target();
    const scratch = target();

    gl.useProgram(scene.program);
    gl.uniform1i(scene.uniforms.u_from, 0);
    gl.uniform1i(scene.uniforms.u_to, 1);
    gl.uniform1i(scene.uniforms.u_shadow, 2);
    gl.useProgram(blur.program);
    gl.uniform1i(blur.uniforms.u_shadow, 2);

    const upload = (unit, image) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, images[unit]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    };
    const pass = (source, destination, width, height) => {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, source.texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, destination ? destination.framebuffer : null);
        gl.viewport(0, 0, width, height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    return async image => {
        const box = picture.getBoundingClientRect();
        const style = getComputedStyle(picture);
        const radius = parseFloat(style.getPropertyValue('--shadow-blur'));
        const shade = parseFloat(style.getPropertyValue('--shadow-alpha'));
        const margin = 1.5 * radius;
        const width = box.width * (1 + 2 * MAX_SHIFT) + 2 * margin;
        const height = box.height + 2 * margin;
        const scale = Math.min(devicePixelRatio, picture.naturalWidth / box.width);
        Object.assign(canvas.style, {
            left: `${box.left - (width - box.width) / 2}px`,
            top: `${box.top - (height - box.height) / 2}px`,
            width: `${width}px`,
            height: `${height}px`
        });
        canvas.width = width * scale;
        canvas.height = height * scale;

        const shadowScale = 2 * SHADOW_SIGMA / radius;
        const [shadowWidth, shadowHeight] = [Math.ceil(width * shadowScale), Math.ceil(height * shadowScale)];
        for (const {texture} of [shadow, scratch]) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, shadowWidth, shadowHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        upload(0, picture);
        upload(1, image);

        gl.useProgram(scene.program);
        gl.uniform2f(scene.uniforms.u_spread, width / box.width, height / box.height);
        gl.uniform1f(scene.uniforms.u_seed, Math.random() * 1000);

        const draw = (time, amount, swap) => {
            gl.useProgram(scene.program);
            gl.uniform1f(scene.uniforms.u_time, time);
            gl.uniform1f(scene.uniforms.u_amount, amount);
            gl.uniform1f(scene.uniforms.u_swap, swap);
            gl.uniform1f(scene.uniforms.u_shade, 0);
            pass(scratch, shadow, shadowWidth, shadowHeight);

            gl.useProgram(blur.program);
            gl.uniform2f(blur.uniforms.u_step, 1 / shadowWidth, 0);
            pass(shadow, scratch, shadowWidth, shadowHeight);
            gl.uniform2f(blur.uniforms.u_step, 0, 1 / shadowHeight);
            pass(scratch, shadow, shadowWidth, shadowHeight);

            gl.useProgram(scene.program);
            gl.uniform1f(scene.uniforms.u_shade, shade);
            pass(shadow, null, gl.drawingBufferWidth, gl.drawingBufferHeight);
        };


        const start = await frame();
        for (let now = await frame(); now - start < DURATION_MS && !gl.isContextLost(); now = await frame()) {
            const t = (now - start) / DURATION_MS;
            const swap = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
            draw((now - start) / 1000, Math.sin(Math.PI * t) ** 0.7, swap * swap * (3 - 2 * swap));
            canvas.hidden = false;
            picture.style.visibility = 'hidden';
        }
    };
}

let glitch;
let busy = false;

canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    glitch = instant;
});
canvas.addEventListener('webglcontextrestored', () => {
    glitch = undefined;
});

picture.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    const next = userpics.find(link => link.href !== picture.src);
    const image = new Image();
    image.src = next.href;
    try {
        await image.decode();
        const play = matchMedia('(prefers-reduced-motion: reduce)').matches ? instant : (glitch ??= createGlitch());
        await play(image);
        Object.assign(picture, {src: next.href, alt: next.dataset.alt});
    } finally {
        canvas.hidden = true;
        picture.style.visibility = '';
        busy = false;
    }
});
