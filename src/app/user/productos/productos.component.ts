import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from 'src/app/theme/shared/service/carrito.service';
import { ProductosService } from 'src/app/theme/shared/service/productos.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-productos',
  imports: [SharedModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {

  productos: any[] = [];
  categoriaNombre: string = '';
  cveCategoria: number = 0;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductosService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.cveCategoria = +this.route.snapshot.paramMap.get('cveCategoria')!;
    this.listarProductosPorCategoria();
  }

  listarProductosPorCategoria(): void {
    this.productoService.listarProductosPorCategoria(this.cveCategoria).subscribe({
      next: (data) => {
        this.productos = data;
        if (data.length > 0) {
          this.categoriaNombre = data[0].categoriaNombre; // Asume que el backend devuelve el nombre de la categoría
        }
      },
      error: (error) => {
        console.error('Error al listar productos:', error);
      }
    });
  }

  agregarAlCarrito(producto: any): void {
    const carrito = {
      cveUsuario: 1, // Cambia esto por el ID del usuario actual
      cantidad: 1,
      cveProducto: producto.cveProducto
    };

    this.carritoService.agregarProductoAlCarrito(carrito).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
      },
      error: (error) => {
        console.error('Error al agregar al carrito:', error);
        alert('Ocurrió un error al agregar el producto al carrito');
      }
    });
  }

}
