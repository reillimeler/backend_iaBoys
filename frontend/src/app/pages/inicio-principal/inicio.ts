import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, OnDestroy {

  currentIndex = 0;

  private intervalId: any;

  isTransitioning = true;

  // 👇 IMPORTANTE
  constructor(private cdr: ChangeDetectorRef) {}

  slides = [
    { img: 'medi1.jpg', titulo: 'Atención Especializada' },
    { img: 'medi2.jpg', titulo: 'Tecnología de Punta' },
    { img: 'medi3.png', titulo: 'Confianza y Seguridad' }
  ];

  displaySlides = [...this.slides, this.slides[0]];

  ngOnInit() {

    this.startAutoPlay();

  }

  startAutoPlay() {

    this.intervalId = setInterval(() => {

      this.nextSlide();

    }, 3500);

  }

  nextSlide() {

    console.log("Cambiando slide");

    this.isTransitioning = true;

    this.currentIndex++;

    // 🔥 FORZAR ACTUALIZACIÓN
    this.cdr.detectChanges();

    if (this.currentIndex === this.displaySlides.length) {

        this.isTransitioning = false;

        this.currentIndex = 0;

        // 🔥 FORZAR ACTUALIZACIÓN
        this.cdr.detectChanges();

    }

  }
  ngOnDestroy() {

    if (this.intervalId) {
      clearInterval(this.intervalId);

    }

  }

}