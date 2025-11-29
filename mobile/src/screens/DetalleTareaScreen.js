import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tareasApi } from '../api/tareasApi';

const DetalleTareaScreen = ({ route, navigation }) => {
  const { tarea } = route.params;
  const [loading, setLoading] = useState(false);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completada':
        return '#4caf50';
      case 'En Progreso':
        return '#2196f3';
      default:
        return '#ff9800';
    }
  };

  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);
      await tareasApi.actualizarTarea(tarea.id, { estado: nuevoEstado });
      Alert.alert('Éxito', 'Estado actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  const eliminarTarea = () => {
    Alert.alert(
      'Confirmar',
      '¿Estás seguro de eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await tareasApi.eliminarTarea(tarea.id);
              Alert.alert('Éxito', 'Tarea eliminada correctamente', [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('TareasList'),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(tarea.estado) + '20' }]}>
          <Text style={[styles.estadoText, { color: getEstadoColor(tarea.estado) }]}>
            {tarea.estado}
          </Text>
        </View>

        <Text style={styles.titulo}>{tarea.titulo}</Text>

        {tarea.descripcion && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.descripcion}>{tarea.descripcion}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Creada:</Text>
            <Text style={styles.infoValue}>{formatFecha(tarea.fecha_creacion)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Actualizada:</Text>
            <Text style={styles.infoValue}>{formatFecha(tarea.fecha_actualizacion)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambiar Estado</Text>
          <View style={styles.estadosContainer}>
            {['Pendiente', 'En Progreso', 'Completada'].map((estado) => (
              <TouchableOpacity
                key={estado}
                style={[
                  styles.estadoButton,
                  tarea.estado === estado && styles.estadoButtonActive,
                ]}
                onPress={() => cambiarEstado(estado)}
                disabled={loading || tarea.estado === estado}
              >
                <Text
                  style={[
                    styles.estadoButtonText,
                    tarea.estado === estado && styles.estadoButtonTextActive,
                  ]}
                >
                  {estado}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={eliminarTarea}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.deleteButtonText}>🗑️ Eliminar Tarea</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingBottom: 40, // Espacio extra para scroll
  },
  estadoBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
  },
  estadoText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  estadosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  estadoButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  estadoButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  estadoButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  estadoButtonTextActive: {
    color: '#fff',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#f44336',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DetalleTareaScreen;
