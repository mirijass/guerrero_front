import { MatTableModule } from '@angular/material/table';
// angular import
import { Component, inject, signal, TemplateRef, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';


// project import

import { CardComponent } from '../../../theme/shared/components/card/card.component';
import { ProductosService } from 'src/app/theme/shared/service/productos.service';
import { CommonModule } from '@angular/common';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog.component';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sample-page',
  imports: [CardComponent, CommonModule, SharedModule],
  templateUrl: './sample-page.component.html',
  styleUrls: ['./sample-page.component.scss']
})
export default class SamplePageComponent{
  // Columnas que se mostrarán en la tabla
  displayedColumns: string[] = ['cveProducto', 'descripcion', 'precio', 'cantidad', 'categoria', 'imagen', 'acciones'];

  // Datos de ejemplo para la tabla
  dataSource: any[] = [];

  imagenSeleccionada: string | null = null; // Variable para almacenar la imagen seleccionada


  // Inyección del servicio en el constructor
  constructor(private productosService: ProductosService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getProductos();
  }

  // Consumir service
  getProductos() {
    console.log('Obteniendo productos...');

    this.productosService.listarProductos().subscribe({
      next: (response) => {
        console.log('Productos:', response);
              // Convertir el Buffer de imagen a Base64
      this.dataSource = response.map((producto: any) => {
        if (producto.imagen && producto.imagen.data) {
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(producto.imagen.data))
          );
          producto.imagen = `data:image/png;base64,${base64String}`; // Ajusta el tipo de imagen si no es PNG
        }
        return producto;
      });
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      },
    });
  }

  // Insertar producto
  insertarProducto(producto: any): void {
    this.productosService.insertarProducto(producto).subscribe({
      next: (response) => {
        console.log('Producto insertado:', response);

        // Subir la imagen si existe
        if (producto.imagen) {
          this.agregarImagen(response.cveProducto, producto.imagen);
        }
  
        this.dataSource = [...this.dataSource, response]; 
      },
      error: (error) => {
        console.error('Error al insertar producto:', error);
      },
    });
  }

  // Actualizar producto
  actualizarProducto(cveProducto: number, producto: any): void {
    this.productosService.actualizarProducto(cveProducto, producto).subscribe({
      next: (response) => {
        console.log('Producto actualizado:', response);
        // Subir la imagen si existe
        if (producto.imagen) {
          this.agregarImagen(cveProducto, producto.imagen);
        }
        response.imagen = producto.imagen; // Mantener la imagen del producto actualizado
        const index = this.dataSource.findIndex((p) => p.cveProducto === cveProducto);
        if (index !== -1) {
          this.dataSource[index] = response; // Actualizar el producto en la tabla
          this.dataSource = [...this.dataSource]; // Forzar la actualización de la tabla
        }
      },
      error: (error) => {
        console.error('Error al actualizar producto:', error);
      },
    });
  }

    // Eliminar producto
    eliminarProducto(cveProducto: number): void {
      if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        this.productosService.eliminarProducto(cveProducto).subscribe({
          next: () => {
            console.log(`Producto con ID ${cveProducto} eliminado.`);
            this.dataSource = this.dataSource.filter((producto) => producto.cveProducto !== cveProducto); // Actualizar la tabla
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
          },
        });
      }
    }

  // Método para abrir el modal y mostrar la imagen
  verImagen(imagen: string, modalTemplate: any): void {
    this.imagenSeleccionada = imagen; // Asignar la URL de la imagen seleccionada
    this.modalService.open(modalTemplate, { size: 'sn', centered: true }); // Abrir el modal
  }

  agregarImagen(cveProducto: number, file: File): void {
    this.productosService.subirImagen(cveProducto, file).subscribe({
      next: (response) => {
        console.log('Imagen subida exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al subir la imagen:', error);
      },
    });
  }

  // Abrir modal para agregar o editar producto
  openProductModal(producto?: any): void {
    const modalRef = this.modalService.open(AddProductDialogComponent, { size: 'lg' });
    modalRef.componentInstance.producto = producto || {}; // Pasar el producto al modal (vacío si es nuevo)

    modalRef.result.then(
      (result) => {
        if (result) {
          if (producto) {
            // Si existe un producto, actualizar
            this.actualizarProducto(producto.cveProducto, result);
          } else {
            // Si no existe, insertar
            this.insertarProducto(result);
          }
        }
      },
      () => {
        // Modal cerrado sin guardar
      }
    );
  }

}