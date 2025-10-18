import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class EscalaFormComponent {
  @Input() campos: EscalaCampo[] = [];
  @Input() dias: any[] = [];
  @Input() mesAno: string = '';
  @Output() diasChange = new EventEmitter<any[]>();
  @Output() mesAnoChange = new EventEmitter<string>();

  adicionarDia() {
    const novoDia: any = { dia: '' };
    this.campos.forEach(campo => {
      novoDia[campo.label] = campo.listaMultipla ? [] : '';
    });
    this.dias.push(novoDia);
    this.diasChange.emit(this.dias);
  }

  removerDia(index: number) {
    this.dias.splice(index, 1);
    this.diasChange.emit(this.dias);
  }

  gerarDomingos() {
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
  }

  removerSelecionado(label: string, diaIndex: number, itemIndex: number) {
    this.dias[diaIndex][label].splice(itemIndex, 1);
    this.diasChange.emit(this.dias);
  }

  adicionarSelecionado(label: string, diaIndex: number, nome: string) {
    if (!this.dias[diaIndex][label].includes(nome)) {
      this.dias[diaIndex][label].push(nome);
      this.diasChange.emit(this.dias);
    }
  }

  setUnico(label: string, diaIndex: number, nome: string) {
    this.dias[diaIndex][label] = nome;
    this.diasChange.emit(this.dias);
  }
}
