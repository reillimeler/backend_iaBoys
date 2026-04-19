import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [], 
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit, OnDestroy {
  currentIndex = 0;
  private intervalId: any;
  isTransitioning = true; // Controla si la animación está activa

  // Tus imágenes originales
  slides = [
    { img: 'fondo1.jpg', titulo: 'Atención Especializada' },
    { img: 'fondo2.jpg', titulo: 'Tecnología de Punta' },
  
  ];

  // Creamos una lista que incluye un clon de la primera imagen al final
  // Esto hace que después de la 3, aparezca la 1 otra vez antes de saltar
  displaySlides = [...this.slides, this.slides[0]];

  ngOnInit() {
    this.startAutoPlay();
  }

  startAutoPlay() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.isTransitioning = true;
    this.currentIndex++;

    // Si llegamos al clon (el final de displaySlides)
    if (this.currentIndex === this.displaySlides.length) {
      // Esperamos a que termine la animación (1s según el CSS)
      setTimeout(() => {
        this.isTransitioning = false; // Desactivamos la animación
        this.currentIndex = 0;        // Saltamos al inicio real
      }, 1000); 
    }
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }
}