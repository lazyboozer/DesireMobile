import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { SortGridPipe } from "./SortGridPipe";

@NgModule({
  declarations: [SortGridPipe],
  imports: [CommonModule],
  exports: [SortGridPipe]
})

export class MainSortGridPipe { }