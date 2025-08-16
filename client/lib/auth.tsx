import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Kullanıcı tipi
export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  watchHistory: string[];
  watchlist: string[];
  createdAt: string;
}

// Auth context tipi
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// LocalStorage'de kullanıcıları saklama
const USERS_KEY = 'animewa_users';
const CURRENT_USER_KEY = 'animewa_current_user';

// Demo admin kullanıcısı
const DEMO_ADMIN = {
  id: 'admin_001',
  username: 'admin',
  email: 'admin@animewa.com',
  password: 'admin123', // Gerçek uygulamada hash'lenmeli
  isAdmin: true,
  watchHistory: [],
  watchlist: [],
  createdAt: new Date().toISOString()
};

// Kullanıcıları localStorage'den al
function getUsers(): (User & { password: string })[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    const users = stored ? JSON.parse(stored) : [];
    
    // Demo admin'i ekle eğer yoksa
    const hasAdmin = users.some((u: any) => u.email === DEMO_ADMIN.email);
    if (!hasAdmin) {
      users.push(DEMO_ADMIN);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    return users;
  } catch {
    // Hata durumunda demo admin'i döndür
    const users = [DEMO_ADMIN];
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users;
  }
}

// Kullanıcıları localStorage'e kaydet
function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Mevcut kullanıcıyı al
function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

// Mevcut kullanıcıyı kaydet
function setCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

// Basit şifre hash'leme (gerçek uygulamada bcrypt kullanılmalı)
function hashPassword(password: string): string {
  return btoa(password + 'animewa_salt');
}

// Auth Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Sayfa yüklendiğinde kullanıcıyı kontrol et
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const hashedPassword = hashPassword(password);
    
    const foundUser = users.find(u => 
      u.email === email && (u.password === hashedPassword || u.password === password)
    );
    
    if (foundUser) {
      const userWithoutPassword = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        isAdmin: foundUser.isAdmin,
        watchHistory: foundUser.watchHistory,
        watchlist: foundUser.watchlist,
        createdAt: foundUser.createdAt
      };
      
      setUser(userWithoutPassword);
      setCurrentUser(userWithoutPassword);
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    // E-posta zaten kayıtlı mı kontrol et
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password: hashPassword(password),
      isAdmin: false,
      watchHistory: [],
      watchlist: [],
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Kullanıcıyı otomatik giriş yap
    const userWithoutPassword = { ...newUser };
    delete (userWithoutPassword as any).password;
    
    setUser(userWithoutPassword);
    setCurrentUser(userWithoutPassword);
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({ children, requireAdmin = false }: { 
  children: ReactNode; 
  requireAdmin?: boolean; 
}) {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-anime-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Giriş Gerekli</h1>
          <p className="text-gray-400 mb-6">Bu sayfayı görmek için giriş yapmalısınız.</p>
          <button 
            onClick={() => window.location.href = '/'}
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
          <h1 className="text-2xl font-bold text-white mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-400 mb-6">Bu sayfaya erişim yetkiniz yok.</p>
          <button 
            onClick={() => window.location.href = '/'}
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
