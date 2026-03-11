import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [TranslateModule,RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent implements OnInit {

  currentLang = 'es';

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const savedLang = localStorage.getItem('lang');

    if (savedLang) {
      this.currentLang = savedLang;
    } else {
      const browserLang = this.translate.getBrowserLang();
      this.currentLang = browserLang?.match(/es|eu/) ? browserLang : 'es';
    }
    this.translate.use(this.currentLang);
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

}
