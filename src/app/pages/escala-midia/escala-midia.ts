import { Component } from '@angular/core';
import { EscalaCampo } from '../../interfaces/escala-campo';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EscalaFormComponent } from '../../_components/escala-form/escala-form';
import { EscalaPreviewDownloadComponent } from '../../_components/escala-preview-download/escala-preview-download';

@Component({
  selector: 'app-escala-midia',
  standalone: true,
  imports: [CommonModule, FormsModule, EscalaFormComponent, EscalaPreviewDownloadComponent],
  templateUrl: './escala-midia.html',
  styleUrls: ['./escala-midia.css']
})

export class EscalaMidiaPage {
  mesAno: string = '';
  dias: Array<any> = [];
  listaMidianitas : string[] = ['Fernando', 'Carol', 'Rafaela', 'Jonathan', 'Brenda', 'Paola', 'Marcos', 'Diego'];
  campos: EscalaCampo[] = [
    { label: 'Fotos e Postagens', listaMultipla: true, lista: this.listaMidianitas },
    { label: 'Datashow', listaMultipla: true, lista: this.listaMidianitas }
  ];
}
