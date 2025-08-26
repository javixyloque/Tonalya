const arrInstrumentos = () =>   [
            { "nombre": "Violín", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Viola", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1571974599782-876246e75f4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Violonchelo", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1596386461350-326ccb303e83?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Contrabajo", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1619989170762-eb00c6580336?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Guitarra acústica", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },    
            { "nombre": "Guitarra eléctrica", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1558098329-a11cff621064?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Bajo", "familia": "Cuerda", "imagen": "https://images.unsplash.com/photo-1613418001428-e205b7d499dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

            { "nombre": "Flauta", "familia": "Viento madera", "imagen": "https://images.unsplash.com/photo-1522992316832-aa103cb02f84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Oboe", "familia": "Viento madera", "imagen": "https://images.unsplash.com/photo-1621569991227-096ad80ea99e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Clarinete", "familia": "Viento madera", "imagen": "https://images.unsplash.com/photo-1621569976540-9ed555867dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Fagot", "familia": "Viento madera", "imagen": "https://images.unsplash.com/photo-1619989170765-58bbc08db5ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Saxofón", "familia": "Viento madera", "imagen": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

            { "nombre": "Trompeta", "familia": "Viento metal", "imagen": "https://images.unsplash.com/photo-1585496030023-e301318f0f6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Trombón", "familia": "Viento metal", "imagen": "https://images.unsplash.com/photo-1613418001428-e205b7d499dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Trompa", "familia": "Viento metal", "imagen": "https://images.unsplash.com/photo-1619989170765-58bbc08db5ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Tuba", "familia": "Viento metal", "imagen": "https://images.unsplash.com/photo-1619989170762-eb00c6580336?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

            { "nombre": "Percusión sinfónica", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Caja", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Timbales", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Xilófono", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Batería", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Cajón", "familia": "Percusión", "imagen": "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },

            { "nombre": "Piano", "familia": "Teclado", "imagen": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Órgano", "familia": "Teclado", "imagen": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Teclado", "familia": "Teclado", "imagen": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
            { "nombre": "Acordeón", "familia": "Teclado", "imagen": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
        ];

        export default arrInstrumentos;