import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { UsuarioComponent } from './theme/layout/usuario/usuario.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '', 
        pathMatch: 'full'
      },
      {
        path: 'default',
        loadComponent: () => import('./demo/dashboard/default/default.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/elements/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/elements/element-color/element-color.component')
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      },
      {
        path: 'categoria',
        loadComponent: () => import('./demo/admin/categoria/categoria.component').then((m) => m.CategoriaComponent)
      },
      {
        path: 'venta',
        loadComponent: () => import('./demo/admin/ventas/ventas.component').then((m) => m.VentasComponent)
      }
    ]
  },
  {
    path: 'user',
    component: UsuarioComponent,
    children: [
      {
        path: '',
        redirectTo: '', 
        pathMatch: 'full'
      },
      {
        path: 'carrito',
        loadComponent: () => import('./user/carrito/carrito.component').then((m) => m.CarritoComponent)
      }
    ]
  },
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./demo/pages/authentication/authentication.module').then((m) => m.AuthenticationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
