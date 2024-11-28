import { Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  @ViewChild('modalCliente') modalCliente: ModalComponent;
  @ViewChild('modalEdit') modalEdit: ModalComponent;

  formCliente: FormGroup;
  formEdit: FormGroup;
  rows: Cliente[] = [];
  temp: Cliente[] = [];
  loading: boolean = false;
  validateOnSubmit: boolean = false;
  currentId: number = 0;

  uf = [{
    label: "Acre",
    value: "AC"
  },
  {
    label: "Alagoas",
    value: "AL"
  },
  {
    label: "Amapá",
    value: "AP"
  },
  {
    label: "Amazonas",
    value: "AM"
  },
  {
    label: "Bahia",
    value: "BA"
  },
  {
    label: "Ceará",
    value: "CE"
  },
  {
    label: "Espírito Santo",
    value: "ES"
  },
  {
    label: "Goiás",
    value: "GO"
  },
  {
    label: "Maranhão",
    value: "MA"
  },
  {
    label: "Mato Grosso",
    value: "MT"
  },
  {
    label: "Mato Grosso do Sul",
    value: "MS"
  },
  {
    label: "Minas Gerais",
    value: "MG"
  },
  {
    label: "Pará",
    value: "PA"
  },
  {
    label: "Paraíba",
    value: "PB"
  },
  {
    label: "Paraná",
    value: "PR"
  },
  {
    label: "Pernambuco",
    value: "PE"
  },
  {
    label: "Piauí",
    value: "PI"
  },
  {
    label: "Rio de Janeiro",
    value: "RJ"
  },
  {
    label: "Rio Grande do Norte",
    value: "RN"
  },
  {
    label: "Rio Grande do Sul",
    value: "RS"
  },
  {
    label: "Rondônia",
    value: "RO"
  },
  {
    label: "Roraima",
    value: "RR"
  },
  {
    label: "Santa Catarina",
    value: "SC"
  },
  {
    label: "São Paulo",
    value: "SP"
  },
  {
    label: "Sergipe",
    value: "SE"
  },
  {
    label: "Tocantins",
    value: "TO"
  },
  {
    label: "Distrito Federal",
    value: "DF"
  },
  ]
  constructor(
    private clienteServ: ClienteService,
    private formBuilder: FormBuilder,
  ) {
    this.formCliente = this.formBuilder.group({
      nome: ['', Validators.required],
      uf: ['', Validators.required],
      inicioDeContrato: ['', Validators.required],
      fimDeContrato: ['', Validators.required]
    });

    this.formEdit = this.formBuilder.group({
      clienteId: [''],
      nome: ['', Validators.required],
      uf: ['', Validators.required],
      inicioDeContrato: ['', Validators.required],
      fimDeContrato: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCliente();
  }

  loadCliente() {
    this.loading = true;
    this.clienteServ.list().subscribe({
      next: (data) => {
        this.rows = data.map(cliente => ({
          ...cliente,
          inicioDeContratoFormatado: new Date(cliente.inicioDeContrato).toLocaleDateString(),
          fimDeContratoFormatado: new Date(cliente.fimDeContrato).toLocaleDateString()
        }));
        this.temp = [...this.rows];
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  updateFilter(event: any) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return d.clienteId.toString().includes(val) ||
        d.nome.toLowerCase().includes(val) ||
        d.uf.toLowerCase().includes(val) ||
        !val;
    });
    this.rows = temp;
    this.table.offset = 0;
  }

  openModalCliente() {
    this.validateOnSubmit = false;
    this.formCliente.reset();
    this.modalCliente.openModal();
  }

  openEditModal(row: any) {
    this.validateOnSubmit = false;
    this.currentId = row.clienteId;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toISOString().split('T')[0];
    };

    this.formEdit.patchValue({
      clienteId: row.clienteId,
      nome: row.nome,
      uf: row.uf,
      inicioDeContrato: formatDate(row.inicioDeContrato),
      fimDeContrato: formatDate(row.fimDeContrato)
    });

    this.modalEdit.openModal();
  }

  onSubmit() {
    this.validateOnSubmit = true;
    if (this.formCliente.valid) {
      const formData = this.formCliente.value;
      this.clienteServ.save(formData, 0).subscribe({
        next: () => {
          this.modalCliente.closeModal();
          this.loadCliente();
          this.validateOnSubmit = false;
          this.formCliente.reset();
        },
        error: (error) => {
          console.error('Erro ao salvar cliente:', error);
        }
      });
    }
  }

  onSubmitEdit() {
    this.validateOnSubmit = true;
    if (this.formEdit.valid) {
      const formData = this.formEdit.value;
      this.clienteServ.save(formData, this.currentId).subscribe({
        next: () => {
          this.modalEdit.closeModal();
          this.loadCliente();
          this.validateOnSubmit = false;
          this.formEdit.reset();
        },
        error: (error) => {
          console.error('Erro ao atualizar cliente:', error);
        }
      });
    }
  }

  deleteCliente(row: any) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteServ.remove(row.clienteId).subscribe({
        next: () => {
          this.loadCliente();
        },
        error: (error) => {
          console.error('Erro ao excluir cliente:', error);
        }
      });
    }
  }
}