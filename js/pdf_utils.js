// Función centralizada para aplicar marca de agua, headers y footers estilo Mercy
function aplicarEstiloPDFMercy(doc, titulo) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Marca de agua suave (Logo)
    // Para simplificar, usamos texto muy suave rotado
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');

    // Guardar estado gráfico actual para transparencia y rotación
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.15 }));

    // Rotar texto 45 grados en el centro
    const textW = doc.getTextWidth("MERCY");
    doc.text("MERCY", (pageWidth - textW) / 2 + 30, pageHeight / 2 + 30, { angle: 45 });

    doc.restoreGraphicsState();

    // 2. Encabezado moderno Elegante
    doc.setFillColor(10, 37, 64); // Dark Blue Elegant
    doc.rect(0, 0, pageWidth, 28, 'F');

    if (typeof MERCY_LOGO_B64 !== 'undefined') {
        doc.addImage(MERCY_LOGO_B64, 'PNG', 14, 4, 20, 20);
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("MERCY", 38, 20);
    } else {
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text("MERCY", 15, 20);
    }

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Fecha del reporte: ${today}`, pageWidth - 15, 18, { align: 'right' });

    // 3. Título del Reporte
    doc.setTextColor(30, 41, 59); // Slate Dark
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(titulo, 15, 45);

    // Línea separadora sutil
    doc.setDrawColor(13, 110, 253);
    doc.setLineWidth(0.8);
    doc.line(15, 49, pageWidth - 15, 49);

    // 4. Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Generado por Mercy - Plataforma de Educación Financiera", pageWidth / 2, pageHeight - 10, { align: 'center' });
}

// Variables globales para la biblioteca jsPDF
window.jsPDF = window.jspdf.jsPDF;
