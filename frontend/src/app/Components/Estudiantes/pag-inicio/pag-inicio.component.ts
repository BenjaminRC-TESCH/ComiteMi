import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Carousel } from 'bootstrap';

@Component({
    selector: 'app-pag-inicio',
    templateUrl: './pag-inicio.component.html',
    styleUrls: ['./pag-inicio.component.css'],
})
export class PagInicioComponent implements AfterViewInit {
    @ViewChild('carousel') carouselElement: ElementRef | undefined;

    ngAfterViewInit(): void {
        this.myFunction(); // La función original que proporcionaste
        const myCarousel = document.getElementById('carouselExampleIndicators');
        if (myCarousel) {
            new Carousel(myCarousel, {
                interval: 3000, // Cambio cada 3 segundos
                wrap: true, // Permite que el carrusel vuelva al principio después de llegar al final
            });
        }
    }

    myFunction(): void {
        const x = document.getElementById('myTopnav');
        if (x) {
            if (x.className === 'topnav') {
                x.className += ' responsive';
            } else {
                x.className = 'topnav';
            }
        }
    }
}
