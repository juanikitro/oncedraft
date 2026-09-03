# Revelación de contexto de oferta

Diseño aprobado el 2026-09-03. Una partida nueva abre directamente en la
oferta. Cada oferta nueva revela país durante medio segundo, ciclo mundial
durante medio segundo y luego las cartas de forma escalonada. La animación sólo
presenta una oferta ya decidida por el motor, sin modificar catálogo ni
persistencia.

Durante la revelación, los caracteres se descifran de izquierda a derecha entre
glifos y las acciones y cartas de oferta quedan inhabilitadas. El único bloque
de contexto se mantiene destacado sobre las cartas: se elimina el duplicado
«Contexto actual» de la cabecera y el rótulo «Oferta actual». `Cuenta` ocupa
una celda real de la cabecera, sin superponerse a la interfaz. El inicio usa el
título «Tu selección de 11 leyendas».
