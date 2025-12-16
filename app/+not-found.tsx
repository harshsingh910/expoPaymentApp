import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Home, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.iconContainer}
        >
          <AlertCircle size={64} color="#ffffff" strokeWidth={2} />
        </LinearGradient>
        
        <Text style={styles.title}>Oops! Page Not Found</Text>
        <Text style={styles.subtitle}>
          The page you're looking for doesn't exist or has been moved.
        </Text>

        <Link href="/(tabs)" asChild>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <LinearGradient
              colors={['#7c3aed', '#5b21b6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Home size={20} color="#ffffff" strokeWidth={2.5} />
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f9fafb',
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
