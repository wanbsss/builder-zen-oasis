import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI, authToken } from "./apiClient";

// Kullanıcı tipi
export interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

// Auth context tipi
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde token'ı kontrol et
    const checkAuth = async () => {
      const token = authToken.get();
      if (token) {
        try {
          const response = await authAPI.verifyToken(token);
          if (response.success && response.user) {
            setUser({
              id: response.user.id,
              username: response.user.username,
              email: response.user.email,
              isAdmin: response.user.isAdmin
            });
          } else {
            authToken.remove();
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          authToken.remove();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);

      if (response.success && response.user) {
        setUser({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          isAdmin: response.user.isAdmin
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await authAPI.register(username, email, password);

      if (response.success && response.user) {
        setUser({
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          isAdmin: response.user.isAdmin
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode;
  requireAdmin?: boolean;
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-anime-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Giriş Gerekli</h1>
          <p className="text-gray-400 mb-6">
            Bu sayfayı görmek için giriş yapmalısınız.
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn-primary"
          >
            Ana Sayfaya Git
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-anime-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Yetkisiz Erişim
          </h1>
          <p className="text-gray-400 mb-6">Bu sayfaya erişim yetkiniz yok.</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="btn-primary"
          >
            Ana Sayfaya Git
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
