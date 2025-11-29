import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tareasApi } from '../api/tareasApi';

const TareasListScreen = ({ navigation }) => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtro, setFiltro] = useState('Todas');

  const cargarTareas = useCallback(async () => {
    try {
      setLoading(true);
      const estado = filtro === 'Todas' ? null : filtro;
      const data = await tareasApi.obtenerTareas(estado);
      setTareas(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las tareas');
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtro]);

  useEffect(() => {
    cargarTareas();
  }, [cargarTareas]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      cargarTareas();
    });
    return unsubscribe;
  }, [navigation, cargarTareas]);

  const onRefresh = () => {
    setRefreshing(true);
    cargarTareas();
  };

  const marcarCompletada = async (tarea) => {
    try {
      const nuevoEstado = tarea.estado === 'Completada' ? 'Pendiente' : 'Completada';
      await tareasApi.actualizarTarea(tarea.id, { estado: nuevoEstado });
      cargarTareas();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la tarea');
    }
  };

  const eliminarTarea = (id) => {
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
              await tareasApi.eliminarTarea(id);
              cargarTareas();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la tarea');
            }
          },
        },
      ]
    );
  };

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

  const renderTarea = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tareaCard,
        { borderLeftColor: getEstadoColor(item.estado) },
      ]}
      onPress={() => navigation.navigate('DetalleTarea', { tarea: item })}
    >
      <View style={styles.tareaHeader}>
        <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
          <Text style={[styles.estadoText, { color: getEstadoColor(item.estado) }]}>
            {item.estado}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => marcarCompletada(item)}
          style={styles.checkButton}
        >
          <Text style={styles.checkIcon}>
            {item.estado === 'Completada' ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.tareaTitle,
          item.estado === 'Completada' && styles.tareaCompletada,
        ]}
      >
        {item.titulo}
      </Text>

      {item.descripcion && (
        <Text style={styles.tareaDescripcion} numberOfLines={2}>
          {item.descripcion}
        </Text>
      )}

      <View style={styles.tareaFooter}>
        <Text style={styles.tareaFecha}>
          {new Date(item.fecha_creacion).toLocaleDateString('es-ES')}
        </Text>
        <TouchableOpacity onPress={() => eliminarTarea(item.id)}>
          <Text style={styles.deleteButton}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtrosContainer}>
        {['Todas', 'Pendiente', 'En Progreso', 'Completada'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filtroButton,
              filtro === f && styles.filtroButtonActive,
            ]}
            onPress={() => setFiltro(f)}
          >
            <Text
              style={[
                styles.filtroText,
                filtro === f && styles.filtroTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {tareas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No hay tareas</Text>
          <Text style={styles.emptyText}>Crea una nueva tarea para comenzar</Text>
        </View>
      ) : (
        <FlatList
          data={tareas}
          renderItem={renderTarea}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CrearTarea')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  filtrosContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filtroButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtroButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filtroText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  filtroTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 80, // Espacio para el FAB
  },
  tareaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 4,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  checkButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 18,
  },
  tareaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tareaCompletada: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  tareaDescripcion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  tareaFecha: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  fabIcon: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TareasListScreen;
