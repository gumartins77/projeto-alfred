import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { MaintenanceReport, MaintenanceReportPart } from './types';
import { formatDate } from './utils';

export async function generatePDF(report: MaintenanceReport, parts: { parts1: MaintenanceReportPart[]; parts2: MaintenanceReportPart[] }) {
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
    <div style="width: 100%; font-family: Arial, sans-serif; color: #333;">
      <div style="border-bottom: 3px solid #000; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="margin: 0; text-align: center; font-size: 22px; font-weight: bold;">BOLETIM DE MANUTENÇÃO</h1>
        <div style="text-align: center; margin-top: 8px; font-size: 11px;">
          <p style="margin: 3px 0;">Formulário de Manutenção de Máquinas</p>
        </div>
      </div>

      <!-- SEÇÃO 1: DADOS DO CLIENTE -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">1. DADOS DO CLIENTE</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Cliente:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_name || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Contato:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_contact || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Telefone:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_phone || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Endereço:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_address || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Cidade:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_city || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Estado:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_state || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Nº Relatório:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.report_number || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Tipo:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.report_type === 'chamado' ? 'Chamado' : 'Rotina'}</td>
          </tr>
        </table>
      </div>

      <!-- SEÇÃO 2: DADOS DO SERVIÇO -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">2. DADOS DO SERVIÇO</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Data:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${formatDate(report.date)}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Cidade:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.client_city || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Início:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.start_time || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Término:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.end_time || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Produto:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.produto || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Ordem Produção:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.ordem_producao || '-'}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Ordem Venda:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.ordem_venda || '-'}</td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;"><strong>Lote:</strong></td>
            <td style="width: 25%; padding: 8px; border: 1px solid #ddd;">${report.lote || '-'}</td>
          </tr>
          <tr>
            <td colspan="4" style="padding: 8px; border: 1px solid #ddd;">
              <strong>Serviço Realizado:</strong><br>
              <span style="font-size: 10px;">${report.observations ? report.observations.replace(/\n/g, '<br>') : '-'}</span>
            </td>
          </tr>
        </table>
      </div>

      <!-- SEÇÃO 3: ITENS DE MANUTENÇÃO -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">3. ITENS DE MANUTENÇÃO</h2>
        ${report.line_items.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #e8f0ff;">
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Tipo Máquina</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Nº Máquina</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Nº Patrimônio</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Produto/Qtd</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Material</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Onde Aplicado</strong></th>
              </tr>
            </thead>
            <tbody>
              ${report.line_items.map(item => `
                <tr>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.tipo_maquina || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.numero_maquina || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.numero_patrimonio || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.produto_quantidade_aplicada || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.material_acabamento || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${item.material_onde_aplicado || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `<p style="font-size: 11px; color: #666;">Nenhum item registrado</p>`}
      </div>

      <!-- SEÇÃO 4: PEÇAS A SEREM SUBSTITUÍDAS -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">4. PEÇAS A SEREM SUBSTITUÍDAS</h2>
        ${parts.parts1 && parts.parts1.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #fff3cd;">
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Nº Máquina</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Fig.</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Item</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Quantidade</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Descrição</strong></th>
              </tr>
            </thead>
            <tbody>
              ${parts.parts1.map(part => `
                <tr>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.machine_number || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.fig || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.item || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${part.quantity || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.description || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `<p style="font-size: 11px; color: #666;">Nenhuma peça a substituir</p>`}
      </div>

      <!-- SEÇÃO 5: PEÇAS SUBSTITUÍDAS -->
      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 13px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #3b82f6; padding-bottom: 5px;">5. PEÇAS SUBSTITUÍDAS</h2>
        ${parts.parts2 && parts.parts2.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
            <thead>
              <tr style="background-color: #d4edda;">
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Nº Máquina</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Fig.</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Item</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Quantidade</strong></th>
                <th style="padding: 6px; border: 1px solid #ddd; text-align: left;"><strong>Descrição</strong></th>
              </tr>
            </thead>
            <tbody>
              ${parts.parts2.map(part => `
                <tr>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.machine_number || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.fig || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.item || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd; text-align: center;">${part.quantity || '-'}</td>
                  <td style="padding: 6px; border: 1px solid #ddd;">${part.description || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : `<p style="font-size: 11px; color: #666;">Nenhuma peça substituída</p>`}
      </div>

      <!-- RODAPÉ -->
      <div style="margin-top: 30px; border-top: 2px solid #000; padding-top: 15px; font-size: 10px; text-align: right; color: #666;">
        <p style="margin: 5px 0;">Data de Impressão: ${formatDate(new Date().toISOString().split('T')[0])}</p>
        <p style="margin: 5px 0;">Relatório Nº: ${report.report_number || 'N/A'}</p>
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
    pdf.save(`relatorio_${report.report_number || report.date}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
