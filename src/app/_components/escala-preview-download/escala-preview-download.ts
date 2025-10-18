import { Component, Input } from '@angular/core';
import { EscalaCampo } from '../../interfaces/escala-campo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-escala-preview-download',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './escala-preview-download.html',
  styleUrls: ['./escala-preview-download.css']
})
export class EscalaPreviewDownloadComponent {
  @Input() dias: any[] = [];
  @Input() mesAno: string = '';
  @Input() titulo: string = 'Escala de Louvor';
  @Input() campos: EscalaCampo[] = [];

async gerarImagem() {
  const html2canvas = (await import('html2canvas')).default;

  // elemento responsivo visível
  const visible = document.getElementById('preview-escala-visible');
  if (!visible) return;

  // cria um wrapper offscreen para exportação
  const off = document.createElement('div');
  off.className = 'export-square-offscreen';
  // define estilos inline para garantir comportamento consistente
  off.style.width = '1080px';
  off.style.height = '1080px';
  off.style.position = 'fixed';
  off.style.left = '-9999px';
  off.style.top = '0';
  off.style.padding = '90px'; // área segura
  off.style.boxSizing = 'border-box';
  off.style.background = '#ffffff';
  off.style.display = 'flex';
  off.style.alignItems = 'center';
  off.style.justifyContent = 'center';
  off.style.zIndex = '9999';

  // cria container interno e copia o conteúdo do preview visível
  const inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.maxWidth = '900px';
  inner.style.boxSizing = 'border-box';
  // copia apenas o innerHTML (mantém texto/estrutura)
  inner.innerHTML = visible.innerHTML;

  // Se você usa classes CSS específicas no preview e quer que sejam aplicadas,
  // garanta que essas regras existam globalmente (não dependam de media queries)
  off.appendChild(inner);
  document.body.appendChild(off);

  // dá um pequeno delay para que fontes externas/carregamentos finalizem
  await new Promise(r => setTimeout(r, 120));

  const scale = (window.devicePixelRatio && window.devicePixelRatio > 1) ? window.devicePixelRatio : 2;

  try {
    const canvas = await html2canvas(off, {
      width: 1080,
      height: 1080,
      scale,
      useCORS: true,
      backgroundColor: '#ffffff' // define branco; ou use null se quiser transparência
    });

    // opcional: gerar PNG com máscara circular (com transparência nos cantos)
    // se quiser, descomente e use finalCanvas como fonte do dataUrl
    /*
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 1080;
    finalCanvas.height = 1080;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0,0,1080,1080);
      ctx.save();
      ctx.beginPath();
      ctx.arc(540,540,540,0,Math.PI*2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
    const dataUrl = finalCanvas.toDataURL('image/png');
    */

    const dataUrl = canvas.toDataURL('image/png');

    // forçar download
    const a = document.createElement('a');
    const fileName = this.titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    a.download = `${fileName}-${this.mesAno || ''}.png`;
    a.href = dataUrl;
    a.click();
  } catch (err) {
    console.error('Erro ao gerar imagem:', err);
  } finally {
    // limpa o offscreen
    document.body.removeChild(off);
  }
}



  baixarImagem() {
    this.gerarImagem();
  }
}
