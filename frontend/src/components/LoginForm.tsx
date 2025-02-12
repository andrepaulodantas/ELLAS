import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';

const LoginForm = () => {
  const { login, loading, error } = useAuth();
  const { translations } = useLanguage();

  // ... resto do componente
}; 