import { useState } from "react";
import { Search, Menu, X, User, Bell, Settings, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchDropdown from "@/components/SearchDropdown";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useAnimeStore } from "@/lib/animeStore";

interface HeaderProps {
  onAuthClick?: () => void;
}

export default function Header({ onAuthClick }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, markNotificationRead } = useAnimeStore();

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: t.home, href: "/" },
    { name: t.anime, href: "/anime?category=anime" },
    { name: t.movies, href: "/anime?category=movie" },
    { name: t.trending, href: "/anime?category=trending" },
    { name: t.myList, href: "/my-list" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-morphism">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold neon-text">
              Animewa
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-neon-blue transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <SearchDropdown
                  onClose={() => setIsSearchOpen(false)}
                  className="w-80"
                />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-neon-blue transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-32 bg-anime-card border-white/10">
                <DropdownMenuItem
                  onClick={() => setLanguage('tr')}
                  className={`text-white hover:bg-white/10 ${language === 'tr' ? 'bg-white/10' : ''}`}
                >
                  🇹🇷 Türkçe
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={`text-white hover:bg-white/10 ${language === 'en' ? 'bg-white/10' : ''}`}
                >
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Actions */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-neon-blue"
                >
                  <Bell className="h-5 w-5" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-neon-blue"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-anime-card border-white/10">
                    <DropdownMenuItem className="text-white hover:bg-white/10 font-medium">
                      {user?.username}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      {t.profile}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      İzleme Geçmişi
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      {t.myList}
                    </DropdownMenuItem>
                    {user?.isAdmin && (
                      <DropdownMenuItem
                        onClick={() => window.location.href = '/admin'}
                        className="text-neon-blue hover:bg-neon-blue/10"
                      >
                        {t.admin}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-white hover:bg-white/10">
                      <Settings className="h-4 w-4 mr-2" />
                      Ayarlar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                onClick={onAuthClick}
                className="btn-primary text-sm"
              >
                {t.signIn}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-neon-blue transition-colors duration-300 font-medium px-2 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              {!isAuthenticated && (
                <Button
                  onClick={() => {
                    onAuthClick?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="btn-primary text-sm w-fit"
                >
                  {t.signIn}
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
