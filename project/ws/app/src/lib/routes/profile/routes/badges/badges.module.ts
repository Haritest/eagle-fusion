import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BadgesComponent } from './badges.component'

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatProgressBarModule,
} from '@angular/material'
import { BadgesCardComponent } from './components/badges-card/badges-card.component'
import { BadgesNotEarnedComponent } from './components/badges-not-earned/badges-not-earned.component'
import { HorizontalScrollerModule, DefaultThumbnailModule } from '@ws-widget/utils'

@NgModule({
  declarations: [BadgesComponent, BadgesCardComponent, BadgesNotEarnedComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatProgressBarModule,
    HorizontalScrollerModule,
    DefaultThumbnailModule,
  ],
  exports: [BadgesComponent, BadgesCardComponent, BadgesNotEarnedComponent],
})
export class BadgesModule { }
