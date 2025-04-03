import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCategoriaDialogComponent } from './add-categoria-dialog/add-categoria-dialog.component';
import { ToastService } from 'src/app/theme/shared/service/toast.service';

@Component({
  selector: 'app-categoria',
  imports: [CardComponent, CommonModule, SharedModule],
  templateUrl: './categoria.component.html',
  styleUrl: './categoria.component.scss'
})
export class CategoriaComponent {

  dataSource = new MatTableDataSource([]);
  displayedColumns: String[] = ['nombre', 'estatus', 'acciones'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  toastService = inject(ToastService);


  constructor(
    private categoriaService: CategoriaService,
    private modalService: NgbModal){

    }

  ngOnInit(): void {
    this.getCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCategorias( ){
    this.categoriaService.listarCategorias()
    .subscribe((categorias: any[])=>{
      this.dataSource.data = categorias;
    });
 }

 openCategoryModal(categoria?: any): void {
  const modalRef = this.modalService.open(AddCategoriaDialogComponent, { size: 'lg' });
  modalRef.componentInstance.categoria = categoria || {};

  modalRef.result.then(
    (result) => {
      if (result) {
        if (categoria) {
          this.actualizarCategoria(categoria.cveCategoria, result);
        } else {
          this.insertarCategoria(result);
        }
      }
    },
    () => {
      // Modal cerrado sin guardar
    }
  );
}

insertarCategoria(categoria: any): void {
  this.categoriaService.insertarCategoria(categoria).subscribe({
    next: (response) => {
      console.log('Categoría insertada:', response);
      this.toastService.showSuccess('Los datos se guardaron correctamente');

      this.getCategorias();
    },
    error: (error) => {
      this.toastService.showDanger(error);


      console.error('Error al insertar categoría:', error);
    }
  });
}

actualizarCategoria(cveCategoria: number, categoria: any): void {
  this.categoriaService.actualizarCategoria(cveCategoria, categoria).subscribe({
    next: (response) => {
      console.log('Categoría actualizada:', response);
      this.toastService.showSuccess('Los datos se actualizaron correctamente');
      this.getCategorias();
    },
    error: (error) => {
      this.toastService.showDanger(error);

      console.error('Error al actualizar categoría:', error);
    }
  });
}

eliminarCategoria(cveCategoria: number): void {
  if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
    this.categoriaService.eliminarCategoria(cveCategoria)
    .subscribe({
      next: () => {
        console.log(`Categoría con ID ${cveCategoria} eliminada.`);
        this.toastService.showSuccess('Categoría eliminada correctamente');
        this.getCategorias();
      },
      error: (error) => {
        this.toastService.showDanger(error);

      }
    });
  }
}


cambiarEstatus(categoria: any){
  var {cveCategoria, activo}=categoria;
  activo = !activo;

  this.categoriaService.cambiarEstatusCategoria(cveCategoria, activo)
  .subscribe((categoria: any) =>{
    this.toastService.showSuccess('Estatus actualizado correctamente');
    this.getCategorias();
  });
 }




}
