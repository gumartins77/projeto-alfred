export interface MaintenanceLineItem {
  id?: string;
  tipo_maquina?: string;
  numero_maquina?: string;
  numero_patrimonio?: string;
  produto_quantidade_aplicada?: string;
  material_acabamento?: string;
  material_onde_aplicado?: string;
  // Legacy fields for backward compatibility
  component?: string;
  condition?: 'BOM' | 'REGULAR' | 'RUIM';
  action?: string;
}

export interface MaintenanceReportPart {
  id?: string;
  report_id: string;
  list_number: 1 | 2; // 1 = to be replaced, 2 = replaced
  machine_number?: string;
  fig?: string;
  item?: string;
  quantity?: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MaintenanceReport {
  id?: string;
  user_id: string;
  
  // Report metadata
  report_number?: string;
  report_type: 'rotina' | 'chamado';
  
  // Equipment data
  machine_number: string;
  date: string;
  start_time?: string;
  end_time?: string;
  
  // Client data
  client_name?: string;
  client_address?: string;
  client_city?: string;
  client_phone?: string;
  client_contact?: string;
  client_state?: string;
  function_description?: string;
  service_area?: string;
  
  // Service location
  location: string;
  responsible: string;
  observations?: string;
  
  // Line items (maintenance items)
  line_items: MaintenanceLineItem[];
  
  // Signatures
  technical_signature?: string;
  client_signature?: string;
  responsible_signature?: string;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
}
