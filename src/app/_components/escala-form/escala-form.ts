import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { EscalaCampo } from '../../interfaces/escala-campo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-escala-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './escala-form.html',
  styleUrls: ['./escala-form.css']
})
export class EscalaFormComponent implements OnInit {
  @Input() campos: EscalaCampo[] = [];
  @Input() dias: any[] = [];
  @Input() mesAno: string = '';
  @Input({ required: true }) tipoEscala!: string;
  @Output() diasChange = new EventEmitter<any[]>();
  @Output() mesAnoChange = new EventEmitter<string>();

  ngOnInit() {
  }

  adicionarDia() {
    const novoDia: any = { dia: '' };
    this.campos.forEach(campo => {
      novoDia[campo.label] = campo.listaMultipla ? [] : '';
    });
    this.dias.push(novoDia);
    this.diasChange.emit(this.dias);
    this.salvarNoLocalStorage();
  }

  removerDia(index: number) {
    this.dias.splice(index, 1);
    this.diasChange.emit(this.dias);
    this.salvarNoLocalStorage();
  }

  gerarDomingos() {
    const buscaLocal = this.carregarDoLocalStorage();
    if(buscaLocal){return};
    this.dias = [];
    if (!this.mesAno) return;
    const [ano, mes] = this.mesAno.split('-').map(Number);
    const date = new Date(ano, mes - 1, 1);
    while (date.getMonth() === mes - 1) {
      if (date.getDay() === 0) {
        const diaFormatado = date.toLocaleDateString('pt-BR');
        const novoDia: any = { dia: diaFormatado };
        this.campos.forEach(campo => {
          novoDia[campo.label] = campo.listaMultipla ? [] : '';
        });
        this.dias.push(novoDia);
      }
      date.setDate(date.getDate() + 1);
    }
    this.diasChange.emit(this.dias);
    this.salvarNoLocalStorage();
  }

  removerSelecionado(label: string, diaIndex: number, itemIndex: number) {
    this.dias[diaIndex][label].splice(itemIndex, 1);
    this.diasChange.emit(this.dias);
    this.salvarNoLocalStorage();
  }

  adicionarSelecionado(label: string, diaIndex: number, nome: string) {
    if (!this.dias[diaIndex][label].includes(nome)) {
      this.dias[diaIndex][label].push(nome);
      this.diasChange.emit(this.dias);
      this.salvarNoLocalStorage();
    }
  }

  setUnico(label: string, diaIndex: number, nome: string) {
    this.dias[diaIndex][label] = nome;
    this.diasChange.emit(this.dias);
    this.salvarNoLocalStorage();
  }

  private obterDadosDoLocalStorage(chave: string) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : null;
  }

  salvarNoLocalStorage() {
    const chave = `${this.tipoEscala}-escala-${this.mesAno}`; // Include tipoEscala in the key
    const dadosParaSalvar = {
      dias: this.dias,
      selecoes: this.campos.map(campo => ({
        label: campo.label,
        listaMultipla: campo.listaMultipla
      }))
    };
    localStorage.setItem(chave, JSON.stringify(dadosParaSalvar));
  }

  carregarDoLocalStorage() {
    const chave = `${this.tipoEscala}-escala-${this.mesAno}`; // Include tipoEscala in the key
    const dadosSalvos = localStorage.getItem(chave);
    if (dadosSalvos) {
      const dados = JSON.parse(dadosSalvos);
      this.dias = dados.dias || this.dias; // Retain existing data if no dias are found
      this.campos.forEach(campo => {
        const selecao = dados.selecoes?.find((s: any) => s.label === campo.label);
        if (selecao) {
          campo.listaMultipla = selecao.listaMultipla;
        }
      });
    }
    this.diasChange.emit(this.dias);
    return !!dadosSalvos;
  }

  carregarDados(chave: string) {
    const dados = this.obterDadosDoLocalStorage(chave);
    if (dados) {
      this.dias = dados.dias || [];
      this.mesAno = dados.mesAno || '';
      this.diasChange.emit(this.dias);
      this.mesAnoChange.emit(this.mesAno);
    }
  }

  recriarDomingos() {
    const chave = `${this.tipoEscala}-escala-${this.mesAno}`; // Include tipoEscala in the key
    localStorage.removeItem(chave); // Clear local storage for the specific month
    this.gerarDomingos(); // Regenerate domingos
  }
}
