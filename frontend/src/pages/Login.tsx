import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ParticleNetwork } from '../components/ParticleNetwork';
import './Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (isRegister && password !== confirmPassword) {
        setError('As chaves de acesso não coincidem.');
        return;
    }

    setIsLoading(true);
    setError(null);

    // MODO PORTFÓLIO: Bypass de Criação de Conta
    if (isRegister) {
      setTimeout(() => {
        localStorage.setItem('lumina_token', 'lumina_portfolio_demo');
        navigate('/dashboard');
      }, 1500);
      return;
    }

    const query = `
      mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
        }
      }
    `;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { username, password } })
      });

      const result = await res.json();
      
      if (result.errors) {
        setError("Credenciais inválidas ou sem permissão de acesso.");
        setIsLoading(false);
        return;
      }

      if (result.data?.tokenAuth?.token) {
        localStorage.setItem('lumina_token', result.data.tokenAuth.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError("Falha ao comunicar com o servidor de autenticação.");
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <ParticleNetwork />
      <div className="gradient-layer layer-1"></div>
      <div className="gradient-layer layer-2"></div>
      <div className="gradient-layer layer-3"></div>

      <div className="login-container">
        <div className="status-badge">
          <span className="pulse-dot"></span>
          <span className="badge-text">{isRegister ? "CRIAÇÃO DE ACESSO" : "ÁREA RESTRITA"}</span>
        </div>

        <div className="header">
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="url(#gradient1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient1" x1="2" y1="2" x2="22" y2="22">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="100%" stopColor="#667eea"/>
                </linearGradient>
              </defs>
            </svg>
            <h1 className="logo-text">Lumina</h1>
          </div>
          <p className="subtitle">
            {isRegister ? "Conecte sua empresa ao motor financeiro" : "Autenticação do Sistema Core"}
          </p>
        </div>

        <form id="loginForm" className="login-form" onSubmit={handleLogin}>
          
          {error && (
            <div className="error-message">
              <svg style={{ width: '18px', height: '18px', stroke: 'currentColor', float: 'left', marginRight: '10px' }} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"/>
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"/>
              </svg>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="username" className="input-label">
              {isRegister ? "Nome da Empresa ou E-mail" : "Usuário ou E-mail"}
            </label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input 
                type="text" 
                id="username" 
                name="username"
                placeholder={isRegister ? "Sua Empresa S.A." : "Digite seu usuário"}
                autoComplete="username"
                value={username}
                onChange={(e) => {
                    setUsername(e.target.value);
                    if (error) setError(null);
                }}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">Chave de Acesso</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                type={showPassword ? "text" : "password"}
                id="password" 
                name="password"
                placeholder="••••••••"
                autoComplete={isRegister ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if(error) setError(null);
                }}
                required
              />
              <button 
                type="button" 
                className="toggle-password" 
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                ) : (
                  <svg className="eye-slash-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {isRegister && (
            <div className="input-group">
              <label htmlFor="confirmPassword" className="input-label">Confirmar Chave de Acesso</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword" 
                  name="confirmPassword"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if(error) setError(null);
                  }}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-options" style={{ marginTop: isRegister ? '0' : ''}}>
            {!isRegister && (
              <>
                <label className="checkbox-container">
                  <input type="checkbox" id="rememberMe" />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Lembrar-me</span>
                </label>
                <a href="#" className="forgot-link">Esqueceu a senha?</a>
              </>
            )}
          </div>

          <button type="submit" className={`submit-btn ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
            {!isLoading && <span className="btn-text">{isRegister ? "Criar Conta Válida" : "Acessar Engine"}</span>}
            {isLoading && (
              <span className="btn-loader">
                <span className="spinner"></span>
                {isRegister ? "Criando Operação..." : "Autenticando..."}
              </span>
            )}
            {!isLoading && (
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            )}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button 
              type="button"
              className="toggle-auth-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                transition: 'color 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {isRegister ? "Já possui uma conta? Fazer Login" : "Demonstração: Criar acesso de portfólio"}
            </button>
          </div>
        </form>

        <div className="footer">
          <div className="security-badge">
            <svg className="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Conexão Segura TLS 1.3</span>
          </div>
          <div className="version-info">
            <span>v2.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
