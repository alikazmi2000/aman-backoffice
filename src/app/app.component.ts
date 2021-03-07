import {Component} from '@angular/core';

// language list
import { locale as enLang } from './locales/en';
import { locale as chLang } from './locales/ch';
import { locale as esLang } from './locales/es';
import { locale as jpLang } from './locales/jp';
import { locale as deLang } from './locales/de';
import { locale as frLang } from './locales/fr';
import {TranslationService} from './helpers/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BidSquad';

  constructor(
    private translationService: TranslationService
  ) {

    // register translations
    this.translationService.loadTranslations(enLang, chLang, esLang, jpLang, deLang, frLang);
  }
}
