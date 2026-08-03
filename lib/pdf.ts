import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MaintenanceReport } from './types';
import { formatDate } from './utils';

export async function generatePDF(report: MaintenanceReport) {
  // Create a temporary container for PDF content
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '210mm';
  container.style.backgroundColor = 'white';
  container.style.padding = '20px';
  container.style.fontFamily = 'Arial, sans-serif';

  // Build HTML content
  const html = `
    <div style="width: 100%; font-family: Arial, sans-serif;">
      <div style="border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center; font-size: 24px;">RELATÓRIO DE MANUTENÇÃO</h1>
        <div style="text-align: center; margin-top: 10px; font-size: 12px;">
          <p style="margin: 5px 0;">Formulário de Manutenção de Máquinas</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">DADOS DO RELATÓRIO</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Nº Máquina:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.machine_number}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Data:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${formatDate(report.date)}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Início:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.start_time || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Término:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.end_time || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Local:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.location}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Responsável:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.responsible}</td>
          </tr>
        </table>
        ${report.observations ? `
          <div style="margin-top: 10px;">
            <strong style="font-size: 12px;">Observações:</strong>
            <p style="font-size: 11px; margin: 5px 0; padding: 8px; background-color: #f5f5f5; border-left: 3px solid #3b82f6;">${report.observations.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 14px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">ITENS DE MANUTENÇÃO</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;"><strong>Componente</strong></th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;"><strong>Condição</strong></th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: left;"><strong>Ação Recomendada</strong></th>
            </tr>
          </thead>
          <tbody>
            ${report.line_items.map(item => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.component}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">
                  <span style="
                    padding: 3px 8px;
                    border-radius: 3px;
                    font-weight: bold;
                    ${item.condition === 'BOM' ? 'background-color: #dcfce7; color: #166534;' : 
                      item.condition === 'REGULAR' ? 'background-color: #fef3c7; color: #92400e;' : 
                      'background-color: #fee2e2; color: #991b1b;'}
                  ">${item.condition}</span>
                </td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.action}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 20px;">
        <div style="display: flex; justify-content: space-between; font-size: 11px;">
          <div style="text-align: center; width: 30%;">
            <p style="margin: 0; padding-top: 30px; border-top: 1px solid #000;">Assinatura do Responsável</p>
            <p style="margin: 5px 0; font-size: 10px;">${report.responsible}</p>
          </div>
          <div style="text-align: center; width: 30%;">
            <p style="margin: 0; padding-top: 30px; border-top: 1px solid #000;">Data de Impressão</p>
            <p style="margin: 5px 0; font-size: 10px;">${formatDate(new Date().toISOString().split('T')[0])}</p>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    const imgData = canvas.toDataURL('image/png');

    // Add pages if content exceeds one page
    while (heightLeft > 0) {
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height
      position = heightLeft - imgHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    // Download PDF
    pdf.save(`relatorio_${report.machine_number}_${report.date}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
