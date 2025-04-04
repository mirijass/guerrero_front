import { Component, inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CarritoService } from 'src/app/theme/shared/service/carrito.service';
import { ToastService } from 'src/app/theme/shared/service/toast.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-carrito',
  imports: [SharedModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.scss'
})
export class CarritoComponent {

  displayedColumns: string[] = ['nombre', 'descripcion', 'cantidad', 'precio', 'subtotal', 'acciones', 'expand'];
  dataSource = new MatTableDataSource<any>();
  cveUsuario = 11; // Cambia esto por el ID del usuario actual
  expandedElement: any | null = null;

  toastService = inject(ToastService);
  

  constructor(private carritoService: CarritoService) {}

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.carritoService.obtenerCarrito(this.cveUsuario).subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  actualizarCantidad(item: any): void {
    const carrito = {
      cveUsuario: this.cveUsuario,
      cantidad: item.cantidad,
      cveProducto: item.producto.cveProducto
    };
    this.carritoService.agregarProductoAlCarrito(carrito).subscribe({
      next: () => {
        console.log(`Cantidad del producto ${item.producto.cveProducto} actualizada a ${item.cantidad}`);
        this.toastService.showSuccess('Cantidad actualizada correctamente');
        this.cargarCarrito();
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad:', error);
        this.cargarCarrito();
        this.toastService.showDanger(error.error.message || 'Error al actualizar la cantidad');
      }
    });
  }


  eliminarProducto(cveCarrito: number, cveProducto): void {
    this.carritoService.eliminarProductoDelCarrito(cveCarrito, cveProducto).subscribe(() => {
      this.cargarCarrito();
    });
  }

  toggle(row: any): void {
    console.log(row);
    this.expandedElement = this.expandedElement === row ? null : row;
  }

}
