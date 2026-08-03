import { supabase } from './supabase';
import { MaintenanceReportPart } from './types';

export async function fetchReportParts(
  reportId: string,
  listNumber?: 1 | 2
): Promise<MaintenanceReportPart[]> {
  try {
    let query = supabase
      .from('maintenance_report_parts')
      .select('*')
      .eq('report_id', reportId);

    if (listNumber !== undefined) {
      query = query.eq('list_number', listNumber);
    }

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching parts:', error);
    return [];
  }
}

export async function createReportPart(part: Omit<MaintenanceReportPart, 'id' | 'created_at' | 'updated_at'>): Promise<MaintenanceReportPart | null> {
  try {
    const { data, error } = await supabase
      .from('maintenance_report_parts')
      .insert([part])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating part:', error);
    return null;
  }
}

export async function updateReportPart(
  partId: string,
  updates: Partial<MaintenanceReportPart>
): Promise<MaintenanceReportPart | null> {
  try {
    const { data, error } = await supabase
      .from('maintenance_report_parts')
      .update(updates)
      .eq('id', partId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating part:', error);
    return null;
  }
}

export async function deleteReportPart(partId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('maintenance_report_parts')
      .delete()
      .eq('id', partId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting part:', error);
    return false;
  }
}

export async function bulkCreateReportParts(
  parts: Omit<MaintenanceReportPart, 'id' | 'created_at' | 'updated_at'>[]
): Promise<MaintenanceReportPart[]> {
  try {
    if (parts.length === 0) return [];

    const { data, error } = await supabase
      .from('maintenance_report_parts')
      .insert(parts)
      .select();

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error creating parts:', error);
    return [];
  }
}

export async function deleteReportParts(reportId: string, listNumber?: 1 | 2): Promise<boolean> {
  try {
    let query = supabase
      .from('maintenance_report_parts')
      .delete()
      .eq('report_id', reportId);

    if (listNumber !== undefined) {
      query = query.eq('list_number', listNumber);
    }

    const { error } = await query;

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting parts:', error);
    return false;
  }
}
