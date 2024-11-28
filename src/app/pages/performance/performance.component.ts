import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectOption } from 'src/app/components/input-select/input-select.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { DesempenhoMensal } from 'src/app/models/Desempenho';
import { ClienteService } from 'src/app/services/cliente.service';
import { DesempenhoService } from 'src/app/services/desempenho.service';
import { FlagService } from 'src/app/services/flag.service';
import { TierService } from 'src/app/services/tier.service';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent implements OnInit {
  @ViewChild('modalDesempenho') modalDesempenho: ModalComponent;
  @ViewChild('modalEdit') modalEdit: ModalComponent;

  rows: DesempenhoMensal[] = [];
  temp: DesempenhoMensal[] = [];
  tiers: SelectOption[] = [];
  flags: SelectOption[] = [];
  clientes: SelectOption[] = [];
  loading: boolean = true;
  validateOnSubmit: boolean = false;
  currentId: number = 0;
  formEdit: FormGroup;
  formPerf: FormGroup;
  constructor(
    private desempenhoServ: DesempenhoService,
    private tierServ: TierService,
    private clienteServ: ClienteService,
    private flagServ: FlagService,
    private formBuilder: FormBuilder,
  ) {
    this.formPerf = this.formBuilder.group({
      clienteId: ['', Validators.required],
      status: ['', Validators.required],
      data: ['', Validators.required],
      tierId: ['', Validators.required],
      flagId: ['', Validators.required],
      honorario: ['', Validators.required],
      investidoEsteMes: ['', Validators.required],
      vendasMetaAds: ['', Validators.required],
      vendasGoogleAds: ['', Validators.required],
      valorDeVendas: ['', Validators.required]
    });
    this.formEdit = this.formBuilder.group({
      id: [''],
      clienteId: ['', Validators.required],
      status: ['', Validators.required],
      data: ['', Validators.required],
      tierId: ['', Validators.required],
      flagId: ['', Validators.required],
      honorario: ['', Validators.required],
      investidoEsteMes: ['', Validators.required],
      vendasMetaAds: ['', Validators.required],
      vendasGoogleAds: ['', Validators.required],
      valorDeVendas: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDesempenhos();
    this.loadTiers();
    this.loadFlags()
    this.loadClientes();
  }

  loadDesempenhos() {
    this.loading = true;
    this.desempenhoServ.list().subscribe({
      next: (data) => {
        this.temp = [...data];
        this.rows = data.map(desempenho => ({
          ...desempenho,
          nomeCliente: desempenho.cliente?.nome,
          nomeFlag: desempenho.flag?.nome,
          nomeTier: desempenho.tier?.nome,
          dataFormatada: new Date(desempenho.data).toLocaleString(),
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar desempenhos:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  loadTiers() {
    this.tierServ.list().subscribe(data => {
      this.tiers = data.map(item => ({
        label: item.nome,
        value: String(item.tierId)
      }));
    });
  }

  loadFlags() {
    this.flagServ.list().subscribe(data => {
      this.flags = data.map(item => ({
        label: item.nome,
        value: String(item.flagId)
      }));
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase().trim();

    // Se o campo de busca estiver vazio, restaura todos os dados originais
    if (!val) {
      // Recria os rows com todos os dados temporários
      this.rows = this.temp.map(row => ({
        ...row,
        nomeCliente: row.cliente?.nome,
        nomeFlag: row.flag?.nome,
        nomeTier: row.tier?.nome,
        dataFormatada: new Date(row.data).toLocaleString()
      }));
      return;
    }

    // Filtra e garante que todos os dados necessários estejam presentes
    this.rows = this.temp.filter((d) => {
      // Se não houver nome do cliente, não deve aparecer nos resultados
      if (!d.cliente?.nome) {
        return false;
      }

      // Faz a busca pelo nome do cliente
      return d.cliente.nome.toLowerCase().includes(val);
    }).map(row => ({
      ...row,
      nomeCliente: row.cliente?.nome,
      nomeFlag: row.flag?.nome,
      nomeTier: row.tier?.nome,
      dataFormatada: new Date(row.data).toLocaleString()
    }));
  }

  loadClientes() {
    this.clienteServ.list().subscribe(data => {
      this.clientes = data.map(item => ({
        label: item.nome,
        value: String(item.clienteId)
      }));
    });
  }

  onSubmit() {
    this.validateOnSubmit = true
    const formData = this.formPerf.value;
    formData.clienteId = Number(formData.clienteId);
    formData.tierId = Number(formData.tierId);
    formData.flagId = Number(formData.flagId);
    formData.status = 1;
    console.log(formData)
    this.desempenhoServ.save(formData, 0).subscribe({
      next: () => {
        this.modalDesempenho.closeModal();
        this.loadDesempenhos();
        this.validateOnSubmit = false;
      },
      error: (error) => {
        console.error('Erro ao salvar desempenho:', error);
      }
    });

  }

  deleteDesempenho(row: any) {
    this.currentId = row.id;
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      this.desempenhoServ.remove(this.currentId).subscribe({
        next: () => {
          this.loadDesempenhos();
        },
        error: (error) => {
          console.error('Erro ao excluir desempenho:', error);
        }
      });
    }
  }

  openModalDesempenho() {
    this.validateOnSubmit = false;
    this.formPerf.reset();
    this.modalDesempenho.openModal();
  }

  openEditModal(row: any) {
    this.currentId = row.id;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toISOString().split('T')[0];
    };

    this.formEdit.patchValue({
      id: row.id,
      clienteId: String(row.clienteId),
      status: row.status,
      data: formatDate(row.data),
      tierId: String(row.tierId),
      flagId: String(row.flagId),
      honorario: row.honorario,
      investidoEsteMes: row.investidoEsteMes,
      vendasMetaAds: row.vendasMetaAds,
      vendasGoogleAds: row.vendasGoogleAds,
      valorDeVendas: row.valorDeVendas
    });

    this.modalEdit.openModal();
  }
  onSubmitEdit() {
    this.validateOnSubmit = true;
    const formData = this.formEdit.value;
    formData.clienteId = Number(formData.clienteId);
    formData.tierId = Number(formData.tierId);
    formData.flagId = Number(formData.flagId);
    formData.status = 1;
    console.log(formData)
    this.desempenhoServ.save(formData, formData.id).subscribe({
      next: () => {
        this.modalEdit.closeModal();
        this.loadDesempenhos();
        this.validateOnSubmit = false;
        this.formEdit.reset();
      },
      error: (error) => {
        console.error('Erro ao atualizar desempenho:', error);
      }
    });
  }
}
