import { useCallback, useEffect, useRef } from 'react';

/**
 * Paletas de pixel por variante. Cada card sorteia pixels dessas cores
 * para compor o efeito de "shimmer" em pixels no hover/foco.
 */
const VARIANTES = {
  padrao: ['#46178f', '#1368ce', '#e7defb'],
  dourado: ['#ffd76a', '#ffa602', '#fff3d6'],
  clara: ['#ffffff', '#ffffff', '#f2edfb'],
  sucesso: ['#26890c', '#7bd65c', '#eafbe2'],
  erro: ['#e21b3c', '#ff8fa3', '#ffe1e6']
};

const reduzirMovimento =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

class Pixel {
  constructor(ctx, x, y, cor, velocidade, atraso) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.cor = cor;
    this.velocidadeBase = Math.max(velocidade, 8) * 0.001;
    this.tamanho = 0;
    this.tamanhoMaximo = 2.6;
    this.contador = 0;
    this.contadorPasso = Math.random() * 3 + 2;
    this.atraso = atraso;
    this.crescendo = true;
  }

  desenhar() {
    if (this.tamanho <= 0) return;
    const deslocamento = (this.tamanhoMaximo - this.tamanho) * 0.5;
    this.ctx.fillStyle = this.cor;
    this.ctx.fillRect(this.x + deslocamento, this.y + deslocamento, this.tamanho, this.tamanho);
  }

  aparecer() {
    if (this.contador <= this.atraso) {
      this.contador += this.contadorPasso;
      return true;
    }
    if (this.tamanho >= this.tamanhoMaximo) this.crescendo = false;
    this.tamanho += this.crescendo ? this.velocidadeBase * 16 : -this.velocidadeBase * 6;
    this.tamanho = Math.min(Math.max(this.tamanho, 0), this.tamanhoMaximo);
    this.desenhar();
    return this.tamanho < this.tamanhoMaximo || this.crescendo;
  }

  desaparecer() {
    this.tamanho -= this.velocidadeBase * 10;
    this.tamanho = Math.max(this.tamanho, 0);
    this.crescendo = true;
    this.contador = 0;
    this.desenhar();
    return this.tamanho > 0;
  }
}

/**
 * Card com efeito de pixels animados no hover/foco (canvas), inspirado no
 * componente "Pixel Card" da reactbits.dev. Pode renderizar como div ou
 * como button (prop `as`), preservando todos os atributos do elemento.
 */
export default function PixelCard({
  as: Elemento = 'div',
  variante = 'padrao',
  gap = 7,
  velocidade = 45,
  semFoco = false,
  className = '',
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...restante
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const pixelsRef = useRef([]);
  const quadroRef = useRef(0);

  const cores = VARIANTES[variante] || VARIANTES.padrao;

  const montarGrade = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const proporcao = window.devicePixelRatio || 1;
    const largura = Math.max(Math.floor(container.offsetWidth), 1);
    const altura = Math.max(Math.floor(container.offsetHeight), 1);

    canvas.width = largura * proporcao;
    canvas.height = altura * proporcao;
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;

    const ctx = canvas.getContext('2d');
    ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);

    const pixels = [];
    for (let y = 0; y < altura; y += gap) {
      for (let x = 0; x < largura; x += gap) {
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const distanciaCentro = Math.hypot(x - largura / 2, y - altura / 2);
        pixels.push(new Pixel(ctx, x, y, cor, velocidade, distanciaCentro * 0.35));
      }
    }
    pixelsRef.current = pixels;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gap, velocidade, variante]);

  useEffect(() => {
    montarGrade();
    const observer = new ResizeObserver(() => montarGrade());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(quadroRef.current);
    };
  }, [montarGrade]);

  const animar = useCallback((modo) => {
    cancelAnimationFrame(quadroRef.current);
    if (reduzirMovimento) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const passo = () => {
      const proporcao = window.devicePixelRatio || 1;
      ctx.clearRect(0, 0, canvas.width / proporcao, canvas.height / proporcao);

      let algumAtivo = false;
      pixelsRef.current.forEach((pixel) => {
        const ativo = modo === 'aparecer' ? pixel.aparecer() : pixel.desaparecer();
        if (ativo) algumAtivo = true;
      });

      if (algumAtivo) {
        quadroRef.current = requestAnimationFrame(passo);
      }
    };
    passo();
  }, []);

  function lidarComEntrada(evento) {
    animar('aparecer');
    onMouseEnter?.(evento);
  }
  function lidarComSaida(evento) {
    animar('desaparecer');
    onMouseLeave?.(evento);
  }
  function lidarComFoco(evento) {
    if (!semFoco) animar('aparecer');
    onFocus?.(evento);
  }
  function lidarComDesfoco(evento) {
    if (!semFoco) animar('desaparecer');
    onBlur?.(evento);
  }

  return (
    <Elemento
      ref={containerRef}
      className={`cartao-pixel ${className}`}
      onMouseEnter={lidarComEntrada}
      onMouseLeave={lidarComSaida}
      onFocus={lidarComFoco}
      onBlur={lidarComDesfoco}
      {...restante}
    >
      <canvas ref={canvasRef} className="cartao-pixel__canvas" aria-hidden="true" />
      {children}
    </Elemento>
  );
}
