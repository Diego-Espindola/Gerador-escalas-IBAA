import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EscalaFormComponent } from '../../_components/escala-form/escala-form';
import { EscalaPreviewDownloadComponent } from '../../_components/escala-preview-download/escala-preview-download';

@Component({
  selector: 'app-escala-louvor',
  standalone: true,
  imports: [CommonModule, FormsModule, EscalaFormComponent, EscalaPreviewDownloadComponent],
  templateUrl: './escala-louvor.html',
  styleUrls: ['./escala-louvor.css']
})
export class EscalaLouvorPage {

  mesAno: string = '';
  listaVocal: string[] = ['Rosana', 'Bruna', 'Carol', 'Rosângela', 'Brenda', 'Ana', 'Bianca', 'Helena', 'Raquel', 'Mara', 'Luis'];
  listaMinistro: string[] = ['Fernando', 'Diego', 'Ana', 'Helena'];
  listaMusicos: string[] = ['Diego', 'Fernando', 'Jonathan', 'Marcos', 'Lidiane', 'Cristian', 'Luis'];
  dias: Array<any> = [];
  campos = [
    { label: 'Vocal', listaMultipla: true, lista: this.listaVocal },
    { label: 'Ministro', listaMultipla: false, lista: this.listaMinistro },
    { label: 'Músicos', listaMultipla: true, lista: this.listaMusicos }
  ];

  adicionarDia() {
    this.dias.push({ dia: '', vocal: [], ministro: '', musicos: [] });
  }

  removerDia(index: number) {
    this.dias.splice(index, 1);
  }

  gerarDomingos() {
    this.dias = [];
    if (!this.mesAno) return;
    const [ano, mes] = this.mesAno.split('-').map(Number);
    const date = new Date(ano, mes - 1, 1);
    while (date.getMonth() === mes - 1) {
      if (date.getDay() === 0) { // Domingo
        const diaFormatado = date.toLocaleDateString('pt-BR');
        this.dias.push({ dia: diaFormatado, vocal: [], ministro: '', musicos: [] });
      }
      date.setDate(date.getDate() + 1);
    }
  }

  removerSelecionado(tipo: 'vocal' | 'musicos', diaIndex: number, itemIndex: number) {
    this.dias[diaIndex][tipo].splice(itemIndex, 1);
  }

  adicionarSelecionado(tipo: 'vocal' | 'musicos', diaIndex: number, nome: string) {
    if (!this.dias[diaIndex][tipo].includes(nome)) {
      this.dias[diaIndex][tipo].push(nome);
    }
  }

  setMinistro(diaIndex: number, nome: string) {
    this.dias[diaIndex].ministro = nome;
  }

  async gerarImagem() {
    const html2canvas = (await import('html2canvas')).default;
    const escalaElement = document.getElementById('preview-escala');
    if (escalaElement) {
      html2canvas(escalaElement).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `escala-louvor-${this.mesAno}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }
}
