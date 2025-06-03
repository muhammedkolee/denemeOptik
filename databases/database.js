import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

let database = null;

// Veritabanını aç ve cached tut
const getDatabase = async () => {
  if (!database) {
    try {
      database = await SQLite.openDatabaseAsync('datas.db');
    } catch (error) {
      console.error('Database connection error:', error);
      throw error;
    }
  }
  return database;
};

// Başlangıçta tabloyu oluştur (sadece bir kere oluşturulur)
export const initDatabase = async () => {
  try {
    const db = await getDatabase();
    await db.execAsync(
      `CREATE TABLE IF NOT EXISTS answer_keys (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        answers TEXT NOT NULL
      );`
    );
    return true;
  } catch (error) {
    console.error('Init database error:', error);
    Alert.alert("Bir hata oluştu: ", error.message);
    return false;
  }
};

// Cevap anahtarlarını getir
export const getAllAnswerKeys = async () => {
  try {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM answer_keys');
  } catch (error) {
    console.error('Get all keys error:', error);
    Alert.alert("Veri çekme hatası: ", error.message);
    return [];
  }
};

// Cevap anahtarını sil
export const deleteAnswer = async (id) => {
  try {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM answer_keys WHERE id = ?", [id]);
    Alert.alert("İşlem Başarılı!", "Cevap anahtarı başarıyla silindi.");
    return true;
  } catch (error) {
    console.error('Delete answer error:', error);
    Alert.alert("Silme işlemi sırasında bir hata oluştu!", error.message);
    throw error;
  }
};

// Yeni cevap anahtarı ekle
export const insertAnswerKey = async (name, answers) => {
  try {
    const db = await getDatabase();
    await db.runAsync('INSERT INTO answer_keys (name, answers) VALUES (?, ?)', [name, answers]);
    Alert.alert("İşlem başarılı!", "Cevap anahtarı kaydedildi.");
    return true;
  } catch (error) {
    console.error('Insert answer key error:', error);
    Alert.alert("Ekleme sırasında bir hata oluştu.\n", error.message);
    throw error; // Hata durumunda yukarı fırlat
  }
};

// Cevap anahtarını güncelle
export const updateAnswerKey = async (id, name, answers) => {
  try {
    const db = await getDatabase();
    await db.runAsync('UPDATE answer_keys SET name = ?, answers = ? WHERE id = ?', [name, answers, id]);
    Alert.alert("İşlem başarılı!", "Cevap anahtarı güncellendi.");
    return true;
  } catch (error) {
    console.error('Update answer key error:', error);
    Alert.alert("Güncelleme sırasında bir hata oluştu.\n", error.message);
    throw error;
  }
};

// Tek bir cevap anahtarı getir (detay)
export const getAnswerKeyById = async (id) => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync('SELECT * FROM answer_keys WHERE id = ?', [id]);
    return result;
  } catch (error) {
    console.error('Get answer key by id error:', error);
    Alert.alert("Veri çekme hatası: ", error.message);
    return null;
  }
};

// Veritabanı bağlantısını kapat (gerektiğinde)
export const closeDatabase = async () => {
  try {
    if (database) {
      await database.closeAsync();
      database = null;
    }
  } catch (error) {
    console.error('Close database error:', error);
  }
};

// Database instance'ını export et (gerektiğinde direkt erişim için)
export const getDb = () => database;