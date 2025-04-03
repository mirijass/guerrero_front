import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from 'src/app/theme/shared/service/categoria.service';
import { ProductosService } from 'src/app/theme/shared/service/productos.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@Component({
  selector: 'app-add-product-dialog',
  imports: [SharedModule],
  templateUrl: './add-product-dialog.component.html',
  styleUrl: './add-product-dialog.component.scss'
})
export class AddProductDialogComponent {

  productForm: FormGroup;
  categorias: any[] = []; // Lista de categorías activas
  producto: any; // Producto recibido para editar
  selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado
  fileError: string | null = null; // Variable para almacenar errores de archivo

  titulo: string = ''; // Título del modal

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private categoriaService: CategoriaService, // Inyectar el servicio de categorías
    private productosService: ProductosService // Servicio para subir la imagen

  ) {}

  ngOnInit(): void {
    // Inicializar el formulario
    this.productForm = this.fb.group({
      cveProducto: [this.producto?.cveProducto || ''],
      nombre: [this.producto?.nombre || '', Validators.required],
      descripcion: [this.producto?.descripcion || '', Validators.required],
      precio: [this.producto?.precio || 0, [Validators.required, Validators.min(1)]],
      cantidad: [this.producto?.cantidad || 0, [Validators.required, Validators.min(1)]],
      cveCategoria: [this.producto?.cveCategoria || null, Validators.required],
      imagen: [''], // La imagen se manejará aparte
      activo: [this.producto?.activo ?? true]
    });

    console.log('Producto recibido:', this.producto);
    if(this.producto?.cveProducto !=null) {
      this.titulo = 'Editar Producto'; // Cambiar el título si se está editando un producto
    }else{
      this.titulo = 'Agregar Producto'; // Cambiar el título si se está agregando un nuevo producto
    }
        // Cargar las categorías activas
        this.listarCategorias();

  }

    // Método para listar categorías activas
    listarCategorias(): void {
      this.categoriaService.listarCategoriasActivas().subscribe({
        next: (response) => {
          console.log('Categorías activas:', response);
          this.categorias = response; // Asignar las categorías al array
        },
        error: (error) => {
          console.error('Error al obtener categorías:', error);
        }
      });
    }
  

      // Manejar el archivo seleccionado
      onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
          const file = input.files[0];
      
          // Validar tipo de archivo
          if (!file.type.startsWith('image/')) {
            this.fileError = 'El archivo seleccionado no es una imagen.';
            this.selectedFile = null;
            return;
          }
      
          // Validar tamaño del archivo (máximo 2 MB)
          const maxSizeInBytes = 2 * 1024 * 1024; // 2 MB
          if (file.size > maxSizeInBytes) {
            this.fileError = 'El archivo debe pesar menos de 2 MB.';
            this.selectedFile = null;
            return;
          }
      
          // Si pasa las validaciones, asignar el archivo
          this.fileError = null;
          this.selectedFile = file;
        }
      }

  save(): void {
    if (this.productForm.valid) {
      const formValue = { ...this.productForm.value };
  
      // Convertir cveCategoria a número
      formValue.cveCategoria = +formValue.cveCategoria;
  
      // Subir la imagen si se seleccionó un archivo
      formValue.imagen = this.selectedFile;
      console.log('Formulario válido:', formValue);
      this.activeModal.close(formValue); // Devuelve los datos del formulario

    }
  }

  cancel(): void {
    this.activeModal.dismiss(); // Cierra el modal sin devolver datos
  }

}
