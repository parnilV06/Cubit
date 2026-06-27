import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logoIcon from '../../assets/cubit-logo-icon-svg.svg'
import illustration from '../../assets/login-signup-illustration.png'
import './auth.css'

export default function Login() {
  const [showPassword] = useState(false)
  const navigate = useNavigate()

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    navigate('/profile')
  }

  return (
    <div className="auth-page">

      {/* ── Left: Illustration panel ── */}
      <div className="auth-illustration-panel">
        <img
          src={illustration}
          alt="Cuber with Rubik's cube"
          className="auth-illustration-img"
        />
        <div className="auth-illustration-text">
          <h2 className="auth-illustration-heading">Welcome Back</h2>
          <p className="auth-illustration-sub">Login and get Cubing !</p>
        </div>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="auth-form-panel">

        {/* Logo */}
        <div className="auth-logo-block">
          <img src={logoIcon} alt="Cubit Logo" className="auth-logo-icon" />
          <span className="auth-logo-wordmark">
            <span className="auth-logo-c">C</span> U B I T
          </span>
        </div>

        <form className="auth-form-card" onSubmit={handleLoginSubmit}>
          <h1 className="auth-page-title">Login to your Account</h1>

          {/* Google OAuth button */}
          <button type="button" className="auth-google-btn" id="login-google-btn">
            {/* Google multicolour "G" */}
            <svg className="auth-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="auth-divider">or Sign in with Email</div>

          {/* Fields */}
          <div className="auth-fields">
            <div className="auth-field-group">
              <label htmlFor="login-email" className="auth-label">Email</label>
              <input
                id="login-email"
                type="email"
                className="auth-input"
                placeholder="mail@abc.com"
                autoComplete="email"
              />
            </div>

            <div className="auth-field-group">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                placeholder="••••••••••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Remember / Forgot */}
          <div className="auth-options-row">
            <label className="auth-remember">
              <input
                type="checkbox"
                className="auth-remember-checkbox"
                id="login-remember"
                defaultChecked
              />
              <span className="auth-remember-label">Remember Me</span>
            </label>
            <a href="#forgot" className="auth-forgot-link" id="login-forgot-link">
              Forgot Password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" id="login-submit-btn">
            Login
          </button>

          {/* Redirect to signup */}
          <p className="auth-redirect">
            Not Registered Yet?
            <Link to="/signup" id="login-to-signup-link">Create an account</Link>
          </p>
        </form>
      </div>

    </div>
  )
}
