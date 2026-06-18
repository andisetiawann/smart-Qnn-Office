import { supabase } from './supabaseClient';

/**
 * Menyimpan log aktivitas perangkat (ON/OFF) ke tabel `device_logs`
 * @param {string} deviceId - ID perangkat (contoh: 'lampu-1')
 * @param {string} state - Status perangkat ('ON' atau 'OFF')
 */
export const logDeviceActivity = async (deviceId, state) => {
  try {
    const { error } = await supabase
      .from('device_logs')
      .insert([
        {
          device_id: deviceId,
          state: state,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) throw error;
  } catch (err) {
    console.error('Gagal menyimpan log ke Supabase:', err.message);
  }
};

/**
 * Memperbarui status perangkat terakhir di tabel `devices`
 */
export const updateDeviceStatus = async (deviceId, state, isOnline = true) => {
  try {
    const { error } = await supabase
      .from('devices')
      .update({ state, is_online: isOnline, last_updated: new Date().toISOString() })
      .eq('id', deviceId);

    if (error) throw error;
  } catch (err) {
    console.error('Gagal update status perangkat:', err.message);
  }
};