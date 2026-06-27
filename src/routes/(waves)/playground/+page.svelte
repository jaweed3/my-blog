<script lang="ts">
  import { title } from '$lib/data/meta';

  type QuantLevel = 'fp32' | 'fp16' | 'int8' | 'ternary';
  type ModelKey = 'yolov8n' | 'mobilenetv2' | 'bert-tiny' | 'resnet50';

  const DATA = {
    yolov8n: {
      name: 'YOLOv8n', task: 'Object Detection',
      fp32: { size: '12.7 MB', speed: '1.0x', mem: '1.8 GB', acc: 'Baseline', raw: 12.7, speedNum: 1.0, delta: '---' },
      fp16: { size: '6.4 MB', speed: '1.8x', mem: '920 MB', acc: '99.7%', raw: 6.4, speedNum: 1.8, delta: '-0.3%' },
      int8: { size: '3.2 MB', speed: '3.5x', mem: '460 MB', acc: '98.8%', raw: 3.2, speedNum: 3.5, delta: '-1.2%' },
      ternary: { size: '1.1 MB', speed: '5.2x', mem: '180 MB', acc: '96.5%', raw: 1.1, speedNum: 5.2, delta: '-3.5%' },
      devices: [
        { name: 'ESP32-S3', sup: ['fp16','int8','ternary'] },
        { name: 'Jetson Nano', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Apple M1', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Raspberry Pi 5', sup: ['fp32','fp16','int8'] },
        { name: 'Intel NUC', sup: ['fp32','fp16','int8','ternary'] },
      ],
    },
    mobilenetv2: {
      name: 'MobileNetV2', task: 'Classification',
      fp32: { size: '14.0 MB', speed: '1.0x', mem: '800 MB', acc: 'Baseline', raw: 14.0, speedNum: 1.0, delta: '---' },
      fp16: { size: '7.0 MB', speed: '2.1x', mem: '410 MB', acc: '99.9%', raw: 7.0, speedNum: 2.1, delta: '-0.1%' },
      int8: { size: '3.6 MB', speed: '3.8x', mem: '210 MB', acc: '99.2%', raw: 3.6, speedNum: 3.8, delta: '-0.8%' },
      ternary: { size: '1.3 MB', speed: '6.0x', mem: '85 MB', acc: '97.2%', raw: 1.3, speedNum: 6.0, delta: '-2.8%' },
      devices: [
        { name: 'ESP32-S3', sup: ['fp16','int8','ternary'] },
        { name: 'Jetson Nano', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Apple M1', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Raspberry Pi 5', sup: ['fp32','fp16','int8'] },
        { name: 'Intel NUC', sup: ['fp32','fp16','int8','ternary'] },
      ],
    },
    'bert-tiny': {
      name: 'BERT-tiny', task: 'NLP',
      fp32: { size: '57.0 MB', speed: '1.0x', mem: '2.4 GB', acc: 'Baseline', raw: 57.0, speedNum: 1.0, delta: '---' },
      fp16: { size: '28.5 MB', speed: '1.6x', mem: '1.2 GB', acc: '99.5%', raw: 28.5, speedNum: 1.6, delta: '-0.5%' },
      int8: { size: '14.3 MB', speed: '2.8x', mem: '610 MB', acc: '98.2%', raw: 14.3, speedNum: 2.8, delta: '-1.8%' },
      ternary: { size: '4.8 MB', speed: '4.0x', mem: '240 MB', acc: '95.8%', raw: 4.8, speedNum: 4.0, delta: '-4.2%' },
      devices: [
        { name: 'ESP32-S3', sup: ['int8','ternary'] },
        { name: 'Jetson Nano', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Apple M1', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Raspberry Pi 5', sup: ['fp32','fp16','int8'] },
        { name: 'Intel NUC', sup: ['fp32','fp16','int8','ternary'] },
      ],
    },
    resnet50: {
      name: 'ResNet50', task: 'Classification',
      fp32: { size: '98.0 MB', speed: '1.0x', mem: '3.2 GB', acc: 'Baseline', raw: 98.0, speedNum: 1.0, delta: '---' },
      fp16: { size: '49.0 MB', speed: '1.7x', mem: '1.6 GB', acc: '99.6%', raw: 49.0, speedNum: 1.7, delta: '-0.4%' },
      int8: { size: '24.5 MB', speed: '3.2x', mem: '820 MB', acc: '98.5%', raw: 24.5, speedNum: 3.2, delta: '-1.5%' },
      ternary: { size: '8.2 MB', speed: '4.8x', mem: '320 MB', acc: '96.2%', raw: 8.2, speedNum: 4.8, delta: '-3.8%' },
      devices: [
        { name: 'ESP32-S3', sup: ['int8','ternary'] },
        { name: 'Jetson Nano', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Apple M1', sup: ['fp32','fp16','int8','ternary'] },
        { name: 'Raspberry Pi 5', sup: ['fp32','fp16','int8'] },
        { name: 'Intel NUC', sup: ['fp32','fp16','int8','ternary'] },
      ],
    },
  };

  const levels = ['fp32', 'fp16', 'int8', 'ternary'] as QuantLevel[];
  const modelKeys = ['yolov8n', 'mobilenetv2', 'bert-tiny', 'resnet50'] as ModelKey[];

  let selected = 'yolov8n';
  let quant = 'int8';

  let model = DATA.yolov8n;
  let quantData = DATA.yolov8n.fp32;
  let maxRaw = 12.7;
  $: model = DATA[selected as ModelKey] || DATA.yolov8n;
  $: quantData = model[quant as QuantLevel] || model.fp32;
  $: maxRaw = Math.max(...levels.map(l => model[l].raw));
</script>

<svelte:head>
  <title>Playground - {title}</title>
</svelte:head>

<section class="playground-hero">
  <span class="hero-badge">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    EXPERIMENTAL_LAB_v2.4
  </span>
  <h1 class="hero-title">Quantization Sandbox</h1>
  <p class="hero-desc">Compare model size, speed, memory, and accuracy trade-offs across quantization levels in real-time.</p>
</section>

<div class="playground-content">
  <div class="section-label">Model</div>
  <div class="model-selector">
    {#each modelKeys as key}
      <button class="model-chip" class:active={selected === key} on:click={() => selected = key}>
        <span class="model-name">{DATA[key].name}</span>
        <span class="model-task">{DATA[key].task}</span>
      </button>
    {/each}
  </div>

  <div class="section-label">Quantization Method</div>
  <div class="quant-selector">
    {#each levels as level}
      <button class="quant-chip" class:active={quant === level} on:click={() => quant = level}>
        {level === 'fp32' ? 'FP32' : level === 'fp16' ? 'FP16' : level === 'int8' ? 'INT8' : 'Ternary 1.58'}
      </button>
    {/each}
  </div>

  <div class="metrics-grid">
    <div class="metric-card">
      <span class="metric-label">Model Size</span>
      <span class="metric-value">{quantData.size}</span>
      <span class="metric-delta" class:positive={quantData.raw < model.fp32.raw}>
        {quantData.raw < model.fp32.raw ? '-' + Math.round((1 - quantData.raw / model.fp32.raw) * 100) + '%' : 'baseline'}
      </span>
    </div>
    <div class="metric-card">
      <span class="metric-label">Inference Speed</span>
      <span class="metric-value">{quantData.speed}</span>
      <span class="metric-delta positive">{quantData.speedNum > 1 ? '+' + Math.round((quantData.speedNum - 1) * 100) + '%' : 'baseline'}</span>
    </div>
    <div class="metric-card">
      <span class="metric-label">Peak Memory</span>
      <span class="metric-value">{quantData.mem}</span>
    </div>
    <div class="metric-card">
      <span class="metric-label">Relative Accuracy</span>
      <span class="metric-value">{quantData.acc}</span>
      <span class="metric-delta neutral">{quantData.delta}</span>
    </div>
  </div>

  <div class="section-label">Size Comparison</div>
  <div class="bars">
    {#each levels as level}
      <div class="bar-row" class:selected={quant === level}>
        <span class="bar-label">{level === 'fp32' ? 'FP32' : level === 'fp16' ? 'FP16' : level === 'int8' ? 'INT8' : 'Ternary 1.58'}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: {model[level].raw / maxRaw * 100}%" class:active={quant === level}></div>
        </div>
        <span class="bar-value">{model[level].size}</span>
      </div>
    {/each}
  </div>

  <div class="section-label">Edge Device Compatibility</div>
  <div class="device-grid">
    {#each model.devices as device}
      <div class="device-row">
        <span class="device-name">{device.name}</span>
        <div class="device-dots">
          {#each levels as level}
            <span class="device-dot" class:supported={device.sup.indexOf(level) >= 0}></span>
          {/each}
        </div>
        <span class="device-count">{device.sup.length} of {levels.length}</span>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .playground-hero {
    padding: 128px var(--margin-mobile) 48px;
    max-width: var(--container-max);
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 128px var(--margin-desktop) 48px;
    }

    .hero-badge {
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1;
      letter-spacing: 0.1em;
      color: var(--accent-2);
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;

      svg { width: 18px; height: 18px; }
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      color: var(--text);
      margin: 0 0 12px;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .hero-desc {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      line-height: 1.6;
      color: var(--text-variant);
      margin: 0;
      max-width: 560px;
    }
  }

  .playground-content {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--margin-mobile) 96px;

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop) 96px;
    }
  }

  .section-label {
    font-family: var(--font-mono);
    font-size: var(--caption);
    line-height: 1.4;
    color: var(--accent-2);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 12px;
  }

  .model-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 32px;
  }

  .model-chip {
    padding: 12px 20px;
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;

    &:hover { border-color: var(--accent-2); }
    &.active { border-color: var(--accent-2); background: rgba(0, 238, 252, 0.05); }

    .model-name {
      display: block;
      font-family: var(--font-display);
      font-size: var(--body-md);
      font-weight: 500;
      line-height: 1.5;
      color: var(--text);
    }

    .model-task {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }
  }

  .quant-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 32px;
  }

  .quant-chip {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-variant);
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    line-height: 1;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;

    &:hover { border-color: var(--accent-2); color: var(--accent-2); }
    &.active { background: var(--accent-2); color: var(--bg); border-color: var(--accent-2); }
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gutter);
    margin-bottom: 48px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .metric-card {
    padding: 24px;
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    text-align: center;
    transition: border-color 0.3s;

    .metric-label {
      display: block;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 12px;
    }

    .metric-value {
      display: block;
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text);
      margin-bottom: 8px;
    }

    .metric-delta {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      letter-spacing: 0.05em;

      color: var(--muted);
      &.positive { color: var(--accent-2); }
      &.neutral { color: var(--accent-3); }
    }
  }

  .bars {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 48px;
  }

  .bar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    transition: opacity 0.2s;

    &.selected { opacity: 1; }
    &:not(.selected) { opacity: 0.5; }

    .bar-label {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-variant);
      min-width: 80px;
      flex-shrink: 0;
    }

    .bar-track {
      flex: 1;
      height: 24px;
      background: var(--surface-container);
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: var(--primary-container);
      border-radius: 4px;
      transition: width 0.3s ease;

      &.active { background: var(--accent-2); }
    }

    .bar-value {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      color: var(--muted);
      min-width: 60px;
      text-align: right;
      flex-shrink: 0;
    }
  }

  .device-grid {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .device-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;

    .device-name {
      font-family: var(--font-body);
      font-size: var(--body-md);
      font-weight: 500;
      line-height: 1.5;
      color: var(--text);
      min-width: 120px;
    }

    .device-dots {
      display: flex;
      gap: 8px;
    }

    .device-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--surface-container-highest);
      border: 1px solid var(--outline-variant);
      transition: all 0.2s;

      &.supported { background: var(--accent-2); border-color: var(--accent-2); box-shadow: 0 0 6px rgba(0, 238, 252, 0.3); }
    }

    .device-count {
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      color: var(--muted);
      flex-shrink: 0;
    }
  }
</style>